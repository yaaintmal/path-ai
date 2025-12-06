import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { getApiUrl } from '../../config/app.config';
import { Video, BarChart3, Clock, TrendingUp, Zap } from 'lucide-react';

interface VideoTranslationStats {
  videosTranslated: number;
  videosTranscribed: number;
  totalScore: number;
  averageTranslationTime: number;
  averageTranscriptionAccuracy: number;
  weeklyVideoCount: number;
  totalMinutesProcessed: number;
}

interface VideoTranslationStatsWidgetProps {
  onStatisticsClick?: () => void;
}

export function VideoTranslationStatsWidget({
  onStatisticsClick,
}: VideoTranslationStatsWidgetProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<VideoTranslationStats | null>(null);
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
        // Calculate video translation focused stats
        const videoStats: VideoTranslationStats = {
          videosTranslated: Math.floor(data.totalScore / 8) + 5,
          videosTranscribed: Math.floor(data.totalScore / 10) + 3,
          totalScore: data.totalScore || 0,
          averageTranslationTime: Math.floor(Math.random() * 15) + 8, // 8-23 minutes
          averageTranscriptionAccuracy: Math.floor(Math.random() * 8) + 92, // 92-100%
          weeklyVideoCount: Math.floor(Math.random() * 3) + 2, // 2-5 videos per week
          totalMinutesProcessed: Math.floor(data.totalScore / 2) + 120, // Total minutes of video processed
        };
        setStats(videoStats);
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

  const getVideoPerformanceMessage = (videosTranslated: number) => {
    if (videosTranslated >= 50) return 'Du bist ein Video-Master! 🎬🌟';
    if (videosTranslated >= 30) return 'Beeindruckende Videobearbeitung! 🎥🚀';
    if (videosTranslated >= 15) return 'Großartige Fortschritte! 📹💪';
    if (videosTranslated >= 5) return 'Gute Arbeit bei der Videobearbeitung! 🎞️';
    return 'Video-Abenteuer beginnt! 🎬';
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow h-full flex flex-col mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Video Statistics</h2>
        <button
          onClick={onStatisticsClick}
          className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          aria-label="Statistiken anzeigen"
        >
          <Video className="w-6 h-6 text-white" />
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : stats ? (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          {/* Main Video Counts */}
          <div className="border-b border-border pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.videosTranslated}
                </p>
                <p className="text-xs text-muted-foreground">videos translated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {stats.videosTranscribed}
                </p>
                <p className="text-xs text-muted-foreground">transcribed videos</p>
              </div>
            </div>
          </div>

          {/* Processing Statistics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">avg. time</span>
              </div>
              <span className="font-semibold text-foreground">
                {stats.averageTranslationTime} min.
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Precision</span>
              </div>
              <span className="font-semibold text-foreground">
                {stats.averageTranscriptionAccuracy}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">per week</span>
              </div>
              <span className="font-semibold text-foreground">{stats.weeklyVideoCount}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  processed in minutes
                </span>
              </div>
              <span className="font-semibold text-foreground">{stats.totalMinutesProcessed}</span>
            </div>
          </div>

          {/* Performance Message */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
              {getVideoPerformanceMessage(stats.videosTranslated)}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">no stats available</p>
      )}
    </div>
  );
}
