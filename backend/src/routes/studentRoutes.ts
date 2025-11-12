import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// Generate student ID
const generateStudentId = (className: string, count: number): string => {
  const classCode = className.replace(/\s+/g, '').toUpperCase();
  const paddedCount = String(count).padStart(5, '0');
  return `STU/${classCode}/${paddedCount}`;
};

// Get all students
router.get('/', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT 
        s.*, u.email, c.name as class_name,
        COALESCE(AVG(sa.ai_score), 0) as avg_score
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN student_answers sa ON s.id = sa.student_id
      GROUP BY s.id, u.email, c.name
      ORDER BY s.created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
});

// Get single student
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        s.*, u.email, c.name as class_name,
        COALESCE(AVG(sa.ai_score), 0) as avg_score,
        COUNT(DISTINCT sa.exam_id) as exams_taken
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN student_answers sa ON s.id = sa.student_id
      WHERE s.id = $1
      GROUP BY s.id, u.email, c.name
    `;
    
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch student' });
  }
});

// Create student
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      fullName, email, phone, dateOfBirth, classId, className,
      admissionDate, parentName, parentPhone, parentEmail, parentAddress,
      password
    } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !phone || !dateOfBirth || !classId || !className) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Check if email already exists
    const emailCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    
    // Generate student ID
    const countResult = await client.query(
      'SELECT COUNT(*) as count FROM students WHERE class_id = $1',
      [classId]
    );
    const count = parseInt(countResult.rows[0].count) + 1;
    const studentId = generateStudentId(className, count);
    
    // Create user account
    const hashedPassword = await bcrypt.hash(password || 'student123', 10);
    const userResult = await client.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, 'student']
    );
    const userId = userResult.rows[0].id;
    
    // Create student record
    const studentResult = await client.query(
      `INSERT INTO students (
        user_id, student_id, full_name, phone, date_of_birth, class_id,
        admission_date, parent_name, parent_phone, parent_email, parent_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        userId, studentId, fullName, phone, dateOfBirth, classId,
        admissionDate, parentName, parentPhone, parentEmail, parentAddress
      ]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: { ...studentResult.rows[0], email },
      message: 'Student created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating student:', error);
    res.status(500).json({ success: false, error: 'Failed to create student' });
  } finally {
    client.release();
  }
});

// Update student
router.put('/:id', authenticate, authorize(['admin', 'teacher']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const {
      fullName, email, phone, dateOfBirth, classId,
      parentName, parentPhone, parentEmail, parentAddress
    } = req.body;
    
    // Check if student exists
    const studentCheck = await client.query('SELECT user_id FROM students WHERE id = $1', [id]);
    if (studentCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    const userId = studentCheck.rows[0].user_id;
    
    // Update user email if changed
    if (email) {
      await client.query('UPDATE users SET email = $1 WHERE id = $2', [email, userId]);
    }
    
    // Update student record
    const updateQuery = `
      UPDATE students 
      SET full_name = COALESCE($1, full_name),
          phone = COALESCE($2, phone),
          date_of_birth = COALESCE($3, date_of_birth),
          class_id = COALESCE($4, class_id),
          parent_name = COALESCE($5, parent_name),
          parent_phone = COALESCE($6, parent_phone),
          parent_email = COALESCE($7, parent_email),
          parent_address = COALESCE($8, parent_address),
          updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;
    
    const { rows } = await client.query(updateQuery, [
      fullName, phone, dateOfBirth, classId,
      parentName, parentPhone, parentEmail, parentAddress, id
    ]);
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: rows[0],
      message: 'Student updated successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, error: 'Failed to update student' });
  } finally {
    client.release();
  }
});

// Delete student
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Get user_id before deleting
    const studentResult = await client.query('SELECT user_id FROM students WHERE id = $1', [id]);
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    const userId = studentResult.rows[0].user_id;
    
    // Delete student
    await client.query('DELETE FROM students WHERE id = $1', [id]);
    
    // Delete user account
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, error: 'Failed to delete student' });
  } finally {
    client.release();
  }
});

// Get student performance
router.get('/:id/performance', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        e.title as exam_title,
        e.term,
        AVG(sa.ai_score) as score,
        e.scheduled_date
      FROM student_answers sa
      JOIN exams e ON sa.exam_id = e.id
      WHERE sa.student_id = $1
      GROUP BY e.id, e.title, e.term, e.scheduled_date
      ORDER BY e.scheduled_date DESC
    `;
    
    const { rows } = await pool.query(query, [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching student performance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch performance' });
  }
});

export default router;
