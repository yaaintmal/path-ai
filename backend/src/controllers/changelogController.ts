import type { Request, Response } from 'express';
import { info, loggerError } from '#utils';

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
 * Parse changelog entries from version.ts format
 * Expects format: // version X.X.X.X: title >> details
 */
function parseChangelogEntries(): ChangelogEntry[] {
  // Hardcoded changelog entries extracted from version.ts
  // In a real scenario, this would be parsed from CHANGELOG.md or git history
  const entries: ChangelogEntry[] = [
    {
      version: '0.5.1.5',
      date: '2025-12-11',
      title: 'Feature cleanup / move',
      description: 'Removed active Video Studio / Video Translation feature',
      details: [
        'Future of video features to be re-evaluated after MVP launch',
        'Fork now represents enhanced refactor of originally next.js-built LearnBuddy AI app',
        'Original video features archived in src/experimental folder',
        'Removed video-player and translation widgets, replaced with lightweight wrappers',
        'Removed video env keys and config from references',
      ],
    },
    {
      version: '0.5.1.4',
      date: '2025-12-10',
      title: 'UI & translations update',
      description: 'Removed explicit video copy, replaced with neutral terms',
      details: [
        'Updated hero, features, language features, prompt templates',
        'Replaced video references with content/resources/media terms',
        'Updated landing copy and dashboard preview',
        'Updated onboarding item IDs',
      ],
    },
    {
      version: '0.5.1.3',
      date: '2025-12-09',
      title: 'FormattedText component enhancement',
      description: 'Applied FormattedText to SavedThemesWidget',
      details: ['Consistent markdown rendering across components'],
    },
    {
      version: '0.5.1.2',
      date: '2025-12-08',
      title: 'Learn widget improvements',
      description: 'Added FormattedText component for bold markdown',
      details: ['Enhanced learn widget results rendering'],
    },
    {
      version: '0.5.1.1',
      date: '2025-12-07',
      title: 'Logging infrastructure refactor',
      description: 'Refactored console logs to use logger utility',
      details: [
        'Added color coding to logs',
        'Implemented filter logic in frontend',
      ],
    },
    {
      version: '0.5.0.1',
      date: '2025-12-06',
      title: 'LLM provider selection',
      description: 'New feature: Choose between Google Gemini or local Ollama',
      details: [
        'LLM provider can be configured via .env',
        'Backend proxy handles both providers',
      ],
    },
    {
      version: '0.4.5.0',
      date: '2025-12-01',
      title: 'Video & Store modules added',
      description: 'Added video player and store functionality',
      details: ['Video player component', 'Store module with inventory system'],
    },
    {
      version: '0.3.4.1',
      date: '2025-11-25',
      title: 'Environment configuration',
      description: 'Outsourced sensitive data to .env files',
      details: ['Frontend configuration via .env', 'Better security practices'],
    },
    {
      version: '0.3.3.2',
      date: '2025-11-20',
      title: 'Version indicator added',
      description: 'Added version indicator to UI',
      details: ['Version badge in footer', 'Hover tooltip with details'],
    },
  ];

  return entries;
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
