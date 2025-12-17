import type { Request, Response } from 'express'; // Use type-only import
import ChangelogEntry from '../models/ChangelogEntry.ts';
import { info, error } from '../utils/logger.ts'; // Import info and error directly
import fs from 'fs';
import path from 'path';

export const getChangelog = async (req: Request, res: Response) => {
  try {
    const changelog = await ChangelogEntry.find().sort({ version: -1 });

    // Fallback: if DB has no entries, read from bundled JSON file
    if (!changelog || changelog.length === 0) {
      try {
        // Safely resolve module directory (works in ESM and tests where __dirname may be undefined)
        const moduleDir = await (async () => {
          try {
            const { fileURLToPath } = await import('url');

            const importMetaUrl = (() => {
              try {
                // Evaluate import.meta.url at runtime without exposing the token to static parsers
                // eslint-disable-next-line no-new-func
                return Function(
                  'return (typeof import !== "undefined" && import.meta && import.meta.url) ? import.meta.url : undefined'
                )();
              } catch {
                return undefined;
              }
            })();

            if (importMetaUrl) {
              return path.dirname(fileURLToPath(importMetaUrl));
            }
            return undefined;
          } catch {
            return undefined;
          }
        })();

        const candidatePaths = [
          path.join(process.cwd(), 'src', 'data', 'changelog.json'),
          path.join(process.cwd(), 'dist', 'data', 'changelog.json'),
          ...(moduleDir
            ? [
                path.join(moduleDir, '..', 'data', 'changelog.json'),
                path.join(moduleDir, '..', '..', 'src', 'data', 'changelog.json'),
              ]
            : []),
        ];

        let foundPath: string | null = null;
        for (const p of candidatePaths) {
          if (fs.existsSync(p)) {
            foundPath = p;
            break;
          }
        }

        if (!foundPath) {
          info(
            '[Changelog] No local changelog.json found. Tried locations: %s',
            candidatePaths.join(', ')
          );
          throw new Error('No local changelog.json file found in expected locations');
        }

        const raw = fs.readFileSync(foundPath, 'utf8');
        const fileEntries = JSON.parse(raw);
        info(
          `[Changelog] DB empty — returning ${Array.isArray(fileEntries) ? fileEntries.length : 'unknown'} entries from ${foundPath}`
        );
        return res.json(fileEntries);
      } catch (fileErr) {
        const msg = fileErr instanceof Error ? fileErr.message : String(fileErr);
        error(`[Changelog] Failed to read fallback changelog JSON: ${msg}`);
        // continue to return empty array to caller
      }
    }

    res.json(changelog);
  } catch (err: unknown) {
    // Cast err to unknown
    const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching changelog';
    error(`Error fetching changelog: ${errorMessage}`); // Use error directly
    res.status(500).json({ message: errorMessage });
  }
};

export const getLatestChangelogEntry = async (req: Request, res: Response) => {
  try {
    const latestEntry = await ChangelogEntry.findOne().sort({ version: -1 });

    if (!latestEntry) {
      // Attempt to use file fallback when database is empty
      try {
        // Safely resolve module directory (works in ESM and tests where __dirname may be undefined)
        const moduleDir = await (async () => {
          try {
            const { fileURLToPath } = await import('url');

            const importMetaUrl = (() => {
              try {
                // Evaluate import.meta.url at runtime without exposing the token to static parsers
                // eslint-disable-next-line no-new-func
                return Function(
                  'return (typeof import !== "undefined" && import.meta && import.meta.url) ? import.meta.url : undefined'
                )();
              } catch {
                return undefined;
              }
            })();

            if (importMetaUrl) {
              return path.dirname(fileURLToPath(importMetaUrl));
            }
            return undefined;
          } catch {
            return undefined;
          }
        })();

        const candidatePaths = [
          path.join(process.cwd(), 'src', 'data', 'changelog.json'),
          path.join(process.cwd(), 'dist', 'data', 'changelog.json'),
          ...(moduleDir
            ? [
                path.join(moduleDir, '..', 'data', 'changelog.json'),
                path.join(moduleDir, '..', '..', 'src', 'data', 'changelog.json'),
              ]
            : []),
        ];

        let foundPath: string | null = null;
        for (const p of candidatePaths) {
          if (fs.existsSync(p)) {
            foundPath = p;
            break;
          }
        }

        if (!foundPath) {
          info(
            '[Changelog] No local changelog.json found. Tried locations: %s',
            candidatePaths.join(', ')
          );
          throw new Error('No local changelog.json file found in expected locations');
        }

        const raw = fs.readFileSync(foundPath, 'utf8');
        const fileEntries = JSON.parse(raw);
        info(
          `[Changelog] Using fallback changelog.json at ${foundPath} (entries=${Array.isArray(fileEntries) ? fileEntries.length : 'unknown'})`
        );

        if (Array.isArray(fileEntries) && fileEntries.length > 0) {
          // Assume the file entries are sorted newest first; otherwise sort by version
          fileEntries.sort((a: any, b: any) => b.version.localeCompare(a.version));
          const fallback = fileEntries[0];
          info('[Changelog] Returning latest entry from changelog.json fallback');
          return res.json(fallback);
        }
      } catch (fileErr) {
        const msg = fileErr instanceof Error ? fileErr.message : String(fileErr);
        error(`[Changelog] Failed to read fallback changelog JSON: ${msg}`);
      }

      return res.status(404).json({ message: 'No changelog entries found' });
    }

    res.json(latestEntry);
  } catch (err: unknown) {
    // Cast err to unknown
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error fetching latest changelog entry';
    error(`Error fetching latest changelog entry: ${errorMessage}`); // Use error directly
    res.status(500).json({ message: errorMessage });
  }
};
