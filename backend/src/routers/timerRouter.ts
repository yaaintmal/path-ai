import { Router } from 'express';
import {
  startSession,
  stopSession,
  getActiveSession,
  getSessionHistory,
  getSessionStatistics,
} from '../controllers/timerController.ts';
import { authMiddleware, validateBodyZod } from '../middleware/index.ts';
import { TimerStartSessionSchema } from '../schemas/inputSchemas.ts';

const router = Router();

router.use(authMiddleware);

router.post('/start', validateBodyZod(TimerStartSessionSchema), startSession);
router.post('/stop', stopSession);
router.get('/active', getActiveSession);
router.get('/history', getSessionHistory);
router.get('/statistics', getSessionStatistics);

export default router;
