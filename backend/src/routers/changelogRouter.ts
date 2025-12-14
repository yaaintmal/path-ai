import { Router } from 'express';
import {
  getChangelog,
  getLatestChangelog,
  getRecentChangelog,
} from '../controllers/changelogController.ts';

const changelogRouter = Router();

//
// * GET /api/changelog
// Returns all changelog entries
//
changelogRouter.get('/', getChangelog);

//
// * GET /api/changelog/latest
// Returns the latest changelog entry
//
changelogRouter.get('/latest', getLatestChangelog);

//
// * GET /api/changelog/recent
// Returns recent changelog entries (limit parameter optional, default 3)
//
changelogRouter.get('/recent', getRecentChangelog);

export { changelogRouter };
