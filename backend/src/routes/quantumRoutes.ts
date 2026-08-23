import { Router } from 'express';
import * as quantumController from '../controllers/quantumController';
import { simulationLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/quantum/simulate', simulationLimiter, quantumController.simulate);
router.post('/quantum/statevector', quantumController.getStateVector);
router.post('/quantum/bloch-sphere', quantumController.getBlochSphere);

export default router;
