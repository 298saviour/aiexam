import { Response } from 'express';
import { Class } from '../models/Class';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';

export const getClasses = async (req: AuthRequest, res: Response) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: User,
          as: 'students',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    logger.error({ error }, 'Get classes error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch classes',
    });
  }
};

export const getClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const classData = await Class.findByPk(id, {
      include: [
        {
          model: User,
          as: 'students',
          attributes: ['id', 'name', 'email', 'suspended'],
        },
      ],
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    res.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    logger.error({ error }, 'Get class error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch class',
    });
  }
};

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const { role } = req.user!;

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can create classes',
      });
    }

    const classData = await Class.create({
      name,
      description,
    });

    logger.info({ classId: classData.id, name }, 'Class created');

    res.status(201).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    logger.error({ error }, 'Create class error');
    res.status(500).json({
      success: false,
      error: 'Failed to create class',
    });
  }
};

export const updateClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const { role } = req.user!;

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can update classes',
      });
    }

    const classData = await Class.findByPk(id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    await classData.update({
      name: name || classData.name,
      description: description !== undefined ? description : classData.description,
    });

    logger.info({ classId: id }, 'Class updated');

    res.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    logger.error({ error }, 'Update class error');
    res.status(500).json({
      success: false,
      error: 'Failed to update class',
    });
  }
};

export const deleteClass = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.user!;

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete classes',
      });
    }

    const classData = await Class.findByPk(id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    await classData.destroy();

    logger.info({ classId: id }, 'Class deleted');

    res.json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error) {
    logger.error({ error }, 'Delete class error');
    res.status(500).json({
      success: false,
      error: 'Failed to delete class',
    });
  }
};
