import { Router } from 'express';
import * as learningController from '../controllers/learningController';
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();

// Topics & Lessons
router.get('/topics', optionalAuth, learningController.getTopics);
router.get('/topics/:id', optionalAuth, learningController.getTopic);
router.get('/topics/:id/lessons', learningController.getLessons);
router.get('/lessons/:id', learningController.getLesson);
router.post('/lessons/:id/complete', requireAuth, learningController.completeLesson);

// Progress & Analytics
router.get('/progress', requireAuth, learningController.getProgress);
router.get('/progress/analytics', requireAuth, learningController.getAnalytics);

export default router;
