import { Router } from 'express';
import {
  trackInteraction,
  getUserInteractionStats,
  getCheatingRiskAssessment,
  getUserInteractionHistory,
  getSuspiciousActivityReport,
} from '../controllers/interactionController.ts';
import { authMiddleware, validateBodyZod, adminOnly } from '../middleware/index.ts';
import { TrackInteractionSchema } from '../schemas/inputSchemas.ts';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Track an interaction
router.post('/track', validateBodyZod(TrackInteractionSchema), trackInteraction);

// Get user's own statistics
router.get('/stats', getUserInteractionStats);

// Get user's own cheating risk assessment
router.get('/risk-assessment', getCheatingRiskAssessment);

// Get user's own interaction history
router.get('/user/:userId', getUserInteractionHistory);

// Admin: Get suspicious activity report
router.get('/report/suspicious', adminOnly, getSuspiciousActivityReport);

export default router;
