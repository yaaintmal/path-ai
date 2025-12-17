import fs from 'fs';
import path from 'path'; // Corrected import
import mongoose from 'mongoose'; // Corrected mongoose import
import ChangelogEntry from '#models/ChangelogEntry';
import { info, error } from '#utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathaidb';

async function migrateChangelog() {
  info('[Migration] Starting changelog migration...');

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    info('[Migration] Connected to MongoDB');

    // Read changelog.json (resolve relative to script file so it works regardless of CWD)
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const changelogJsonPath = path.join(__dirname, '..', 'src', 'data', 'changelog.json');

    if (!fs.existsSync(changelogJsonPath)) {
      throw new Error(`Changelog JSON not found at expected path: ${changelogJsonPath}`);
    }

    const changelogData = JSON.parse(fs.readFileSync(changelogJsonPath, 'utf8'));

    // Ensure changelog entries are in descending order by version for insertion consistency
    changelogData.sort((a: any, b: any) => {
      return b.version.localeCompare(a.version);
    });

    // Insert entries into MongoDB
    await ChangelogEntry.insertMany(changelogData);
    info(`[Migration] Successfully inserted ${changelogData.length} changelog entries.`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      error(`[Migration] Error during changelog migration: ${err.message}`);
    } else {
      error(`[Migration] An unknown error occurred during changelog migration`);
    }
    error(String(err)); // Ensure err is a string for the error function
  } finally {
    await mongoose.disconnect();
    info('[Migration] MongoDB disconnected.');
  }
}

migrateChangelog();
