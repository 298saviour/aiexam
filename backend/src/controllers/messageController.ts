import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import User from '../models/User';
import { Op } from 'sequelize';

// Get all messages for a user (inbox and sent)
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { type = 'all', page = 1, limit = 50 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    let whereClause: any = {};

    if (type === 'inbox') {
      whereClause.recipientId = userId;
    } else if (type === 'sent') {
      whereClause.senderId = userId;
    } else {
      whereClause = {
        [Op.or]: [{ senderId: userId }, { recipientId: userId }],
      };
    }

    const { count, rows: messages } = await Message.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
};

// Get a single message
export const getMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const message = await Message.findOne({
      where: {
        id,
        [Op.or]: [{ senderId: userId }, { recipientId: userId }],
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    // Mark as read if user is recipient
    if (message.recipientId === userId && !message.read) {
      await message.update({ read: true });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch message',
    });
  }
};

// Create a new message
export const createMessage = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user!.id;
    const { recipientId, subject, body, attachments } = req.body;

    // Verify recipient exists
    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: 'Recipient not found',
      });
    }

    // Verify communication rules
    const sender = await User.findByPk(senderId);
    const isAllowed = checkCommunicationRules(sender!.role, recipient.role);

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        error: 'You are not allowed to send messages to this user',
      });
    }

    const message = await Message.create({
      senderId,
      recipientId,
      subject,
      body,
      attachments: attachments ? JSON.stringify(attachments) : undefined,
    });

    const createdMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role'],
        },
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: createdMessage,
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
};

// Delete a message
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const message = await Message.findOne({
      where: {
        id,
        [Op.or]: [{ senderId: userId }, { recipientId: userId }],
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    await message.destroy();

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message',
    });
  }
};

// Mark message as read
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const message = await Message.findOne({
      where: {
        id,
        recipientId: userId,
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    await message.update({ read: true });

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark message as read',
    });
  }
};

// Get unread count
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const count = await Message.count({
      where: {
        recipientId: userId,
        read: false,
      },
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unread count',
    });
  }
};

// Helper function to check communication rules
function checkCommunicationRules(senderRole: string, recipientRole: string): boolean {
  // Admin can message teachers
  if (senderRole === 'admin' && recipientRole === 'teacher') return true;
  
  // Teachers can message admin
  if (senderRole === 'teacher' && recipientRole === 'admin') return true;
  
  // Teachers can message students
  if (senderRole === 'teacher' && recipientRole === 'student') return true;
  
  // Students can message teachers
  if (senderRole === 'student' && recipientRole === 'teacher') return true;
  
  return false;
}
