// Version information for the application
// ///TODO: Update VERSION with every new release or deploying steps with new changes

//* CHANGELOG
// version 0.5.1.3: applied FormattedText to SavedThemesWidget for consistent markdown rendering
// version 0.5.1.2: added FormattedText component to render bold markdown in learn widget results
//* version 0.5.1.1: refactored console logs to use logger utility, added color coding, filter logic in frontend while gemini keeps on showing **************** :3
// version 0.5.0.1: new feature: LLM provider selection (Google Gemini or local Ollama) via .env config
// version 0.4.5.0: added video player + store modules
// version 0.3.4.1: outsourcing sensitive data to .env files for frontend configuration
// version 0.3.3.2: added version indicator

export const APP_VERSION = '0.5.1.3';
export const LAST_UPDATED = '2025-12-05';

export function getVersionString(): string {
  return `v${APP_VERSION}`;
}

export function getVersionInfo(): {
  version: string;
  date: string;
  timestamp: number;
} {
  return {
    version: APP_VERSION,
    date: LAST_UPDATED,
    timestamp: new Date(`${LAST_UPDATED}T00:00:00Z`).getTime(),
  };
}
