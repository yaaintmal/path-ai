import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { authMiddleware, adminOnly } from '../middleware/index.ts';

const router = Router();

// GET /api/admin/logs?type=critical|general&date=YYYY-MM-DD
// Require auth for all admin routes
router.use(authMiddleware);

router.get('/logs', adminOnly, (req, res) => {
  const type = (req.query.type as string) || 'critical';
  const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
  const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
  const filename = type === 'general' ? `path-ai-${date}.log` : `path-ai-critical-${date}.log`;
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
