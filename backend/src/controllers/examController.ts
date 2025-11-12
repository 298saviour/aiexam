import { Response } from 'express';
import { Exam } from '../models/Exam';
import { Question } from '../models/Question';
import { StudentExam } from '../models/StudentExam';
import { Course } from '../models/Course';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';

export const getExams = async (req: AuthRequest, res: Response) => {
  try {
    const { role, userId } = req.user!;
    
    let exams;
    if (role === 'admin') {
      exams = await Exam.findAll({
        include: [{ model: Course, as: 'course', attributes: ['id', 'name'] }],
      });
    } else if (role === 'teacher') {
      exams = await Exam.findAll({
        include: [{
          model: Course,
          as: 'course',
          where: { teacherId: userId },
          attributes: ['id', 'name'],
        }],
      });
    } else {
      // Student - get available exams
      exams = await Exam.findAll({
        where: {
          availableFrom: { [Op.lte]: new Date() },
          availableUntil: { [Op.gte]: new Date() },
        },
        include: [{ model: Course, as: 'course', attributes: ['id', 'name'] }],
      });
    }

    res.json({
      success: true,
      data: exams,
    });
  } catch (error) {
    logger.error({ error }, 'Get exams error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exams',
    });
  }
};

export const getExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const exam = await Exam.findByPk(id, {
      include: [
        { model: Course, as: 'course', attributes: ['id', 'name'] },
        { model: Question, as: 'questions' },
      ],
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found',
      });
    }

    res.json({
      success: true,
      data: exam,
    });
  } catch (error) {
    logger.error({ error }, 'Get exam error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exam',
    });
  }
};

export const createExam = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, title, type, duration, availableFrom, availableUntil, questions } = req.body;
    const { role } = req.user!;

    if (role !== 'teacher' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers and admins can create exams',
      });
    }

    const exam = await Exam.create({
      courseId,
      title,
      type,
      duration,
      availableFrom,
      availableUntil,
    });

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionPromises = questions.map((q: any) =>
        Question.create({
          examId: exam.id,
          questionText: q.questionText,
          options: q.options,
          answerKey: q.answerKey,
          wordLimit: q.wordLimit,
          points: q.points || 1,
        })
      );
      await Promise.all(questionPromises);
    }

    logger.info({ examId: exam.id }, 'Exam created');

    res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    logger.error({ error }, 'Create exam error');
    res.status(500).json({
      success: false,
      error: 'Failed to create exam',
    });
  }
};

export const submitExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const { userId } = req.user!;

    const exam = await Exam.findByPk(id, {
      include: [{ model: Question, as: 'questions' }],
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found',
      });
    }

    // Check if already submitted
    const existing = await StudentExam.findOne({
      where: { studentId: userId, examId: id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Exam already submitted',
      });
    }

    // Create submission
    const submission = await StudentExam.create({
      studentId: userId,
      examId: id,
      answers,
      submittedAt: new Date(),
    });

    logger.info({ submissionId: submission.id, studentId: userId, examId: id }, 'Exam submitted');

    // TODO: Trigger AI grading job here

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Exam submitted successfully. AI grading in progress.',
    });
  } catch (error) {
    logger.error({ error }, 'Submit exam error');
    res.status(500).json({
      success: false,
      error: 'Failed to submit exam',
    });
  }
};

export const getExamResults = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;

    const submission = await StudentExam.findOne({
      where: { studentId: userId, examId: id },
      include: [
        { model: Exam, as: 'exam', attributes: ['id', 'title', 'type'] },
      ],
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    logger.error({ error }, 'Get exam results error');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch results',
    });
  }
};
