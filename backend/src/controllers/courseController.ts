import { Response } from 'express';
import { Course } from '../models/Course';
import { Class } from '../models/Class';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { role, userId } = req.user!;
    
    let courses;
    if (role === 'admin') {
      courses = await Course.findAll({
        include: [
          { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
          { model: Class, as: 'class', attributes: ['id', 'name'] },
        ],
      });
    } else if (role === 'teacher') {
      courses = await Course.findAll({
        where: { teacherId: userId },
        include: [{ model: Class, as: 'class', attributes: ['id', 'name'] }],
      });
    } else {
      // Student - get courses for their class
      const user = await User.findByPk(userId);
      if (!user?.classId) {
        return res.status(400).json({
          success: false,
          error: 'Student not assigned to a class',
        });
      }
      
      courses = await Course.findAll({
        where: { classId: user.classId },
        include: [{ model: User, as: 'teacher', attributes: ['id', 'name'] }],
      });
    }

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    logger.error({ error }, 'Get courses error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses',
    });
  }
};

export const getCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByPk(id, {
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Class, as: 'class', attributes: ['id', 'name'] },
      ],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    logger.error({ error }, 'Get course error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course',
    });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { name, classId, lessonNotes } = req.body;
    const { userId, role } = req.user!;

    if (role !== 'teacher' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers and admins can create courses',
      });
    }

    const course = await Course.create({
      name,
      teacherId: userId,
      classId,
      lessonNotes,
    });

    logger.info({ courseId: course.id, teacherId: userId }, 'Course created');

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    logger.error({ error }, 'Create course error');
    res.status(500).json({
      success: false,
      error: 'Failed to create course',
    });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, classId, lessonNotes } = req.body;
    const { userId, role } = req.user!;

    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Check permissions
    if (role === 'teacher' && course.teacherId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own courses',
      });
    }

    await course.update({
      name: name || course.name,
      classId: classId || course.classId,
      lessonNotes: lessonNotes !== undefined ? lessonNotes : course.lessonNotes,
    });

    logger.info({ courseId: course.id }, 'Course updated');

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    logger.error({ error }, 'Update course error');
    res.status(500).json({
      success: false,
      error: 'Failed to update course',
    });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;

    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Check permissions
    if (role === 'teacher' && course.teacherId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own courses',
      });
    }

    await course.destroy();

    logger.info({ courseId: id }, 'Course deleted');

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    logger.error({ error }, 'Delete course error');
    res.status(500).json({
      success: false,
      error: 'Failed to delete course',
    });
  }
};
