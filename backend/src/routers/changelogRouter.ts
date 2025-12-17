import { Router } from 'express';
import { getChangelog, getLatestChangelogEntry } from '../controllers/changelogController.ts';

const router = Router();

// GET /api/changelog - Get all changelog entries
router.get('/', getChangelog);

// GET /api/changelog/latest - Get the latest changelog entry
router.get('/latest', getLatestChangelogEntry);

export default router;