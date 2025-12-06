import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { getApiUrl } from '../../config/app.config';
import { Flame, BookOpen, Target } from 'lucide-react';

interface CompactStreakStats {
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
  topicsLearned: number;
  weeklyLearningRate: number;
  totalLessonsCompleted: number;
}

interface CompactStreakWidgetProps {
  onStatisticsClick?: () => void;
}

export function CompactStreakWidget({ onStatisticsClick }: CompactStreakWidgetProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<CompactStreakStats | null>(null);
  const [loading, setLoading] = useState(true);

  const recordActivityAndFetchStatistics = useCallback(async () => {
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
      // Record the activity
      await fetch(getApiUrl('/api/users/activity'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      // Fetch the updated statistics
      const statsRes = await fetch(getApiUrl(`/api/users/streaks?userId=${user.id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsRes.ok) {
        const data = await statsRes.json();
        const compactStats: CompactStreakStats = {
          currentStreak: data.currentStreak || 0,
          bestStreak: data.bestStreak || 0,
          totalScore: data.totalScore || 0,
          topicsLearned: data.topicsLearned || 0,
          weeklyLearningRate: data.weeklyLearningRate || 0,
          totalLessonsCompleted: data.totalLessonsCompleted || 0,
        };
        setStats(compactStats);
      } else {
        console.error('Failed to fetch statistics:', statsRes.status);
      }
    } catch (e) {
      console.error('Error in recordActivityAndFetchStatistics:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    recordActivityAndFetchStatistics();
  }, [recordActivityAndFetchStatistics]);

  const getFlame = (days: number) => {
    if (days >= 30) return '🔥🔥🔥';
    if (days >= 14) return '🔥🔥';
    if (days >= 7) return '🔥';
    if (days >= 3) return '✨';
    if (days > 0) return '🙂';
    return '';
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">actual streak</h2>
        <button
          onClick={onStatisticsClick}
          className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          aria-label="Statistiken anzeigen"
        >
          <Flame className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {loading ? (
          <p className="text-muted-foreground text-sm">loading...</p>
        ) : stats ? (
          <>
            {/* Main Streak Display */}
            <div className="mb-3">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.currentStreak}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                days in a row {getFlame(stats.currentStreak)}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="text-orange-500">→</span> highest streak
                </span>
                <span className="font-semibold text-card-foreground">{stats.bestStreak}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-blue-500" /> learned in total
                </span>
                <span className="font-semibold text-card-foreground">{stats.topicsLearned}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-green-500" /> per week
                </span>
                <span className="font-semibold text-card-foreground">
                  {stats.weeklyLearningRate}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">no data available</p>
        )}
      </div>
    </div>
  );
}
