import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// Get all teachers
router.get('/', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id, t.full_name, t.phone, t.date_of_birth, 
        t.department, t.subject, t.status,
        u.email, t.created_at
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch teachers' });
  }
});

// Get single teacher
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        t.*, u.email,
        json_agg(DISTINCT ct.class_id) FILTER (WHERE ct.class_id IS NOT NULL) as class_ids
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN class_teachers ct ON t.id = ct.teacher_id
      WHERE t.id = $1
      GROUP BY t.id, u.email
    `;
    
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch teacher' });
  }
});

// Create teacher
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { fullName, email, phone, dateOfBirth, department, subject, classes, password } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !phone || !dateOfBirth || !department || !subject) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Check if email already exists
    const emailCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    
    // Check if phone already exists
    const phoneCheck = await client.query('SELECT id FROM teachers WHERE phone = $1', [phone]);
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Phone number already exists' });
    }
    
    // Validate age (must be 21+)
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age < 21) {
      return res.status(400).json({ success: false, error: 'Teacher must be at least 21 years old' });
    }
    
    // Create user account
    const hashedPassword = await bcrypt.hash(password || 'teacher123', 10);
    const userResult = await client.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, 'teacher']
    );
    const userId = userResult.rows[0].id;
    
    // Create teacher record
    const teacherResult = await client.query(
      `INSERT INTO teachers (user_id, full_name, phone, date_of_birth, department, subject, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, fullName, phone, dateOfBirth, department, subject, 'active']
    );
    const teacher = teacherResult.rows[0];
    
    // Assign classes
    if (classes && classes.length > 0) {
      for (const classId of classes) {
        await client.query(
          'INSERT INTO class_teachers (class_id, teacher_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [classId, teacher.id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({ 
      success: true, 
      data: { ...teacher, email },
      message: 'Teacher created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating teacher:', error);
    res.status(500).json({ success: false, error: 'Failed to create teacher' });
  } finally {
    client.release();
  }
});

// Update teacher
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { fullName, email, phone, dateOfBirth, department, subject, status, classes } = req.body;
    
    // Check if teacher exists
    const teacherCheck = await client.query('SELECT user_id FROM teachers WHERE id = $1', [id]);
    if (teacherCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    const userId = teacherCheck.rows[0].user_id;
    
    // Update user email if changed
    if (email) {
      await client.query('UPDATE users SET email = $1 WHERE id = $2', [email, userId]);
    }
    
    // Update teacher record
    const updateQuery = `
      UPDATE teachers 
      SET full_name = COALESCE($1, full_name),
          phone = COALESCE($2, phone),
          date_of_birth = COALESCE($3, date_of_birth),
          department = COALESCE($4, department),
          subject = COALESCE($5, subject),
          status = COALESCE($6, status),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    
    const { rows } = await client.query(updateQuery, [
      fullName, phone, dateOfBirth, department, subject, status, id
    ]);
    
    // Update class assignments
    if (classes) {
      // Remove old assignments
      await client.query('DELETE FROM class_teachers WHERE teacher_id = $1', [id]);
      
      // Add new assignments
      for (const classId of classes) {
        await client.query(
          'INSERT INTO class_teachers (class_id, teacher_id) VALUES ($1, $2)',
          [classId, id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.json({ 
      success: true, 
      data: rows[0],
      message: 'Teacher updated successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating teacher:', error);
    res.status(500).json({ success: false, error: 'Failed to update teacher' });
  } finally {
    client.release();
  }
});

// Delete teacher
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Get user_id before deleting
    const teacherResult = await client.query('SELECT user_id FROM teachers WHERE id = $1', [id]);
    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    
    const userId = teacherResult.rows[0].user_id;
    
    // Delete teacher (cascade will handle class_teachers)
    await client.query('DELETE FROM teachers WHERE id = $1', [id]);
    
    // Delete user account
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    
    await client.query('COMMIT');
    
    res.json({ 
      success: true, 
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting teacher:', error);
    res.status(500).json({ success: false, error: 'Failed to delete teacher' });
  } finally {
    client.release();
  }
});

// Get teacher's classes
router.get('/:id/classes', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT c.*, COUNT(DISTINCT s.id) as student_count
      FROM classes c
      JOIN class_teachers ct ON c.id = ct.class_id
      LEFT JOIN students s ON c.id = s.class_id
      WHERE ct.teacher_id = $1
      GROUP BY c.id
    `;
    
    const { rows } = await pool.query(query, [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch classes' });
  }
});

export default router;
