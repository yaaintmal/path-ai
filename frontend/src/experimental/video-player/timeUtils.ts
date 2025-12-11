export function formatTime(seconds: number) {
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((seconds / 60) % 60)
    .toString()
    .padStart(2, '0');
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function parseTime(str: string) {
  const parts = str.split(':').map((p) => Number(p));
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(parts[0] || 0);
}

export default formatTime;
