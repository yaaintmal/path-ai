import { useEffect, useState, useCallback } from 'react';
import { Flame } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { getApiUrl, config } from '../../config/app.config';

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
  topicsLearned: number;
  weeklyLearningRate: number;
  totalLessonsCompleted: number;
}

// Helper functions for Streak Shield management (duplicated for isolation)
const readShieldsFromStorage = (): number => {
  const shields = localStorage.getItem('streak_shields');
  return shields ? parseInt(shields, 10) : 0;
};

const writeShieldsToStorage = (count: number): void => {
  localStorage.setItem('streak_shields', count.toString());
};

const readLastKnownActive = (): string | null => {
  return localStorage.getItem('last_known_active');
};

const writeLastKnownActive = (dateIso: string): void => {
  localStorage.setItem('last_known_active', dateIso);
};

const readLastKnownStreak = (): number => {
  const streak = localStorage.getItem('last_known_streak');
  return streak ? parseInt(streak, 10) : 0;
};

const writeLastKnownStreak = (n: number): void => {
  localStorage.setItem('last_known_streak', n.toString());
};

const consumeShieldAndUpdateState = (): number => {
  const current = readShieldsFromStorage();
  if (current > 0) {
    const newCount = current - 1;
    writeShieldsToStorage(newCount);
    return newCount;
  }
  return current;
};

interface StreakWidgetProps {
  onStatisticsClick?: () => void;
}

export function StreakWidget({ onStatisticsClick }: StreakWidgetProps) {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  const recordActivityAndFetchStreak = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // First, record the activity
      const activityRes = await fetch(getApiUrl('/api/users/activity'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (activityRes.ok) {
        console.log('Activity recorded successfully');
      } else {
        console.error('Failed to record activity:', activityRes.status);
      }

      // Then fetch the updated streak
      const streakRes = await fetch(getApiUrl(`/api/users/streaks?userId=${user.id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (streakRes.ok) {
        const data = await streakRes.json();
        let currentStreak = data.currentStreak || 0;

        // Read shield and streak history from local storage
        const shields = readShieldsFromStorage();
        const lastKnownActive = readLastKnownActive();
        const lastKnownStreak = readLastKnownStreak();

        // Compute today and yesterday dates for streak shield logic
        const todayIso = new Date().toISOString().slice(0, 10);
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayIso = yesterdayDate.toISOString().slice(0, 10);

        // Streak shield consumption logic
        if (currentStreak > 0) {
          // Server reports positive streak; record it
          writeLastKnownActive(todayIso);
          writeLastKnownStreak(currentStreak);
        } else if (
          currentStreak === 0 &&
          lastKnownActive === yesterdayIso &&
          lastKnownStreak > 0 &&
          shields > 0
        ) {
          // Missed yesterday detected and shield available; attempt server-side consume if feature enabled
          if (config.features.useStoreApi) {
            try {
              const token = localStorage.getItem('authToken');
              const consumeRes = await fetch(getApiUrl('/api/users/consume-shield'), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  idempotencyKey: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
                }),
              });

              if (consumeRes.ok) {
                const data = await consumeRes.json();
                const inv = data.inventory || {};
                const newCount = inv['shield_basic'] ?? inv['6'] ?? Math.max(0, shields - 1);
                writeShieldsToStorage(newCount);
                currentStreak = data.newStreakData?.currentStreak ?? lastKnownStreak;
                writeLastKnownActive(todayIso);
                window.alert(
                  `Streak Shield verbraucht — dein Streak bleibt bei ${currentStreak} Tagen!`
                );
              } else {
                // fallback local
                consumeShieldAndUpdateState();
                currentStreak = lastKnownStreak;
                writeLastKnownActive(todayIso);
                window.alert(
                  `Streak Shield verbraucht — dein Streak bleibt bei ${currentStreak} Tagen!`
                );
              }
            } catch (err) {
              console.error('consume shield failed:', err);
              consumeShieldAndUpdateState();
              currentStreak = lastKnownStreak;
              writeLastKnownActive(todayIso);
              window.alert(
                `Streak Shield verbraucht — dein Streak bleibt bei ${currentStreak} Tagen!`
              );
            }
          } else {
            // local fallback
            consumeShieldAndUpdateState();
            currentStreak = lastKnownStreak;
            writeLastKnownActive(todayIso);
            window.alert(
              `Streak Shield verbraucht — dein Streak bleibt bei ${currentStreak} Tagen!`
            );
          }
        }

        // Set streak with potentially preserved value
        setStreak({ ...data, currentStreak });
      } else {
        console.error('Failed to fetch streak:', streakRes.status);
      }
    } catch (e) {
      console.error('Error in recordActivityAndFetchStreak:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    recordActivityAndFetchStreak();
  }, [recordActivityAndFetchStreak]);

  // Helper to get flame emoji based on streak length
  const getFlame = (days: number) => {
    if (days >= 30) return '🔥🔥🔥'; // 1 month+
    if (days >= 14) return '🔥🔥'; // 2 weeks+
    if (days >= 7) return '🔥'; // 1 week+
    if (days >= 3) return '✨'; // 3+ days
    if (days > 0) return '🙂'; // 1-2 days
    return '';
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">actual streak</h2>
        <button
          onClick={() => onStatisticsClick && onStatisticsClick()}
          aria-label="View statistics"
          className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Flame className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : streak ? (
          <>
            <p className="text-muted-foreground text-sm mb-2">
              {streak.currentStreak} days in a row {getFlame(streak.currentStreak)}
            </p>
            <p className="text-xs text-muted-foreground mb-1">
              highest streak: {streak.bestStreak} {streak.bestStreak === 1 ? 'day' : 'days'}
            </p>
            <p className="text-xs text-muted-foreground">
              total score: {streak.totalScore}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">no data available</p>
        )}
      </div>
    </div>
  );
}
