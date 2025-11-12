import { Response } from 'express';
import { User, UserRole } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { hashPassword } from '../utils/password';
import { logger } from '../config/logger';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    
    if (role !== 'admin' && role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    logger.error({ error }, 'Get users error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, classId } = req.body;
    const { role: userRole } = req.user!;

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can create users',
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.STUDENT,
      classId,
      suspended: false,
    });

    logger.info({ userId: user.id, email: user.email }, 'User created by admin');

    const { password: _, ...userData } = user.toJSON();

    res.status(201).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    logger.error({ error }, 'Create user error');
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, classId, suspended } = req.body;
    const { role: userRole } = req.user!;

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can update users',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      classId: classId !== undefined ? classId : user.classId,
      suspended: suspended !== undefined ? suspended : user.suspended,
    });

    logger.info({ userId: user.id }, 'User updated');

    const { password: _, ...userData } = user.toJSON();

    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    logger.error({ error }, 'Update user error');
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role: userRole } = req.user!;

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete users',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    await user.destroy();

    logger.info({ userId: id }, 'User deleted');

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error({ error }, 'Delete user error');
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
    });
  }
};
