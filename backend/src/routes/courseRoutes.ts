import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';

const router = Router();

router.get('/', authenticate, getCourses);
router.get('/:id', authenticate, getCourse);
router.post('/', authenticate, authorize('teacher', 'admin'), createCourse);
router.put('/:id', authenticate, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', authenticate, authorize('teacher', 'admin'), deleteCourse);

export default router;
