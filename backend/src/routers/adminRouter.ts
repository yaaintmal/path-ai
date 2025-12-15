import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { authMiddleware, adminOnly } from '../middleware/index.ts';
import { User } from '#models';
import { loggerError } from '#utils';

const router = Router();

// GET /api/admin/logs?type=critical|general&date=YYYY-MM-DD
// Require auth for all admin routes
router.use(authMiddleware);

router.get('/stats', adminOnly, async (req, res) => {
  const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
  const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
  const criticalLog = path.join(logDir, `path-ai-critical-${date}.log`);
  let recentErrors = 0;

  try {
    if (fs.existsSync(criticalLog)) {
      const contents = await fs.promises.readFile(criticalLog, 'utf8');
      recentErrors = contents.split(/\r?\n/).filter((line) => /error/i.test(line.trim())).length;
    }
  } catch (err) {
    loggerError('[AdminStats] Failed to read critical log:', err as unknown);
  }

  try {
    const userCount = await User.countDocuments();
    return res.json({ userCount, recentErrors, activeSessions: 0 });
  } catch (err) {
    loggerError('[AdminStats] Failed to compute stats:', err as unknown);
    return res.status(500).json({ message: 'Unable to load stats' });
  }
});

router.get('/logs', adminOnly, (req, res) => {
  const type = (req.query.type as string) || 'critical';
  const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
  const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
  let filename = `path-ai-critical-${date}.log`;
  if (type === 'general') filename = `path-ai-${date}.log`;
  if (type === 'admin') filename = `path-ai-admin-${date}.log`;
  const filePath = path.join(logDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Log file not found', file: filename });
  }

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

// Simple admin-only ping for quick auth verification
router.get('/ping', adminOnly, (req, res) => {
  res.json({ ok: true, userId: req.userId });
});

export default router;
