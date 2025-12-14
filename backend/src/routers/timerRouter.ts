import { Router } from 'express';
import {
  startSession,
  stopSession,
  getActiveSession,
  getSessionHistory,
  getSessionStatistics,
} from '../controllers/timerController.ts';
import { authMiddleware } from '../middleware/jwtAuth.ts';

const router = Router();

router.use(authMiddleware);

router.post('/start', startSession);
router.post('/stop', stopSession);
router.get('/active', getActiveSession);
router.get('/history', getSessionHistory);
router.get('/statistics', getSessionStatistics);

export default router;
