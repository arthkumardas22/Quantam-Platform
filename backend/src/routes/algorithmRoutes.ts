import { Router } from 'express';
import * as algorithmController from '../controllers/algorithmController';

const router = Router();

router.get('/algorithms', algorithmController.getAlgorithms);
router.get('/algorithms/:id', algorithmController.getAlgorithm);
router.get('/algorithms/:id/challenges', algorithmController.getAlgorithmChallenges);

export default router;
