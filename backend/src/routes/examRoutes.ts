import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import { enhancedAIGradingService } from '../services/enhancedAIGradingService';

const router = Router();

// Get all exams
router.get('/', authenticate, async (req, res) => {
  try {
    const { courseId, term, status } = req.query;
    
    let query = `
      SELECT 
        e.*, c.name as course_name,
        COUNT(DISTINCT eq.question_id) as question_count,
        t.full_name as created_by_name
      FROM exams e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN exam_questions eq ON e.id = eq.exam_id
      LEFT JOIN teachers t ON e.created_by = t.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 1;
    
    if (courseId) {
      query += ` AND e.course_id = $${paramCount}`;
      params.push(courseId);
      paramCount++;
    }
    
    if (term) {
      query += ` AND e.term = $${paramCount}`;
      params.push(term);
      paramCount++;
    }
    
    if (status) {
      query += ` AND e.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    query += ` GROUP BY e.id, c.name, t.full_name ORDER BY e.created_at DESC`;
    
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch exams' });
  }
});

// Get single exam with questions
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const examQuery = `
      SELECT 
        e.*, c.name as course_name,
        t.full_name as created_by_name
      FROM exams e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN teachers t ON e.created_by = t.id
      WHERE e.id = $1
    `;
    
    const examResult = await pool.query(examQuery, [id]);
    
    if (examResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }
    
    const exam = examResult.rows[0];
    
    // Get questions
    const questionsQuery = `
      SELECT 
        q.*, eq.question_order,
        json_agg(DISTINCT qo.*) FILTER (WHERE qo.id IS NOT NULL) as options,
        json_agg(DISTINCT qa.*) FILTER (WHERE qa.id IS NOT NULL) as acceptable_answers
      FROM exam_questions eq
      JOIN questions q ON eq.question_id = q.id
      LEFT JOIN question_options qo ON q.id = qo.question_id
      LEFT JOIN question_answers qa ON q.id = qa.question_id
      WHERE eq.exam_id = $1
      GROUP BY q.id, eq.question_order
      ORDER BY eq.question_order
    `;
    
    const questionsResult = await pool.query(questionsQuery, [id]);
    exam.questions = questionsResult.rows;
    
    res.json({ success: true, data: exam });
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch exam' });
  }
});

// Create exam
router.post('/', authenticate, authorize(['admin', 'teacher']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      title, description, courseId, term, examType,
      duration, totalMarks, passMark, scheduledDate, scheduledTime,
      instructions, classIds, questionIds
    } = req.body;
    
    // Validate required fields
    if (!title || !courseId || !term || !examType || !duration || !totalMarks) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Create exam
    const examResult = await client.query(
      `INSERT INTO exams (
        title, description, course_id, term, exam_type,
        duration, total_marks, pass_mark, scheduled_date, scheduled_time,
        instructions, status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        title, description, courseId, term, examType,
        duration, totalMarks, passMark, scheduledDate, scheduledTime,
        instructions, 'draft', req.user?.id
      ]
    );
    
    const exam = examResult.rows[0];
    
    // Add questions to exam
    if (questionIds && questionIds.length > 0) {
      for (let i = 0; i < questionIds.length; i++) {
        await client.query(
          'INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES ($1, $2, $3)',
          [exam.id, questionIds[i], i + 1]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: exam,
      message: 'Exam created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating exam:', error);
    res.status(500).json({ success: false, error: 'Failed to create exam' });
  } finally {
    client.release();
  }
});

// Update exam
router.put('/:id', authenticate, authorize(['admin', 'teacher']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const {
      title, description, term, examType, duration, totalMarks, passMark,
      scheduledDate, scheduledTime, instructions, status, questionIds
    } = req.body;
    
    // Update exam
    const updateQuery = `
      UPDATE exams 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          term = COALESCE($3, term),
          exam_type = COALESCE($4, exam_type),
          duration = COALESCE($5, duration),
          total_marks = COALESCE($6, total_marks),
          pass_mark = COALESCE($7, pass_mark),
          scheduled_date = COALESCE($8, scheduled_date),
          scheduled_time = COALESCE($9, scheduled_time),
          instructions = COALESCE($10, instructions),
          status = COALESCE($11, status),
          updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `;
    
    const { rows } = await client.query(updateQuery, [
      title, description, term, examType, duration, totalMarks, passMark,
      scheduledDate, scheduledTime, instructions, status, id
    ]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }
    
    // Update questions if provided
    if (questionIds) {
      await client.query('DELETE FROM exam_questions WHERE exam_id = $1', [id]);
      
      for (let i = 0; i < questionIds.length; i++) {
        await client.query(
          'INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES ($1, $2, $3)',
          [id, questionIds[i], i + 1]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: rows[0],
      message: 'Exam updated successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating exam:', error);
    res.status(500).json({ success: false, error: 'Failed to update exam' });
  } finally {
    client.release();
  }
});

// Delete exam
router.delete('/:id', authenticate, authorize(['admin', 'teacher']), async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM exams WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ success: false, error: 'Failed to delete exam' });
  }
});

// Submit exam (student)
router.post('/:id/submit', authenticate, authorize(['student']), async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // answers is an object: { questionId: answer }
    const studentId = req.user?.studentId;
    
    if (!studentId) {
      return res.status(400).json({ success: false, error: 'Student ID not found' });
    }
    
    // Grade the exam using AI
    const gradingResult = await enhancedAIGradingService.gradeExamSubmission(
      parseInt(id),
      studentId,
      answers
    );
    
    res.json({
      success: true,
      data: gradingResult,
      message: 'Exam submitted and graded successfully'
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ success: false, error: 'Failed to submit exam' });
  }
});

// Get exam results for a student
router.get('/:id/results/:studentId', authenticate, async (req, res) => {
  try {
    const { id, studentId } = req.params;
    
    const query = `
      SELECT 
        sa.*, q.question_text, q.question_type, q.marks as max_marks
      FROM student_answers sa
      JOIN questions q ON sa.question_id = q.id
      WHERE sa.exam_id = $1 AND sa.student_id = $2
      ORDER BY q.id
    `;
    
    const { rows } = await pool.query(query, [id, studentId]);
    
    // Calculate totals
    const totalScore = rows.reduce((sum, r) => sum + (r.ai_score || 0), 0);
    const maxScore = rows.reduce((sum, r) => sum + r.max_marks, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    
    res.json({
      success: true,
      data: {
        answers: rows,
        totalScore,
        maxScore,
        percentage
      }
    });
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch results' });
  }
});

export default router;
