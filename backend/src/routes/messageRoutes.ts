import { Router } from 'express';
import { pool } from '../config/database';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get inbox messages
router.get('/inbox', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const query = `
      SELECT 
        m.*,
        u1.email as from_email,
        CASE 
          WHEN t1.id IS NOT NULL THEN t1.full_name
          WHEN s1.id IS NOT NULL THEN s1.full_name
          ELSE 'Admin'
        END as from_name,
        CASE 
          WHEN t1.id IS NOT NULL THEN 'teacher'
          WHEN s1.id IS NOT NULL THEN 'student'
          ELSE 'admin'
        END as from_role
      FROM messages m
      JOIN users u1 ON m.from_user_id = u1.id
      LEFT JOIN teachers t1 ON u1.id = t1.user_id
      LEFT JOIN students s1 ON u1.id = s1.user_id
      WHERE m.to_user_id = $1
      ORDER BY m.created_at DESC
    `;
    
    const { rows } = await pool.query(query, [userId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// Get sent messages
router.get('/sent', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const query = `
      SELECT 
        m.*,
        u2.email as to_email,
        CASE 
          WHEN t2.id IS NOT NULL THEN t2.full_name
          WHEN s2.id IS NOT NULL THEN s2.full_name
          ELSE 'Admin'
        END as to_name,
        CASE 
          WHEN t2.id IS NOT NULL THEN 'teacher'
          WHEN s2.id IS NOT NULL THEN 'student'
          ELSE 'admin'
        END as to_role
      FROM messages m
      JOIN users u2 ON m.to_user_id = u2.id
      LEFT JOIN teachers t2 ON u2.id = t2.user_id
      LEFT JOIN students s2 ON u2.id = s2.user_id
      WHERE m.from_user_id = $1
      ORDER BY m.created_at DESC
    `;
    
    const { rows } = await pool.query(query, [userId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/', authenticate, async (req, res) => {
  try {
    const { toUserId, subject, body, parentMessageId } = req.body;
    const fromUserId = req.user?.id;
    
    if (!toUserId || !subject || !body) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    // Validate messaging permissions (student cannot message admin)
    const fromUserQuery = await pool.query('SELECT role FROM users WHERE id = $1', [fromUserId]);
    const toUserQuery = await pool.query('SELECT role FROM users WHERE id = $1', [toUserId]);
    
    const fromRole = fromUserQuery.rows[0]?.role;
    const toRole = toUserQuery.rows[0]?.role;
    
    if (fromRole === 'student' && toRole === 'admin') {
      return res.status(403).json({ success: false, error: 'Students cannot message admins directly' });
    }
    
    if (fromRole === 'admin' && toRole === 'student') {
      return res.status(403).json({ success: false, error: 'Admins cannot message students directly' });
    }
    
    const query = `
      INSERT INTO messages (from_user_id, to_user_id, subject, body, parent_message_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [fromUserId, toUserId, subject, body, parentMessageId || null]);
    
    res.status(201).json({
      success: true,
      data: rows[0],
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Get single message
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const query = `
      SELECT m.*,
        u1.email as from_email,
        u2.email as to_email,
        CASE 
          WHEN t1.id IS NOT NULL THEN t1.full_name
          WHEN s1.id IS NOT NULL THEN s1.full_name
          ELSE 'Admin'
        END as from_name,
        CASE 
          WHEN t2.id IS NOT NULL THEN t2.full_name
          WHEN s2.id IS NOT NULL THEN s2.full_name
          ELSE 'Admin'
        END as to_name
      FROM messages m
      JOIN users u1 ON m.from_user_id = u1.id
      JOIN users u2 ON m.to_user_id = u2.id
      LEFT JOIN teachers t1 ON u1.id = t1.user_id
      LEFT JOIN students s1 ON u1.id = s1.user_id
      LEFT JOIN teachers t2 ON u2.id = t2.user_id
      LEFT JOIN students s2 ON u2.id = s2.user_id
      WHERE m.id = $1 AND (m.from_user_id = $2 OR m.to_user_id = $2)
    `;
    
    const { rows } = await pool.query(query, [id, userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch message' });
  }
});

// Mark message as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const query = `
      UPDATE messages 
      SET is_read = true, read_at = NOW()
      WHERE id = $1 AND to_user_id = $2
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [id, userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    
    res.json({
      success: true,
      data: rows[0],
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ success: false, error: 'Failed to update message' });
  }
});

// Delete message
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    await pool.query(
      'DELETE FROM messages WHERE id = $1 AND (from_user_id = $2 OR to_user_id = $2)',
      [id, userId]
    );
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, error: 'Failed to delete message' });
  }
});

// Get message thread
router.get('/thread/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      WITH RECURSIVE message_thread AS (
        SELECT * FROM messages WHERE id = $1
        UNION ALL
        SELECT m.* FROM messages m
        INNER JOIN message_thread mt ON m.parent_message_id = mt.id
      )
      SELECT mt.*,
        u1.email as from_email,
        u2.email as to_email,
        CASE 
          WHEN t1.id IS NOT NULL THEN t1.full_name
          WHEN s1.id IS NOT NULL THEN s1.full_name
          ELSE 'Admin'
        END as from_name
      FROM message_thread mt
      JOIN users u1 ON mt.from_user_id = u1.id
      JOIN users u2 ON mt.to_user_id = u2.id
      LEFT JOIN teachers t1 ON u1.id = t1.user_id
      LEFT JOIN students s1 ON u1.id = s1.user_id
      ORDER BY mt.created_at ASC
    `;
    
    const { rows } = await pool.query(query, [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching message thread:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch thread' });
  }
});

export default router;
