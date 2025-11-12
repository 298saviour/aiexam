import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Mark attendance (teacher only)
router.post('/', authenticate, authorize(['teacher', 'admin']), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { classId, date, attendanceRecords } = req.body;
    const markedBy = req.user?.teacherId;
    
    // attendanceRecords: [{ studentId, status }]
    if (!classId || !date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    for (const record of attendanceRecords) {
      const { studentId, status } = record;
      
      if (!['present', 'absent', 'late'].includes(status)) {
        continue;
      }
      
      await client.query(
        `INSERT INTO attendance (student_id, class_id, date, status, marked_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id, date)
         DO UPDATE SET status = EXCLUDED.status, marked_by = EXCLUDED.marked_by`,
        [studentId, classId, date, status, markedBy]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error marking attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to mark attendance' });
  } finally {
    client.release();
  }
});

// Get student attendance
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT a.*, c.name as class_name, t.full_name as marked_by_name
      FROM attendance a
      JOIN classes c ON a.class_id = c.id
      LEFT JOIN teachers t ON a.marked_by = t.id
      WHERE a.student_id = $1
    `;
    
    const params: any[] = [studentId];
    let paramCount = 2;
    
    if (startDate) {
      query += ` AND a.date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }
    
    if (endDate) {
      query += ` AND a.date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }
    
    query += ` ORDER BY a.date DESC`;
    
    const { rows } = await pool.query(query, params);
    
    // Calculate statistics
    const stats = {
      total: rows.length,
      present: rows.filter(r => r.status === 'present').length,
      absent: rows.filter(r => r.status === 'absent').length,
      late: rows.filter(r => r.status === 'late').length,
      attendanceRate: rows.length > 0 
        ? ((rows.filter(r => r.status === 'present').length / rows.length) * 100).toFixed(2)
        : 0
    };
    
    res.json({ success: true, data: rows, stats });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch attendance' });
  }
});

// Get class attendance
router.get('/class/:classId', authenticate, async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }
    
    const query = `
      SELECT 
        s.id as student_id,
        s.full_name as student_name,
        s.student_id,
        COALESCE(a.status, 'unmarked') as status,
        a.created_at as marked_at
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id AND a.date = $2
      WHERE s.class_id = $1
      ORDER BY s.full_name
    `;
    
    const { rows } = await pool.query(query, [classId, date]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch attendance' });
  }
});

// Get attendance by date
router.get('/date/:date', authenticate, authorize(['teacher', 'admin']), async (req, res) => {
  try {
    const { date } = req.params;
    
    const query = `
      SELECT 
        a.*,
        s.full_name as student_name,
        s.student_id,
        c.name as class_name,
        t.full_name as marked_by_name
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN classes c ON a.class_id = c.id
      LEFT JOIN teachers t ON a.marked_by = t.id
      WHERE a.date = $1
      ORDER BY c.name, s.full_name
    `;
    
    const { rows } = await pool.query(query, [date]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching attendance by date:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch attendance' });
  }
});

// Get attendance report
router.get('/report', authenticate, authorize(['teacher', 'admin']), async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        s.id as student_id,
        s.full_name as student_name,
        s.student_id,
        c.name as class_name,
        COUNT(a.id) as total_days,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_days,
        ROUND((COUNT(CASE WHEN a.status = 'present' THEN 1 END)::numeric / NULLIF(COUNT(a.id), 0)) * 100, 2) as attendance_rate
      FROM students s
      JOIN classes c ON s.class_id = c.id
      LEFT JOIN attendance a ON s.id = a.student_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 1;
    
    if (classId) {
      query += ` AND s.class_id = $${paramCount}`;
      params.push(classId);
      paramCount++;
    }
    
    if (startDate) {
      query += ` AND a.date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }
    
    if (endDate) {
      query += ` AND a.date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }
    
    query += ` GROUP BY s.id, s.full_name, s.student_id, c.name ORDER BY c.name, s.full_name`;
    
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
});

export default router;
