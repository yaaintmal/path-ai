import type { Subtitle } from './types';
import { parseTime } from './timeUtils';

export const parseVTT = (vtt: string): Subtitle[] =>
  vtt
    .split('\n')
    .map((line) => line.trim())
    .reduce<Subtitle[]>((acc, line, i, arr) => {
      if (line.includes('-->')) {
        const [start, end] = line.split('-->').map((part) => parseTime(part.trim()));
        const text = arr[i + 1];
        if (text) {
          acc.push({ start, end, text });
        }
      }
      return acc;
    }, []);
