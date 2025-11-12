import { Router } from 'express';
import { submitContact, getContactSubmissions } from '../controllers/landingController';
import { trackCookieConsent, getCookieConsents } from '../controllers/cookieController';
import { trackAnalyticsEvent, getAnalytics } from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiters
const contactLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // 3 requests per minute
  message: 'Too many contact submissions, please try again later.',
});

const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60, // 60 events per minute
  message: 'Too many analytics events.',
});

// Public routes
router.post('/contact', contactLimiter, submitContact);
router.post('/cookies/consent', trackCookieConsent);
router.post('/analytics/event', analyticsLimiter, trackAnalyticsEvent);

// Admin routes (protected)
router.get('/contact/submissions', authenticate, authorize(['admin']), getContactSubmissions);
router.get('/cookies/consents', authenticate, authorize(['admin']), getCookieConsents);
router.get('/analytics', authenticate, authorize(['admin']), getAnalytics);

export default router;
