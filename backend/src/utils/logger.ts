// Simple logger util with ANSI color support (amber for highlights)
// and file-based daily rotation. Logs are written to the console
// (colored when supported) and appended to a daily log file
// named `path-ai-YYYY-MM-DD.log` under the `logs/` directory.

const RESET = '\x1b[0m';
const AMBER = '\x1b[38;5;214m'; // amber-ish color (256-color)
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const GRAY = '\x1b[90m'; // dim/gray

const ENABLE_COLOR = process.env.ENABLE_COLOR_LOGS !== 'false' && !!process.stdout?.isTTY;

function colorize(color: string, msg: string): string {
  if (!ENABLE_COLOR) return msg;
  return `${color}${msg}${RESET}`;
}

export function amberLog(msg: string, ...args: unknown[]) {
  const formatted = util.format(msg, ...args);
  console.log(colorize(AMBER, formatted));
  writeToFile('[AMBER]', msg, ...args);
}

export function info(msg: string, ...args: unknown[]) {
  const formatted = util.format(msg, ...args);
  console.log(colorize(YELLOW, `[INFO] ${formatted}`));
  writeToFile('[INFO]', msg, ...args);
}

export function success(msg: string, ...args: unknown[]) {
  const formatted = util.format(msg, ...args);
  console.log(colorize(GREEN, formatted));
  writeToFile('[SUCCESS]', msg, ...args);
}

export function error(msg: string, ...args: unknown[]) {
  const formatted = util.format(msg, ...args);
  console.error(colorize(RED, `[ERROR] ${formatted}`));
  writeToFile('[ERROR]', msg, ...args);
}

export function debug(msg: string, ...args: unknown[]) {
  if (process.env.NODE_ENV === 'production') return;
  const formatted = util.format(msg, ...args);
  console.log(colorize(BLUE, `[DEBUG] ${formatted}`));
  writeToFile('[DEBUG]', msg, ...args);
}

// helper text-only colorizers for composing messages with mixed colors
export function grayText(msg: string): string {
  return colorize(GRAY, msg);
}

export function amberText(msg: string): string {
  return colorize(AMBER, msg);
}

export function greenText(msg: string): string {
  return colorize(GREEN, msg);
}

// --- File logging / rotation ---
import fs from 'fs';
import path from 'path';
import util from 'util';

const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
let currentDateStr = getDateString(new Date());
let logStream: fs.WriteStream | null = null;

function getDateString(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function ensureLogDir() {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch (err) {
    // ignore
  }
}

function openLogStream() {
  ensureLogDir();
  const filename = `path-ai-${currentDateStr}.log`;
  const filePath = path.join(LOG_DIR, filename);
  logStream = fs.createWriteStream(filePath, { flags: 'a' });
}

function rotateIfNeeded() {
  const today = getDateString(new Date());
  if (today !== currentDateStr || !logStream) {
    if (logStream) {
      try {
        logStream.end();
      } catch (e) {
        // ignore
      }
      logStream = null;
    }
    currentDateStr = today;
    openLogStream();
  }
}

function stripAnsiCodes(s: string) {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function writeToFile(level: string, msg: string, ...args: unknown[]) {
  try {
    rotateIfNeeded();
    if (!logStream) openLogStream();
    if (!logStream) return;
    const ts = new Date().toISOString();
    const formatted = util.format(msg, ...args);
    const line = `${ts} ${level} ${stripAnsiCodes(formatted)}\n`;
    logStream.write(line);
  } catch (err) {
    // don't break on logging errors
  }
}

// Close stream on process exit
process.on('exit', () => {
  try {
    if (logStream) logStream.end();
  } catch (e) {}
});

// --- Critical file logging (separate file for easy lookup) ---
let currentCriticalDateStr = getDateString(new Date());
let criticalStream: fs.WriteStream | null = null;

function openCriticalStream() {
  ensureLogDir();
  const filename = `path-ai-critical-${currentCriticalDateStr}.log`;
  const filePath = path.join(LOG_DIR, filename);
  criticalStream = fs.createWriteStream(filePath, { flags: 'a' });
}

function rotateCriticalIfNeeded() {
  const today = getDateString(new Date());
  if (today !== currentCriticalDateStr || !criticalStream) {
    if (criticalStream) {
      try {
        criticalStream.end();
      } catch (e) {
        // ignore
      }
      criticalStream = null;
    }
    currentCriticalDateStr = today;
    openCriticalStream();
  }
}

function writeToCriticalFile(level: string, msg: string, ...args: unknown[]) {
  try {
    rotateCriticalIfNeeded();
    if (!criticalStream) openCriticalStream();
    if (!criticalStream) return;
    const ts = new Date().toISOString();
    const formatted = util.format(msg, ...args);
    const line = `${ts} ${level} ${stripAnsiCodes(formatted)}\n`;
    criticalStream.write(line);
  } catch (err) {
    // don't break on logging errors
  }
}

process.on('exit', () => {
  try {
    if (criticalStream) criticalStream.end();
  } catch (e) {}
});

export function critical(msg: string, ...args: unknown[]) {
  const formatted = util.format(msg, ...args);
  const CRIT = '\x1b[91m';
  console.error(colorize(CRIT, `[CRITICAL] ${formatted}`));
  writeToCriticalFile('[CRITICAL]', msg, ...args);
}
