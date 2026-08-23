import { Router } from 'express';
import * as aiController from '../controllers/aiController';

const router = Router();

router.post('/ai/chat', aiController.chat);
router.post('/ai/explain-circuit', aiController.explainCircuit);

export default router;
