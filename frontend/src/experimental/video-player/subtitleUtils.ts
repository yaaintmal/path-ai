export type Subtitle = {
  start: number;
  end: number;
  text: string;
};

export const parseVTT = (vtt: string): Subtitle[] => {
  // simple fallback parser used for keeping code in experimental
  return vtt
    .split(/\n\n+/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) return null;
      const timeLine = lines.find((l) => l.includes('-->')) || '';
      const text = lines.slice(1).join('\n');
      const match = timeLine.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}\.\d{3})/);
      if (!match) return { start: 0, end: 0, text };
      const parse = (s: string) => {
        const [h, m, rest] = s.split(':');
        const [sec, ms] = rest.split('.');
        return Number(h) * 3600 + Number(m) * 60 + Number(sec) + Number(ms) / 1000;
      };
      return { start: parse(match[1]), end: parse(match[2]), text } as Subtitle;
    })
    .filter(Boolean) as Subtitle[];
};

export default parseVTT;
