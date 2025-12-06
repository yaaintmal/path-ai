import { Coins } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  getCurrentBadge,
  getNextBadge,
  getProgressToNextBadge,
  formatExp,
} from '../../utils/BadgeSystem';
import type { UserStats } from './types';

interface UserStatsCardProps {
  userStats: UserStats;
  streakShields?: number;
}

export function UserStatsCard({ userStats, streakShields }: UserStatsCardProps) {
  const currentBadge = getCurrentBadge(userStats.exp);
  const nextBadge = getNextBadge(userStats.exp);
  const progress = getProgressToNextBadge(userStats.exp);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000); // update every minute
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-lg min-w-[320px]">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{currentBadge.icon}</div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{currentBadge.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {userStats.points.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-sm">Points</span>
            </div>
            {streakShields !== undefined && streakShields > 0 && (
              <div className="flex items-center gap-1 ml-2 text-sm">
                <span title="Streak Shields">🛡️</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{streakShields}</span>
              </div>
            )}
            {/* Active Boosts */}
            {userStats.activeBoosts && userStats.activeBoosts.length > 0 && (
              <div className="flex items-center gap-2 ml-2 text-sm">
                {userStats.activeBoosts.map((b, idx) => {
                  const expires = new Date(b.expiresAt);
                  const hoursLeft = Math.max(
                    0,
                    Math.ceil((expires.getTime() - now) / (1000 * 60 * 60))
                  );
                  return (
                    <div key={idx} className="flex items-center gap-1">
                      <span title={b.source}>⚡</span>
                      <span className="text-xs font-semibold">
                        {b.multiplier}x • {hoursLeft}h
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Streak Info */}
      <div className="mt-3 p-2 bg-card-foreground/5 dark:bg-card-foreground/30 rounded-lg text-xs">
        {userStats.currentStreak > 0 ? (
          <>
            <div className="flex justify-between text-orange-600 dark:text-orange-400">
              <span>🔥 {userStats.currentStreak} days streak</span>
              {userStats.currentStreak >= 3 ? (
                <span className="font-semibold">{userStats.multiplier.toFixed(1)}x multiplier</span>
              ) : (
                <span className="font-semibold">+{userStats.currentStreak * 100} daily</span>
              )}
            </div>
            {userStats.currentStreak < 3 && (
              <div className="text-purple-600 dark:text-purple-400 mt-1 text-center">
                💡 only {3 - userStats.currentStreak} day(s) remaining for the next
                multiplier-bonus!
              </div>
            )}
            {userStats.currentStreak >= 3 && userStats.multiplier < 3 && (
              <div className="text-green-600 dark:text-green-400 mt-1 text-center">
                🚀 Keep on going! Max. 3x for a 18-days-streak
              </div>
            )}
          </>
        ) : (
          <div className="text-muted-foreground text-center">
            🔥 Get a streak for bonus points
          </div>
        )}
      </div>

      {/* EXP Progress */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{formatExp(userStats.exp)} EXP</span>
          {nextBadge && (
            <span>
              {nextBadge.icon} {nextBadge.title}
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
