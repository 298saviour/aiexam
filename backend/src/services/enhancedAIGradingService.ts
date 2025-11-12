import OpenAI from 'openai';
import { pool } from '../config/database';
import { logger } from '../config/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QuestionGradingResult {
  questionId: number;
  score: number;
  maxScore: number;
  confidence: number;
  feedback: string;
  aiReasoning: string;
}

interface ExamGradingResult {
  examId: number;
  studentId: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  questionResults: QuestionGradingResult[];
  overallFeedback: string;
  gradedAt: Date;
}

export class EnhancedAIGradingService {
  /**
   * Grade an entire exam submission
   */
  async gradeExamSubmission(examId: number, studentId: number, answers: Record<number, any>): Promise<ExamGradingResult> {
    try {
      // Get exam questions with acceptable answers
      const questionsQuery = `
        SELECT 
          q.id, q.question_text, q.question_type, q.marks,
          json_agg(DISTINCT qo.*) FILTER (WHERE qo.id IS NOT NULL) as options,
          json_agg(DISTINCT qa.*) FILTER (WHERE qa.id IS NOT NULL) as acceptable_answers
        FROM exam_questions eq
        JOIN questions q ON eq.question_id = q.id
        LEFT JOIN question_options qo ON q.id = qo.question_id
        LEFT JOIN question_answers qa ON q.id = qa.question_id
        WHERE eq.exam_id = $1
        GROUP BY q.id
        ORDER BY eq.question_order
      `;

      const { rows: questions } = await pool.query(questionsQuery, [examId]);

      let totalScore = 0;
      let maxScore = 0;
      const questionResults: QuestionGradingResult[] = [];

      // Grade each question
      for (const question of questions) {
        maxScore += question.marks;
        const studentAnswer = answers[question.id];

        let result: QuestionGradingResult;

        switch (question.question_type) {
          case 'MCQ':
            result = await this.gradeMCQ(question, studentAnswer);
            break;
          case 'True/False':
            result = await this.gradeTrueFalse(question, studentAnswer);
            break;
          case 'Short Answer':
            result = await this.gradeShortAnswer(question, studentAnswer);
            break;
          case 'Essay':
          case 'Long Text':
            result = await this.gradeEssay(question, studentAnswer);
            break;
          default:
            result = {
              questionId: question.id,
              score: 0,
              maxScore: question.marks,
              confidence: 0,
              feedback: 'Unknown question type',
              aiReasoning: 'Cannot grade unknown question type'
            };
        }

        totalScore += result.score;
        questionResults.push(result);

        // Save individual answer
        await this.saveStudentAnswer(examId, studentId, result, studentAnswer);

        // Log AI grading action
        await this.logAIAction(examId, studentId, question.id, result);
      }

      const percentage = (totalScore / maxScore) * 100;

      // Generate overall feedback
      const overallFeedback = await this.generateOverallFeedback(
        examId,
        totalScore,
        maxScore,
        questionResults
      );

      const gradingResult: ExamGradingResult = {
        examId,
        studentId,
        totalScore,
        maxScore,
        percentage,
        questionResults,
        overallFeedback,
        gradedAt: new Date(),
      };

      return gradingResult;
    } catch (error) {
      logger.error({ error, examId, studentId }, 'Error grading exam submission');
      throw error;
    }
  }

  /**
   * Grade MCQ question
   */
  private async gradeMCQ(question: any, studentAnswer: any): Promise<QuestionGradingResult> {
    const options = question.options || [];
    const correctOption = options.find((opt: any) => opt.is_correct);

    const isCorrect = studentAnswer === correctOption?.option_text;
    const score = isCorrect ? question.marks : 0;

    return {
      questionId: question.id,
      score,
      maxScore: question.marks,
      confidence: 1.0, // MCQ is deterministic
      feedback: isCorrect 
        ? 'Correct answer!' 
        : `Incorrect. The correct answer is: ${correctOption?.option_text}`,
      aiReasoning: 'Direct comparison with correct option'
    };
  }

  /**
   * Grade True/False question
   */
  private async gradeTrueFalse(question: any, studentAnswer: any): Promise<QuestionGradingResult> {
    const correctAnswer = question.acceptable_answers?.[0]?.answer_text;
    const isCorrect = studentAnswer === correctAnswer;
    const score = isCorrect ? question.marks : 0;

    return {
      questionId: question.id,
      score,
      maxScore: question.marks,
      confidence: 1.0,
      feedback: isCorrect 
        ? 'Correct!' 
        : `Incorrect. The correct answer is: ${correctAnswer}`,
      aiReasoning: 'Direct comparison with correct answer'
    };
  }

  /**
   * Grade Short Answer with AI
   */
  private async gradeShortAnswer(question: any, studentAnswer: string): Promise<QuestionGradingResult> {
    if (!studentAnswer || studentAnswer.trim() === '') {
      return {
        questionId: question.id,
        score: 0,
        maxScore: question.marks,
        confidence: 1.0,
        feedback: 'No answer provided',
        aiReasoning: 'Empty answer'
      };
    }

    const acceptableAnswers = question.acceptable_answers || [];
    const correctAnswer = acceptableAnswers[0]?.answer_text || '';

    try {
      const prompt = `You are grading a short answer question. Be lenient with spelling and phrasing.

Question: ${question.question_text}

Correct Answer: ${correctAnswer}

Student's Answer: ${studentAnswer}

Maximum Marks: ${question.marks}

Evaluate if the student's answer conveys the same meaning as the correct answer. Award full marks if the core concept is correct, even if wording differs. Award partial marks if partially correct.

Respond in JSON format:
{
  "score": <number between 0 and ${question.marks}>,
  "confidence": <number between 0 and 1>,
  "feedback": "<brief feedback>",
  "reasoning": "<why you gave this score>"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        questionId: question.id,
        score: Math.min(Math.max(result.score || 0, 0), question.marks),
        maxScore: question.marks,
        confidence: result.confidence || 0.8,
        feedback: result.feedback || 'Answer evaluated',
        aiReasoning: result.reasoning || 'AI evaluation'
      };
    } catch (error) {
      logger.error({ error, questionId: question.id }, 'Error grading short answer');
      return {
        questionId: question.id,
        score: 0,
        maxScore: question.marks,
        confidence: 0,
        feedback: 'Error grading answer. Please request manual review.',
        aiReasoning: 'AI grading failed'
      };
    }
  }

  /**
   * Grade Essay/Long Text with leniency
   */
  private async gradeEssay(question: any, studentAnswer: string): Promise<QuestionGradingResult> {
    if (!studentAnswer || studentAnswer.trim() === '') {
      return {
        questionId: question.id,
        score: 0,
        maxScore: question.marks,
        confidence: 1.0,
        feedback: 'No answer provided',
        aiReasoning: 'Empty answer'
      };
    }

    const acceptableAnswers = question.acceptable_answers || [];
    const keywords = acceptableAnswers.flatMap((ans: any) => ans.keywords || []);

    try {
      const acceptableAnswersText = acceptableAnswers
        .map((ans: any, idx: number) => `${idx + 1}. ${ans.answer_text}`)
        .join('\n');

      const prompt = `You are grading an essay question. Grade with LENIENCY - if the student demonstrates understanding of the concept, award marks even if the answer doesn't match exactly.

Question: ${question.question_text}

Acceptable Answers (any of these or similar concepts):
${acceptableAnswersText}

Important Keywords: ${keywords.join(', ')}

Student's Answer: ${studentAnswer}

Maximum Marks: ${question.marks}

Grading Guidelines:
- Award FULL marks if the student demonstrates clear understanding, even if wording differs
- Award PARTIAL marks (60-80%) if the answer relates to the topic but lacks detail
- Award MINIMAL marks (30-50%) if the answer shows some understanding but is incomplete
- Only award 0 if the answer is completely unrelated or wrong

Consider:
1. Does the answer address the question?
2. Are key concepts mentioned?
3. Is there logical reasoning?
4. Are important keywords present?

Respond in JSON format:
{
  "score": <number between 0 and ${question.marks}>,
  "confidence": <number between 0 and 1>,
  "feedback": "<constructive feedback explaining the score>",
  "reasoning": "<detailed explanation of grading decision>",
  "strengths": "<what the student did well>",
  "improvements": "<what could be improved>"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.4, // Slightly higher for more nuanced grading
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      const feedback = `${result.feedback}\n\nStrengths: ${result.strengths}\nAreas for improvement: ${result.improvements}`;

      return {
        questionId: question.id,
        score: Math.min(Math.max(result.score || 0, 0), question.marks),
        maxScore: question.marks,
        confidence: result.confidence || 0.7,
        feedback,
        aiReasoning: result.reasoning || 'AI evaluation with leniency'
      };
    } catch (error) {
      logger.error({ error, questionId: question.id }, 'Error grading essay');
      return {
        questionId: question.id,
        score: question.marks * 0.5, // Give 50% as fallback with leniency
        maxScore: question.marks,
        confidence: 0.3,
        feedback: 'AI grading encountered an error. Partial marks awarded. Please request manual review for accurate grading.',
        aiReasoning: 'Fallback grading due to AI error'
      };
    }
  }

  /**
   * Generate overall feedback for the exam
   */
  private async generateOverallFeedback(
    examId: number,
    totalScore: number,
    maxScore: number,
    questionResults: QuestionGradingResult[]
  ): Promise<string> {
    try {
      const percentage = (totalScore / maxScore) * 100;
      const questionSummary = questionResults
        .map(q => `Q${q.questionId}: ${q.score}/${q.maxScore} - ${q.feedback}`)
        .join('\n');

      const prompt = `You are an encouraging teacher providing overall exam feedback.

Score: ${totalScore}/${maxScore} (${percentage.toFixed(1)}%)

Question-by-question results:
${questionSummary}

Provide warm, encouraging feedback that:
1. Acknowledges the student's effort
2. Highlights strengths
3. Gently suggests areas for improvement
4. Ends with motivation

Keep it concise (4-5 sentences) and positive in tone.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 250,
      });

      return response.choices[0].message.content || `You scored ${percentage.toFixed(1)}%. Keep up the good work!`;
    } catch (error) {
      logger.error({ error }, 'Error generating overall feedback');
      const percentage = (totalScore / maxScore) * 100;
      return `You scored ${totalScore}/${maxScore} (${percentage.toFixed(1)}%). Great effort on this exam!`;
    }
  }

  /**
   * Save student answer to database
   */
  private async saveStudentAnswer(
    examId: number,
    studentId: number,
    result: QuestionGradingResult,
    answerText: any
  ): Promise<void> {
    const query = `
      INSERT INTO student_answers (
        exam_id, student_id, question_id, answer_text,
        ai_score, ai_confidence, ai_feedback, graded_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (exam_id, student_id, question_id)
      DO UPDATE SET
        answer_text = EXCLUDED.answer_text,
        ai_score = EXCLUDED.ai_score,
        ai_confidence = EXCLUDED.ai_confidence,
        ai_feedback = EXCLUDED.ai_feedback,
        graded_at = NOW()
    `;

    await pool.query(query, [
      examId,
      studentId,
      result.questionId,
      typeof answerText === 'string' ? answerText : JSON.stringify(answerText),
      result.score,
      result.confidence,
      result.feedback
    ]);
  }

  /**
   * Log AI grading action
   */
  private async logAIAction(
    examId: number,
    studentId: number,
    questionId: number,
    result: QuestionGradingResult
  ): Promise<void> {
    const query = `
      INSERT INTO ai_logs (
        log_type, exam_id, student_id, action, details, confidence_score
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await pool.query(query, [
      'grading',
      examId,
      studentId,
      `Graded question ${questionId}`,
      JSON.stringify({
        questionId,
        score: result.score,
        maxScore: result.maxScore,
        feedback: result.feedback,
        reasoning: result.aiReasoning
      }),
      result.confidence
    ]);
  }
}

export const enhancedAIGradingService = new EnhancedAIGradingService();
