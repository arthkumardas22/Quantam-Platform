import { Router } from 'express';
import authRoutes from './authRoutes';
import learningRoutes from './learningRoutes';
import algorithmRoutes from './algorithmRoutes';
import circuitRoutes from './circuitRoutes';
import quantumRoutes from './quantumRoutes';
import aiRoutes from './aiRoutes';
import challengeRoutes from './challengeRoutes';

const router = Router();

// Health Check Endpoint (Required by Specification)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Quantum Platform Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: 'QuantamStudio_Bigslayers',
    features: {
      auth: true,
      simulation: true,
      aiTutor: true,
      challenges: true,
      codeGen: true,
    },
  });
});

// Mount All Sub-Routers
router.use('/auth', authRoutes);
router.use('/', learningRoutes);
router.use('/', algorithmRoutes);
router.use('/', circuitRoutes);
router.use('/', quantumRoutes);
router.use('/', aiRoutes);
router.use('/', challengeRoutes);

export default router;
