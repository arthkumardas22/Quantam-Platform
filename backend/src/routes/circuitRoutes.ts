import { Router } from 'express';
import * as circuitController from '../controllers/circuitController';
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/circuits', requireAuth, circuitController.saveCircuit);
router.get('/circuits', requireAuth, circuitController.getCircuits);
router.get('/circuits/:id', optionalAuth, circuitController.getCircuit);
router.put('/circuits/:id', requireAuth, circuitController.updateCircuit);
router.delete('/circuits/:id', requireAuth, circuitController.deleteCircuit);
router.post('/circuits/generate-code', circuitController.generateCode);

export default router;
