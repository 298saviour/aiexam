import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Create grade query (student)
router.post('/', authenticate, authorize(['student']), async (req, res) => {
  try {
    const { studentAnswerId, queryReason } = req.body;
    const studentId = req.user?.studentId;
    
    if (!studentAnswerId || !queryReason) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const query = `
      INSERT INTO grade_queries (student_answer_id, student_id, query_reason, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [studentAnswerId, studentId, queryReason]);
    
    // Mark answer as queried
    await pool.query('UPDATE student_answers SET is_queried = true WHERE id = $1', [studentAnswerId]);
    
    res.status(201).json({
      success: true,
      data: rows[0],
      message: 'Grade query submitted successfully'
    });
  } catch (error) {
    console.error('Error creating grade query:', error);
    res.status(500).json({ success: false, error: 'Failed to submit query' });
  }
});

// Get all grade queries (teacher/admin)
router.get('/', authenticate, authorize(['teacher', 'admin']), async (req, res) => {
  try {
    const query = `
      SELECT 
        gq.*, 
        s.full_name as student_name,
        sa.question_id, sa.answer_text, sa.ai_score, sa.ai_feedback,
        q.question_text, q.marks as max_marks,
        e.title as exam_title
      FROM grade_queries gq
      JOIN students s ON gq.student_id = s.id
      JOIN student_answers sa ON gq.student_answer_id = sa.id
      JOIN questions q ON sa.question_id = q.id
      JOIN exams e ON sa.exam_id = e.id
      ORDER BY gq.created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching grade queries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch queries' });
  }
});

// Get student's queries
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const query = `
      SELECT 
        gq.*, 
        sa.question_id, sa.answer_text, sa.ai_score, sa.teacher_score,
        q.question_text, q.marks as max_marks,
        e.title as exam_title
      FROM grade_queries gq
      JOIN student_answers sa ON gq.student_answer_id = sa.id
      JOIN questions q ON sa.question_id = q.id
      JOIN exams e ON sa.exam_id = e.id
      WHERE gq.student_id = $1
      ORDER BY gq.created_at DESC
    `;
    
    const { rows } = await pool.query(query, [studentId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching student queries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch queries' });
  }
});

// Respond to query (teacher)
router.put('/:id/respond', authenticate, authorize(['teacher', 'admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { teacherResponse, adjustedScore } = req.body;
    
    if (!teacherResponse) {
      return res.status(400).json({ success: false, error: 'Teacher response is required' });
    }
    
    // Update query
    const updateQuery = `
      UPDATE grade_queries 
      SET teacher_response = $1,
          status = 'resolved',
          resolved_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const { rows } = await client.query(updateQuery, [teacherResponse, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Query not found' });
    }
    
    // Update student answer if score adjusted
    if (adjustedScore !== undefined) {
      await client.query(
        'UPDATE student_answers SET teacher_score = $1, teacher_feedback = $2 WHERE id = $3',
        [adjustedScore, teacherResponse, rows[0].student_answer_id]
      );
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: rows[0],
      message: 'Query resolved successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error responding to query:', error);
    res.status(500).json({ success: false, error: 'Failed to respond to query' });
  } finally {
    client.release();
  }
});

export default router;
