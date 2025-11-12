import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get all classes
router.get('/', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        COUNT(DISTINCT s.id) as student_count,
        COUNT(DISTINCT ct.teacher_id) as teacher_count,
        COUNT(DISTINCT cs.subject) as subject_count
      FROM classes c
      LEFT JOIN students s ON c.id = s.class_id
      LEFT JOIN class_teachers ct ON c.id = ct.class_id
      LEFT JOIN class_subjects cs ON c.id = cs.class_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch classes' });
  }
});

// Get single class with details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const classQuery = `
      SELECT c.*,
        json_agg(DISTINCT cs.subject) FILTER (WHERE cs.subject IS NOT NULL) as subjects,
        json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.full_name, 'subject', t.subject)) 
          FILTER (WHERE t.id IS NOT NULL) as teachers
      FROM classes c
      LEFT JOIN class_subjects cs ON c.id = cs.class_id
      LEFT JOIN class_teachers ct ON c.id = ct.class_id
      LEFT JOIN teachers t ON ct.teacher_id = t.id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    
    const { rows } = await pool.query(classQuery, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch class' });
  }
});

// Create class
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { name, level, department, academicYear, subjects, assignedTeachers } = req.body;
    
    if (!name || !level || !department || !academicYear) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Create class
    const classResult = await client.query(
      'INSERT INTO classes (name, level, department, academic_year) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, level, department, academicYear]
    );
    const classData = classResult.rows[0];
    
    // Add subjects
    if (subjects && subjects.length > 0) {
      for (const subject of subjects) {
        await client.query(
          'INSERT INTO class_subjects (class_id, subject) VALUES ($1, $2)',
          [classData.id, subject]
        );
      }
    }
    
    // Assign teachers
    if (assignedTeachers && assignedTeachers.length > 0) {
      for (const teacherId of assignedTeachers) {
        await client.query(
          'INSERT INTO class_teachers (class_id, teacher_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [classData.id, teacherId]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: classData,
      message: 'Class created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating class:', error);
    res.status(500).json({ success: false, error: 'Failed to create class' });
  } finally {
    client.release();
  }
});

// Update class
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { name, level, department, academicYear, subjects, assignedTeachers } = req.body;
    
    // Update class
    const updateQuery = `
      UPDATE classes 
      SET name = COALESCE($1, name),
          level = COALESCE($2, level),
          department = COALESCE($3, department),
          academic_year = COALESCE($4, academic_year),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;
    
    const { rows } = await client.query(updateQuery, [name, level, department, academicYear, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }
    
    // Update subjects
    if (subjects) {
      await client.query('DELETE FROM class_subjects WHERE class_id = $1', [id]);
      for (const subject of subjects) {
        await client.query(
          'INSERT INTO class_subjects (class_id, subject) VALUES ($1, $2)',
          [id, subject]
        );
      }
    }
    
    // Update teachers
    if (assignedTeachers) {
      await client.query('DELETE FROM class_teachers WHERE class_id = $1', [id]);
      for (const teacherId of assignedTeachers) {
        await client.query(
          'INSERT INTO class_teachers (class_id, teacher_id) VALUES ($1, $2)',
          [id, teacherId]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      data: rows[0],
      message: 'Class updated successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating class:', error);
    res.status(500).json({ success: false, error: 'Failed to update class' });
  } finally {
    client.release();
  }
});

// Delete class
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM classes WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ success: false, error: 'Failed to delete class' });
  }
});

// Get class students
router.get('/:id/students', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT s.*, u.email,
        COALESCE(AVG(sa.ai_score), 0) as avg_score
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN student_answers sa ON s.id = sa.student_id
      WHERE s.class_id = $1
      GROUP BY s.id, u.email
      ORDER BY s.full_name
    `;
    
    const { rows } = await pool.query(query, [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching class students:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
});

export default router;
