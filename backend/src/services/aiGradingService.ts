import OpenAI from 'openai';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { StudentExam } from '../models/StudentExam';
import { Exam } from '../models/Exam';
import { Question } from '../models/Question';
import { AIRemark } from '../models/AIRemark';
import { AILog } from '../models/AILog';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

interface GradingResult {
  score: number;
  totalPoints: number;
  feedback: string;
  questionFeedback: Array<{
    questionId: number;
    score: number;
    feedback: string;
  }>;
}

export class AIGradingService {
  async gradeExam(studentExamId: number): Promise<GradingResult> {
    const jobId = `grade-${studentExamId}-${Date.now()}`;
    
    try {
      // Log AI job start
      await AILog.create({
        jobId,
        actionType: 'grading',
        status: 'running',
        inputSummary: `Grading student exam ${studentExamId}`,
      });

      // Get student exam with questions
      const studentExam = await StudentExam.findByPk(studentExamId, {
        include: [
          {
            model: Exam,
            as: 'exam',
            include: [{ model: Question, as: 'questions' }],
          },
        ],
      });

      if (!studentExam) {
        throw new Error('Student exam not found');
      }

      const exam = studentExam.exam;
      const questions = exam.questions || [];
      const answers = studentExam.answers as any;

      let totalScore = 0;
      let totalPoints = 0;
      const questionFeedback: any[] = [];

      // Grade each question
      for (const question of questions) {
        totalPoints += question.points;
        const studentAnswer = answers[question.id];

        if (!studentAnswer) {
          questionFeedback.push({
            questionId: question.id,
            score: 0,
            feedback: 'No answer provided',
          });
          continue;
        }

        // MCQ - Auto grade
        if (question.options) {
          const isCorrect = studentAnswer === question.answerKey;
          const score = isCorrect ? question.points : 0;
          totalScore += score;

          questionFeedback.push({
            questionId: question.id,
            score,
            feedback: isCorrect ? 'Correct answer' : `Incorrect. Correct answer: ${question.answerKey}`,
          });
        } else {
          // Written answer - AI grade
          const result = await this.gradeWrittenAnswer(
            question.questionText,
            question.answerKey || '',
            studentAnswer,
            question.points
          );

          totalScore += result.score;
          questionFeedback.push({
            questionId: question.id,
            score: result.score,
            feedback: result.feedback,
          });
        }
      }

      // Generate overall feedback
      const overallFeedback = await this.generateOverallFeedback(
        exam.title,
        totalScore,
        totalPoints,
        questionFeedback
      );

      // Update student exam with score
      await studentExam.update({
        score: (totalScore / totalPoints) * 100,
        aiRemarks: overallFeedback,
      });

      // Create AI remark record
      await AIRemark.create({
        studentExamId,
        courseId: exam.courseId,
        score: (totalScore / totalPoints) * 100,
        remark: overallFeedback,
      });

      // Log success
      await AILog.update(
        {
          status: 'completed',
          outputSummary: `Score: ${totalScore}/${totalPoints}`,
        },
        { where: { jobId } }
      );

      logger.info({ studentExamId, score: totalScore, totalPoints }, 'Exam graded successfully');

      return {
        score: totalScore,
        totalPoints,
        feedback: overallFeedback,
        questionFeedback,
      };
    } catch (error) {
      // Log failure
      await AILog.update(
        {
          status: 'failed',
          errorTrace: error instanceof Error ? error.message : 'Unknown error',
        },
        { where: { jobId } }
      );

      logger.error({ error, studentExamId }, 'Exam grading failed');
      throw error;
    }
  }

  private async gradeWrittenAnswer(
    question: string,
    modelAnswer: string,
    studentAnswer: string,
    maxPoints: number
  ): Promise<{ score: number; feedback: string }> {
    try {
      const prompt = `You are an expert teacher grading a student's written answer.

Question: ${question}

Model Answer: ${modelAnswer}

Student's Answer: ${studentAnswer}

Maximum Points: ${maxPoints}

Please evaluate the student's answer and provide:
1. A score out of ${maxPoints} points
2. Constructive feedback explaining the score

Respond in JSON format:
{
  "score": <number>,
  "feedback": "<string>"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        score: Math.min(result.score || 0, maxPoints),
        feedback: result.feedback || 'Unable to generate feedback',
      };
    } catch (error) {
      logger.error({ error }, 'AI grading error for written answer');
      return {
        score: 0,
        feedback: 'Error grading answer. Please review manually.',
      };
    }
  }

  private async generateOverallFeedback(
    examTitle: string,
    score: number,
    totalPoints: number,
    questionFeedback: any[]
  ): Promise<string> {
    try {
      const percentage = (score / totalPoints) * 100;
      const feedbackSummary = questionFeedback
        .map((q) => `Q${q.questionId}: ${q.score} points - ${q.feedback}`)
        .join('\n');

      const prompt = `You are an expert teacher providing overall feedback on an exam.

Exam: ${examTitle}
Score: ${score}/${totalPoints} (${percentage.toFixed(1)}%)

Question-by-question feedback:
${feedbackSummary}

Please provide:
1. Overall performance summary
2. Strengths demonstrated
3. Areas for improvement
4. Encouraging closing remark

Keep it concise (3-4 sentences).`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      });

      return response.choices[0].message.content || 'Good effort on this exam!';
    } catch (error) {
      logger.error({ error }, 'Error generating overall feedback');
      return `You scored ${score}/${totalPoints} (${((score / totalPoints) * 100).toFixed(1)}%). Keep up the good work!`;
    }
  }
}

export const aiGradingService = new AIGradingService();
