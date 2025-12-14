// Version information for the application
// ///TODO: Update VERSION with every new release or deploying steps with new changes

//* CHANGELOG
//* version 0.5.1.5: feature cleanup / move: removed active Video Studio / Video Translation feature as the focus has shifted in between the group project phases
//    >> future of video features to be re-evaluated after MVP launch as the focus has shifted to core learning experience and LLM integration
//*   >> fork now represents an enhanced refactor with advanced features of the originally next.js-built *Learnbuddy AI app
//    >> original video features are now archived in `src/experimental` folder for potential future reference.
//    >> removed original video-player and translation widgets to `src/experimental` and replaced with lightweight re-export wrappers.
//    >> Removed video env keys and `video` config; removed localStorage video-cleanup; updated dashboard and header references to not reference video modules due further single dev resource constraints.
// version 0.5.1.4: UI & translations: remove explicit 'video' copy from hero, features, language features, prompt templates and onboarding, replaced with neutral terms (content/resources/media); updated landing copy, dashboard preview, and onboarding item ids.
// version 0.5.1.3: applied FormattedText to SavedThemesWidget for consistent markdown rendering
// version 0.5.1.2: added FormattedText component to render bold markdown in learn widget results
// version 0.5.1.1: refactored console logs to use logger utility, added color coding, filter logic in frontend while gemini keeps on showing **************** :3
// version 0.5.0.1: new feature: LLM provider selection (Google Gemini or local Ollama) via .env config
// version 0.4.5.0: added video player + store modules
// version 0.3.4.1: outsourcing sensitive data to .env files for frontend configuration
// version 0.3.3.2: added version indicator

// fallback values for version and last updated date
// Fallback declared to >> 0.5.1.8.2 (Offline Version) / 2025-12-13
//* since v.0.5.1.9.5 introduced backend version fetching and health check
export const APP_VERSION = '0.5.1.8.2 (OV)';
export const LAST_UPDATED = '2025-12-13';

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
