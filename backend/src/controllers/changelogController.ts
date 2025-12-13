import type { Request, Response } from 'express';
import { info, loggerError } from '#utils';
import changelogData from '../data/changelog.json' with { type: 'json' };

interface ChangelogEntry {
  version: string;
  date?: string;
  title: string;
  description: string;
  details?: string[];
}

interface ChangelogResponse {
  success: boolean;
  entries: ChangelogEntry[];
  lastUpdated?: string;
}

/**
 * Parse changelog entries from external source
 */
function parseChangelogEntries(): ChangelogEntry[] {
  return changelogData as ChangelogEntry[];
}

/**
 * GET /api/changelog
 * Returns changelog entries sorted by version (newest first)
 */
export async function getChangelog(_req: Request, res: Response): Promise<void> {
  try {
    const entries = parseChangelogEntries();

    const response: ChangelogResponse = {
      success: true,
      entries: entries,
      lastUpdated: entries[0]?.date,
    };

    info(`[Changelog] Retrieved ${entries.length} changelog entries`);
    res.json(response);
  } catch (error) {
    loggerError(`[Changelog] Error retrieving changelog: ${error}`);
    res.status(500).json({
      success: false,
      entries: [],
      message: 'Failed to retrieve changelog',
    });
  }
}

/**
 * GET /api/changelog/latest
 * Returns only the latest changelog entry
 */
export async function getLatestChangelog(_req: Request, res: Response): Promise<void> {
  try {
    const entries = parseChangelogEntries();
    const latest = entries[0];

    if (!latest) {
      res.status(404).json({
        success: false,
        message: 'No changelog entries found',
      });
      return;
    }

    res.json({
      success: true,
      entry: latest,
    });
  } catch (error) {
    loggerError(`[Changelog] Error retrieving latest changelog: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve changelog',
    });
  }
}

/**
 * GET /api/changelog/recent?limit=3
 * Returns recent changelog entries (default 3)
 */
export async function getRecentChangelog(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 3, 1), 10); // Clamp 1-10
    const entries = parseChangelogEntries().slice(0, limit);

    res.json({
      success: true,
      entries: entries,
      count: entries.length,
    });
  } catch (error) {
    loggerError(`[Changelog] Error retrieving recent changelog: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve changelog',
    });
  }
}
