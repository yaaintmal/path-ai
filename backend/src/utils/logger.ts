// Simple logger util with ANSI color support (amber for highlights)
// This keeps dependencies minimal and provides a centralized location
// to change colors or disable them based on env.

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
  console.log(colorize(AMBER, msg), ...args);
}

export function info(msg: string, ...args: unknown[]) {
  console.log(colorize(YELLOW, `[INFO] ${msg}`), ...args);
}

export function success(msg: string, ...args: unknown[]) {
  console.log(colorize(GREEN, msg), ...args);
}

export function error(msg: string, ...args: unknown[]) {
  console.error(colorize(RED, `[ERROR] ${msg}`), ...args);
}

export function debug(msg: string, ...args: unknown[]) {
  if (process.env.NODE_ENV === 'production') return;
  console.log(colorize(BLUE, `[DEBUG] ${msg}`), ...args);
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
