export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const parseTime = (value: string): number => {
  const [h = '0', m = '0', s = '0'] = value.split(':');
  const [sec = '0', ms = '0'] = s.split('.');
  return +h * 3600 + +m * 60 + +sec + +ms / 1000;
};
