import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Create teacher rating (student only)
router.post('/', authenticate, authorize(['student']), async (req, res) => {
  try {
    const { teacherId, rating, reviewText, isAnonymous } = req.body;
    const studentId = req.user?.studentId;
    
    if (!teacherId || !rating) {
      return res.status(400).json({ success: false, error: 'Teacher ID and rating are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }
    
    const query = `
      INSERT INTO teacher_reviews (teacher_id, student_id, rating, review_text, is_anonymous)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (teacher_id, student_id) 
      DO UPDATE SET 
        rating = EXCLUDED.rating,
        review_text = EXCLUDED.review_text,
        is_anonymous = EXCLUDED.is_anonymous,
        created_at = NOW()
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [teacherId, studentId, rating, reviewText || null, isAnonymous || false]);
    
    res.status(201).json({
      success: true,
      data: rows[0],
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ success: false, error: 'Failed to submit rating' });
  }
});

// Get teacher's ratings
router.get('/teacher/:teacherId', authenticate, async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const query = `
      SELECT 
        tr.*,
        CASE 
          WHEN tr.is_anonymous THEN 'Anonymous'
          ELSE s.full_name
        END as student_name
      FROM teacher_reviews tr
      LEFT JOIN students s ON tr.student_id = s.id
      WHERE tr.teacher_id = $1
      ORDER BY tr.created_at DESC
    `;
    
    const { rows } = await pool.query(query, [teacherId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ratings' });
  }
});

// Get teacher's average rating
router.get('/average/:teacherId', authenticate, async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const query = `
      SELECT 
        AVG(rating)::numeric(3,2) as average_rating,
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM teacher_reviews
      WHERE teacher_id = $1
    `;
    
    const { rows } = await pool.query(query, [teacherId]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch average rating' });
  }
});

// Get all ratings (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const query = `
      SELECT 
        tr.*,
        t.full_name as teacher_name,
        s.full_name as student_name
      FROM teacher_reviews tr
      JOIN teachers t ON tr.teacher_id = t.id
      JOIN students s ON tr.student_id = s.id
      ORDER BY tr.created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching all ratings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ratings' });
  }
});

// Get top rated teachers
router.get('/top-rated', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id, t.full_name, t.subject, t.department,
        AVG(tr.rating)::numeric(3,2) as average_rating,
        COUNT(tr.id) as total_reviews
      FROM teachers t
      LEFT JOIN teacher_reviews tr ON t.id = tr.teacher_id
      GROUP BY t.id
      HAVING COUNT(tr.id) > 0
      ORDER BY average_rating DESC, total_reviews DESC
      LIMIT 10
    `;
    
    const { rows } = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching top rated teachers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch top rated teachers' });
  }
});

export default router;
