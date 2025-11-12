import { Router } from 'express';
import {
  getAnalyticsStats,
  getAILogs,
  getSystemLogs,
  getAnalyticsEvents,
  exportLogs,
} from '../controllers/adminAnalyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize(['admin']));

// Analytics stats
router.get('/stats', getAnalyticsStats);

// AI logs
router.get('/logs/ai', getAILogs);

// System logs
router.get('/logs/system', getSystemLogs);

// Analytics events
router.get('/logs/analytics', getAnalyticsEvents);

// Export logs
router.get('/export/logs', exportLogs);

export default router;
