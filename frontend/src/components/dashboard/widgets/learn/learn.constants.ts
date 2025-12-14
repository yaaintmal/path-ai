import { config } from '../../../../config/app.config';

export const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL || config.ollama.apiUrl;
export const LLM_MODEL = import.meta.env.VITE_OLLAMA_MODEL || config.ollama.model;

/**
 * Resolve the preferred language for LLM prompts.
 * Priority: user onboarding preference (localStorage 'user'.onboardingData.preferredLanguage) -> env/config fallback
 */
export function getPreferredLanguage(): string {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      const pref = u?.onboardingData?.preferredLanguage;
      if (pref) return pref;
    }
  } catch {
    // ignore parsing errors
  }
  try {
    const onboardStr = localStorage.getItem('onboarddata');
    if (onboardStr) {
      const onboard = JSON.parse(onboardStr);
      if (onboard?.preferredLanguage) return onboard.preferredLanguage;
    }
  } catch {
    // ignore
  }
  return import.meta.env.VITE_OLLAMA_LANGUAGE || config.ollama.language;
}

export const STARTING_POINTS_COUNT = 3;
export const SUBTOPICS_COUNT = 5;

export const PROMPTS = {
  startingPoints: (topic: string, language: string) =>
    `You are a learning assistant. A user wants to learn about "${topic}". Generate a numbered list of ${STARTING_POINTS_COUNT} starting points to help them start their learning journey.
    The starting points should be specific and related to the main topic.
    Format ONLY as numbered list like:
    1. Starting point 1
    2. Starting point 2
    3. Starting point 3
    Answer on ${language}`,

  subtopics: (startingPoint: string, mainTopic: string, language: string) =>
    `You are a learning assistant. A user selected the subtopic "${startingPoint}" related to learning "${mainTopic}". Generate a numbered list of ${SUBTOPICS_COUNT} matching subtopics with different difficulty levels.
    Provide ${SUBTOPICS_COUNT} subtopics in this exact format (one per line):
    1. [BEGINNER] Subtopic 1
    2. [BEGINNER] Subtopic 2
    3. [INTERMEDIATE] Subtopic 3
    4. [INTERMEDIATE] Subtopic 4
    5. [ADVANCED] Subtopic 5
    
    Make them progressively more complex. Answer on ${language}`,
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Anfänger',
  intermediate: 'Mittelstufe',
  advanced: 'Fortgeschritten',
};
