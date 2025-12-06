import { BADGE_THRESHOLDS, formatExp } from '../../utils/BadgeSystem';
import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { fireConfetti } from '../../utils/confetti';

interface BadgesSectionProps {
  currentExp: number;
}

export function BadgesSection({ currentExp }: BadgesSectionProps) {
  const { userDetails } = useAuth();
  const hasConfetti = (userDetails?.inventory?.['8'] ?? 0) > 0;
  const getBadgeIndex = (exp: number) => {
    for (let i = BADGE_THRESHOLDS.length - 1; i >= 0; i--) {
      if (exp >= BADGE_THRESHOLDS[i].exp) return i;
    }
    return -1;
  };
  const prevBadgeIndex = useRef<number>(getBadgeIndex(currentExp));

  // No need to sync state for confetti availability; derive from userDetails directly

  useEffect(() => {
    const idx = getBadgeIndex(currentExp);
    if (idx > prevBadgeIndex.current && hasConfetti) {
      // level up detected
      fireConfetti();
    }
    prevBadgeIndex.current = idx;
  }, [currentExp, hasConfetti]);
  return (
    <div className="mb-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🏆 All Badges</h2>
        {hasConfetti && (
          <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <span>🎉</span>
            <span>Confetti activated</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {BADGE_THRESHOLDS.map((badge) => {
          const isUnlocked = currentExp >= badge.exp;
          return (
            <div
              key={badge.exp}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                isUnlocked
                  ? 'bg-white dark:bg-gray-800 border-purple-400 dark:border-purple-600 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 opacity-50'
              }`}
              title={`${badge.title} - ${badge.exp.toLocaleString()} EXP`}
            >
              <span className={`text-2xl ${!isUnlocked && 'grayscale'}`}>{badge.icon}</span>
              <div className="text-xs">
                <p
                  className={`font-semibold ${
                    isUnlocked
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {badge.title}
                </p>
                <p className="text-gray-500 dark:text-gray-400">{formatExp(badge.exp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
