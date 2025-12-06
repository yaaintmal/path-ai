export type WordTiming = {
  text: string;
  start?: number;
  end?: number;
  type?: string;
};

export type WebvttCue = {
  start: number;
  end: number;
  text: string;
};

const formatTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = seconds % 60;
  const wholeSeconds = Math.floor(secs).toString().padStart(2, '0');
  const milliseconds = Math.round((secs - Math.floor(secs)) * 1000)
    .toString()
    .padStart(3, '0');

  return `${hours}:${minutes}:${wholeSeconds}.${milliseconds}`;
};

const buildWebVttFromCues = (cues: WebvttCue[]): string => {
  if (!cues.length) return '';
  const lines = ['WEBVTT', ''];
  cues.forEach((cue, idx) => {
    const start = formatTimestamp(cue.start);
    const end = formatTimestamp(cue.end);
    lines.push(`${idx + 1}`, `${start} --> ${end}`, cue.text, '');
  });

  return lines.join('\n');
};

const buildCuesFromWords = (words: WordTiming[]): WebvttCue[] => {
  if (!words.length) return [];

  const cues: WebvttCue[] = [];
  const firstTimed = words.find((w) => w.start !== undefined && w.end !== undefined);
  if (!firstTimed) return [];

  let currentStart = firstTimed.start ?? 0;
  let currentEnd = firstTimed.end ?? currentStart;
  let currentText: string[] = [];

  const pushCue = () => {
    if (!currentText.length) return;
    cues.push({ start: currentStart, end: currentEnd, text: currentText.join('').trim() });
  };

  const isSentenceBoundary = (word: string) => /[.!?]/.test(word);
  const MAX_CUE_DURATION = 6; // seconds

  for (const w of words) {
    if (w.start === undefined || w.end === undefined) continue;
    const token = w.text ?? '';
    const nextWouldExceedDuration = w.end - currentStart > MAX_CUE_DURATION;
    const boundary = isSentenceBoundary(token);

    if (nextWouldExceedDuration || boundary) {
      pushCue();
      currentStart = w.start;
      currentText = [token];
    } else {
      currentText.push(token);
    }

    currentEnd = w.end;
  }

  pushCue();
  return cues;
};

const buildWebVttFromWords = (words: WordTiming[]): string => {
  const cues = buildCuesFromWords(words);
  return buildWebVttFromCues(cues);
};

const parseTimestamp = (ts: string): number => {
  if (!ts) return 0;
  const [hms, ms = '0'] = ts.split('.');
  if (!hms) return 0;
  const [h = 0, m = 0, s = 0] = hms.split(':').map((n) => Number(n) || 0);
  return h * 3600 + m * 60 + s + Number(ms) / 1000;
};

const parseWebVttToCues = (vtt: string): WebvttCue[] => {
  const lines = vtt.split(/\r?\n/);
  const cues: WebvttCue[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (!line) continue;

    const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
    if (!timeMatch || !timeMatch[1] || !timeMatch[2]) continue;
    const start = parseTimestamp(timeMatch[1]);
    const end = parseTimestamp(timeMatch[2]);
    const textLines: string[] = [];
    i++;
    while (i < lines.length) {
      const nextLine = lines[i] ?? '';
      if (!nextLine || nextLine.trim() === '') break;
      textLines.push(nextLine);
      i++;
    }
    cues.push({ start, end, text: textLines.join(' ').trim() });
  }
  return cues;
};

export { buildWebVttFromWords, buildWebVttFromCues, buildCuesFromWords, parseWebVttToCues };
export default buildWebVttFromWords;
