import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware to check validation results
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};

// Authentication validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validate,
];

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape()
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .isIn(['student', 'teacher', 'admin'])
    .withMessage('Invalid role'),
  validate,
];

// User validation
export const validateUserId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid user ID'),
  validate,
];

// Exam validation
export const validateCreateExam = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .escape()
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .escape(),
  body('duration')
    .isInt({ min: 5, max: 480 })
    .withMessage('Duration must be between 5 and 480 minutes'),
  body('totalMarks')
    .isInt({ min: 1 })
    .withMessage('Total marks must be a positive number'),
  body('passMarks')
    .isInt({ min: 1 })
    .withMessage('Pass marks must be a positive number'),
  validate,
];

// Question validation
export const validateCreateQuestion = [
  body('questionText')
    .trim()
    .isLength({ min: 5, max: 2000 })
    .withMessage('Question text must be between 5 and 2000 characters'),
  body('questionType')
    .isIn(['multiple_choice', 'true_false', 'short_answer', 'essay'])
    .withMessage('Invalid question type'),
  body('marks')
    .isInt({ min: 1, max: 100 })
    .withMessage('Marks must be between 1 and 100'),
  validate,
];

// Message validation
export const validateCreateMessage = [
  body('recipientId')
    .isInt({ min: 1 })
    .withMessage('Invalid recipient ID'),
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape()
    .withMessage('Subject must be between 1 and 200 characters'),
  body('body')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Message body must be between 1 and 10000 characters'),
  validate,
];

// Grade query validation
export const validateGradeQuery = [
  body('questionId')
    .isInt({ min: 1 })
    .withMessage('Invalid question ID'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .escape()
    .withMessage('Reason must be between 10 and 1000 characters'),
  validate,
];

// Rating validation
export const validateRating = [
  body('teacherId')
    .isInt({ min: 1 })
    .withMessage('Invalid teacher ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .escape()
    .withMessage('Review must not exceed 500 characters'),
  validate,
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive number'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate,
];

// Password reset validation
export const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  validate,
];

export const validateNewPassword = [
  body('token')
    .isLength({ min: 32 })
    .withMessage('Invalid reset token'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validate,
];
