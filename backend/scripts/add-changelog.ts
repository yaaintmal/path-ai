import mongoose from 'mongoose';
import ChangelogEntry from '#models/ChangelogEntry';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathaidb';

function usage() {
  console.log(`Usage: ts-node scripts/add-changelog.ts --version <version> --title <title> [--date YYYY-MM-DD] [--description <desc>] [--details "item1||item2||item3"] [--force]

Options:
  --version     (required) semantic version or identifier for the entry
  --title       (required) short title
  --date        ISO date (default: today)
  --description Short description
  --details     Pipe-separated list of detail lines (use || as separator)
  --force       Overwrite existing entry with same version

Example:
  ts-node scripts/add-changelog.ts --version 0.7.9 --title "Fix: Small bug" --description "Fixed X" --details "Fixed A||Fixed B" --date 2025-12-16
`);
}

function parseArgs(rawArgs: string[]) {
  const args: Record<string, any> = {};
  for (let i = 0; i < rawArgs.length; i++) {
    const a = rawArgs[i];
    if (!a.startsWith('--')) continue;
    const key = a.replace(/^--/, '');
    const next = rawArgs[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true; // flag
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.version || !args.title) {
    usage();
    process.exit(1);
  }

  const date = args.date || new Date().toISOString().slice(0, 10);
  const description = args.description || '';
  const details = args.details
    ? String(args.details)
        .split('||')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const force = !!args.force;

  console.log('[AddChangelog] Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  try {
    const existing = await ChangelogEntry.findOne({ version: args.version });
    if (existing && !force) {
      console.error(
        `[AddChangelog] Entry with version ${args.version} already exists. Use --force to overwrite.`
      );
      process.exitCode = 2;
      return;
    }

    if (existing && force) {
      console.log(`[AddChangelog] Overwriting existing entry ${args.version}`);
      existing.title = args.title;
      existing.date = date;
      existing.description = description;
      existing.details = details;
      await existing.save();
      console.log('[AddChangelog] Updated entry:', existing.version);
    } else {
      const created = await ChangelogEntry.create({
        version: args.version,
        date,
        title: args.title,
        description,
        details,
      });
      console.log('[AddChangelog] Created entry:', created.version);
    }
  } catch (err: unknown) {
    console.error('[AddChangelog] Error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[AddChangelog] Done.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
