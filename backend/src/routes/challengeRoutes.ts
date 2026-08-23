import { Router } from 'express';
import * as challengeController from '../controllers/challengeController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/challenges', challengeController.getChallenges);
router.get('/challenges/:id', challengeController.getChallenge);
router.post('/challenges/:id/submit', optionalAuth, challengeController.submitChallenge);

export default router;
