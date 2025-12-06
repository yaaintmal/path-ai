// Badge system with exp thresholds and titles
export const BADGE_THRESHOLDS = [
  { exp: 0, title: 'Newbie', icon: '🫠' },
  { exp: 1000, title: 'Starter', icon: '🌱' },
  { exp: 5000, title: 'Learner', icon: '📚' },
  { exp: 10000, title: 'Scholar', icon: '🎓' },
  { exp: 25000, title: 'Expert', icon: '🔥' },
  { exp: 50000, title: 'Master', icon: '✨' },
  { exp: 100000, title: 'Programming Wizard', icon: '🧙' },
  { exp: 250000, title: 'Code Ninja', icon: '🥷' },
  { exp: 500000, title: 'Algorithm Overlord', icon: '👑' },
  { exp: 1000000, title: 'The Enlightened', icon: '🌟' },
] as const;

export interface Badge {
  exp: number;
  title: string;
  icon: string;
}

export function getCurrentBadge(exp: number): Badge {
  let currentBadge: Badge = { ...BADGE_THRESHOLDS[0] };
  for (const badge of BADGE_THRESHOLDS) {
    if (exp >= badge.exp) {
      currentBadge = { ...badge };
    } else {
      break;
    }
  }
  return currentBadge;
}

export function getNextBadge(exp: number): Badge | null {
  for (const badge of BADGE_THRESHOLDS) {
    if (exp < badge.exp) {
      return badge as Badge;
    }
  }
  return null;
}

export function getProgressToNextBadge(exp: number): number {
  const currentBadge = getCurrentBadge(exp);
  const nextBadge = getNextBadge(exp);
  if (!nextBadge) return 100;
  const expRange = nextBadge.exp - currentBadge.exp;
  const expInRange = exp - currentBadge.exp;
  return Math.round((expInRange / expRange) * 100);
}

export function formatExp(exp: number): string {
  if (exp >= 1000000) {
    return `${(exp / 1000000).toFixed(1)}M`;
  }
  if (exp >= 1000) {
    return `${(exp / 1000).toFixed(1)}K`;
  }
  return exp.toString();
}
