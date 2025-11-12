import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get all questions
router.get('/', authenticate, async (req, res) => {
  try {
    const { courseId, topic, difficulty, term, questionType } = req.query;
    
    let query = `
      SELECT 
        q.*, c.name as course_name,
        t.full_name as created_by_name,
        json_agg(DISTINCT qo.*) FILTER (WHERE qo.id IS NOT NULL) as options,
        json_agg(DISTINCT qa.*) FILTER (WHERE qa.id IS NOT NULL) as acceptable_answers
      FROM questions q
      JOIN courses c ON q.course_id = c.id
      LEFT JOIN teachers t ON q.created_by = t.id
      LEFT JOIN question_options qo ON q.id = qo.question_id
      LEFT JOIN question_answers qa ON q.id = qa.question_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 1;
    
    if (courseId) {
      query += ` AND q.course_id = $${paramCount}`;
      params.push(courseId);
      paramCount++;
    }
    
    if (topic) {
      query += ` AND q.topic ILIKE $${paramCount}`;
      params.push(`%${topic}%`);
      paramCount++;
    }
    
    if (difficulty) {
      query += ` AND q.difficulty = $${paramCount}`;
      params.push(difficulty);
      paramCount++;
    }
    
    if (term) {
      query += ` AND q.term_created = $${paramCount}`;
      params.push(term);
      paramCount++;
    }
    
    if (questionType) {
      query += ` AND q.question_type = $${paramCount}`;
      params.push(questionType);
      paramCount++;
    }
    
    query += ` GROUP BY q.id, c.name, t.full_name ORDER BY q.created_at DESC`;
    
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch questions' });
  }
});

// Get single question
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        q.*, c.name as course_name,
        json_agg(DISTINCT qo.* ORDER BY qo.option_order) FILTER (WHERE qo.id IS NOT NULL) as options,
        json_agg(DISTINCT qa.*) FILTER (WHERE qa.id IS NOT NULL) as acceptable_answers
      FROM questions q
      JOIN courses c ON q.course_id = c.id
      LEFT JOIN question_options qo ON q.id = qo.question_id
      LEFT JOIN question_answers qa ON q.id = qa.question_id
      WHERE q.id = $1
      GROUP BY q.id, c.name
    `;
    
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch question' });
  }
});

// Create question
router.post('/', authenticate, authorize(['admin', 'teacher']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      questionText, questionType, courseId, topic, difficulty, marks,
      options, correctAnswer, acceptableAnswers, keywords, explanation
    } = req.body;
    
    if (!questionText || !questionType || !courseId || !topic || !difficulty || !marks) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Get current term
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    let term = '1st Term';
    if (month >= 4 && month <= 8) term = '2nd Term';
    else if (month >= 9 && month <= 12) term = '3rd Term';
    
    // Create question
    const questionResult = await client.query(
      `INSERT INTO questions (
        question_text, question_type, course_id, topic, difficulty, marks,
        term_created, explanation, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [questionText, questionType, courseId, topic, difficulty, marks, term, explanation, req.user?.id]
    );
    const question = questionResult.rows[0];
    
    // Add options for MCQ
    if (questionType === 'MCQ' && options && options.length > 0) {
      for (let i = 0; i < options.length; i++) {
        const isCorrect = correctAnswer === i || correctAnswer === options[i];
        await client.query(
          'INSERT INTO question_options (question_id, option_text, is_correct, option_order) VALUES ($1, $2, $3, $4)',
          [question.id, options[i], isCorrect, i + 1]
        );
      }
    }
    
    // Add acceptable answers for essays/long text
    if (['Essay', 'Long Text'].includes(questionType) && acceptableAnswers && acceptableAnswers.length > 0) {
      for (const answer of acceptableAnswers) {
        if (answer.trim()) {
          await client.query(
            'INSERT INTO question_answers (question_id, answer_text, keywords) VALUES ($1, $2, $3)',
            [question.id, answer, keywords || []]
          );
        }
      }
    }
    
    // Add correct answer for True/False and Short Answer
    if (['True/False', 'Short Answer'].includes(questionType) && correctAnswer) {
      await client.query(
        'INSERT INTO question_answers (question_id, answer_text) VALUES ($1, $2)',
        [question.id, correctAnswer]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: question,
      message: 'Question created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating question:', error);
    res.status(500).json({ success: false, error: 'Failed to create question' });
  } finally {
    client.release();
  }
});

// Update question
router.put('/:id', authenticate, authorize(['admin', 'teacher']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const {
      questionText, questionType, courseId, topic, difficulty, marks,
      options, correctAnswer, acceptableAnswers, keywords, explanation
    } = req.body;
    
    // Update question
    const updateQuery = `
      UPDATE questions 
      SET question_text = COALESCE($1, question_text),
          question_type = COALESCE($2, question_type),
          course_id = COALESCE($3, course_id),
          topic = COALESCE($4, topic),
          difficulty = COALESCE($5, difficulty),
          marks = COALESCE($6, marks),
          explanation = COALESCE($7, explanation),
          updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `;
    
    const { rows } = await client.query(updateQuery, [
      questionText, questionType, courseId, topic, difficulty, marks, explanation, id
    ]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    
    // Update options if provided
    if (options) {
      await client.query('DELETE FROM question_options WHERE question_id = $1', [id]);
      
      for (let i = 0; i < options.length; i++) {
        const isCorrect = correctAnswer === i || correctAnswer === options[i];
        await client.query(
          'INSERT INTO question_options (question_id, option_text, is_correct, option_order) VALUES ($1, $2, $3, $4)',
          [id, options[i], isCorrect, i + 1]
        );
      }
    }
    
    // Update acceptable answers if provided
    if (acceptableAnswers) {
      await client.query('DELETE FROM question_answers WHERE question_id = $1', [id]);
      
      for (const answer of acceptableAnswers) {
        if (answer.trim()) {
          await client.query(
            'INSERT INTO question_answers (question_id, answer_text, keywords) VALUES ($1, $2, $3)',
            [id, answer, keywords || []]
          );
        }
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: rows[0],
      message: 'Question updated successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating question:', error);
    res.status(500).json({ success: false, error: 'Failed to update question' });
  } finally {
    client.release();
  }
});

// Delete question
router.delete('/:id', authenticate, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ success: false, error: 'Failed to delete question' });
  }
});

// Get questions by course
router.get('/by-course/:courseId', authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const query = `
      SELECT q.*, 
        json_agg(DISTINCT qo.* ORDER BY qo.option_order) FILTER (WHERE qo.id IS NOT NULL) as options
      FROM questions q
      LEFT JOIN question_options qo ON q.id = qo.question_id
      WHERE q.course_id = $1
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `;
    
    const { rows } = await pool.query(query, [courseId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching questions by course:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch questions' });
  }
});

export default router;
