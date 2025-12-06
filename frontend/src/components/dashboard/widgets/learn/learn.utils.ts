import type { SubTopic, StartingPoint, Difficulty } from './learn.types';

/**
 * Remove surrounding formatting characters like **, *, _, `
 * Repeatedly strips layers like **_text_** -> text
 */
export function cleanTitle(title: string, stripBold: boolean): string {
  if (!stripBold) return title;

  let cleaned = title.trim();
  let removed = true;
  while (removed) {
    removed = false;
    // backticks
    if (/^`.*`$/.test(cleaned)) {
      cleaned = cleaned.replace(/^`(.*)`$/, '$1').trim();
      removed = true;
      continue;
    }
    // double asterisks
    if (/^\*\*.*\*\*$/.test(cleaned)) {
      cleaned = cleaned.replace(/^\*\*(.*)\*\*$/, '$1').trim();
      removed = true;
      continue;
    }
    // single asterisk
    if (/^\*.*\*$/.test(cleaned)) {
      cleaned = cleaned.replace(/^\*(.*)\*$/, '$1').trim();
      removed = true;
      continue;
    }
    // underscores
    if (/^_.*_$/.test(cleaned)) {
      cleaned = cleaned.replace(/^_(.*)_$/, '$1').trim();
      removed = true;
      continue;
    }
  }
  return cleaned;
}

export function parseStartingPointsResponse(response: string, stripBold = false): StartingPoint[] {
  return response
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .map((title, idx) => ({
      id: `start-${idx}`,
      title: cleanTitle(title, stripBold),
    }));
}

export function parseSubtopicsResponse(response: string, stripBold = false): SubTopic[] {
  return response
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .map((line, idx) => {
      let difficulty: Difficulty = 'beginner';
      let title = line;

      if (title.includes('[ADVANCED]')) {
        difficulty = 'advanced';
        title = title.replace(/\[ADVANCED\]\s*/, '');
      } else if (title.includes('[INTERMEDIATE]')) {
        difficulty = 'intermediate';
        title = title.replace(/\[INTERMEDIATE\]\s*/, '');
      } else {
        title = title.replace(/\[BEGINNER\]\s*/, '');
      }

      // apply optional cleanTitle
      title = cleanTitle(title, stripBold);
      return { id: `sub-${idx}`, title, difficulty };
    });
}
