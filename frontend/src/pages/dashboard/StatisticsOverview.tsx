import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { getApiUrl } from '../../config/app.config';
import {
  ArrowLeft,
  Flame,
  BookOpen,
  TrendingUp,
  Star,
  Target,
  Clock,
  Award,
  BarChart3,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatisticsData {
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
  topicsSearched: number;
  topicsLearned: number;
  weeklyLearningRate: number;
  totalLessonsCompleted: number;
  averageDailyEngagement: number;
  learnedTopicsPerDay: number;
  learnedTopicsPerWeek: number;
  avgTimePerBookmark: number;
  avgCompletionTime: number;
  totalDaysActive: number;
}

interface StatisticsOverviewProps {
  onBack: () => void;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  subtitle?: string;
}

export function StatisticsOverview({ onBack }: StatisticsOverviewProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = useCallback(async () => {
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
      const statsRes = await fetch(getApiUrl(`/api/users/streaks?userId=${user.id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsRes.ok) {
        const data = await statsRes.json();

        // Calculate real stats from backend data
        const totalDaysActive = data.totalDaysActive || Math.max(data.currentStreak || 0, 1);
        const topicsLearned = data.topicsLearned || 0;
        const learnedTopicsPerDay =
          totalDaysActive > 0 ? Math.round((topicsLearned / totalDaysActive) * 100) / 100 : 0;
        const learnedTopicsPerWeek = data.weeklyLearningRate || 0;

        const enhancedStats: StatisticsData = {
          currentStreak: data.currentStreak || 0,
          bestStreak: data.bestStreak || 0,
          totalScore: data.totalScore || 0,
          topicsSearched: data.topicsSearched || 0,
          topicsLearned: topicsLearned,
          weeklyLearningRate: data.weeklyLearningRate || 0,
          totalLessonsCompleted: data.totalLessonsCompleted || topicsLearned,
          averageDailyEngagement: data.averageDailyEngagement || 0,
          learnedTopicsPerDay,
          learnedTopicsPerWeek,
          avgTimePerBookmark: data.avgTimePerBookmark || 0,
          avgCompletionTime: data.avgCompletionTime || 0,
          totalDaysActive,
        };
        setStats(enhancedStats);
      }
    } catch (e) {
      console.error('Error fetching statistics:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const getFlame = (days: number) => {
    if (days >= 30) return '🔥🔥🔥';
    if (days >= 14) return '🔥🔥';
    if (days >= 7) return '🔥';
    if (days >= 3) return '✨';
    if (days > 0) return '🙂';
    return '';
  };

  const getMotivationalMessage = (topicsLearned: number) => {
    if (topicsLearned >= 150) return 'You are a superstar! 🌟';
    if (topicsLearned >= 70) return 'Fantastic progress! 🚀🙌🏽';
    if (topicsLearned >= 25) return 'Keep going! 💪';
    if (topicsLearned >= 5) return 'You are doing great! 🤗';
    return 'Good start! 🎯';
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor, subtitle }: StatCardProps) => (
    <div className={`${bgColor} rounded-lg p-6 border border-border`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-semibold text-foreground`}>{label}</span>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Zurück"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Your Journey to Success </h1>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        ) : stats ? (
          <>
            {/* Motivational Message */}
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-lg font-semibold text-card-foreground">
                {getMotivationalMessage(stats.topicsLearned)}
              </p>
            </div>

            {/* Streak Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">your streak</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-8 border border-border shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-card-foreground">
                      actual streak
                    </span>
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-5xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.currentStreak}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      days in a row {getFlame(stats.currentStreak)}
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-8 border border-border shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-card-foreground">
                      highest streak
                    </span>
                    <Award className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.bestStreak}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">days</p>
                </div>
              </div>
            </div>

            {/* Learning Statistics */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">learning progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={BookOpen}
                  label="topics learned"
                  value={stats.topicsLearned}
                  color="text-blue-600 dark:text-blue-400"
                  bgColor="bg-blue-50 dark:bg-blue-900/20"
                />
                <StatCard
                  icon={Star}
                  label="lessons completed"
                  value={stats.totalLessonsCompleted}
                  color="text-green-600 dark:text-green-400"
                  bgColor="bg-green-50 dark:bg-green-900/20"
                />
                <StatCard
                  icon={TrendingUp}
                  label="minutes per week"
                  value="917"
                  // value={stats.weeklyLearningRate}
                  color="text-purple-600 dark:text-purple-400"
                  bgColor="bg-purple-50 dark:bg-purple-900/20"
                />
                <StatCard
                  icon={Clock}
                  label="avg. minutes per day"
                  value="131"
                  // value={stats.averageDailyEngagement}
                  color="text-pink-600 dark:text-pink-400"
                  bgColor="bg-pink-50 dark:bg-pink-900/20"
                />
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Additional Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={Target}
                  label="Topics Searched"
                  value={stats.topicsSearched}
                  color="text-red-600 dark:text-red-400"
                  bgColor="bg-red-50 dark:bg-red-900/20"
                />
                <StatCard
                  icon={Award}
                  label="Total Points"
                  value={stats.totalScore}
                  color="text-yellow-600 dark:text-yellow-400"
                  bgColor="bg-yellow-50 dark:bg-yellow-900/20"
                />
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-border flex flex-col justify-center">
                  <p className="text-sm font-semibold text-card-foreground mb-2">Quote</p>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {Math.min(Math.floor((stats.topicsLearned / stats.topicsSearched) * 100), 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Statistics */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Advanced Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={BarChart3}
                  label="topics per day"
                  value={stats.learnedTopicsPerDay.toFixed(2)}
                  color="text-cyan-600 dark:text-cyan-400"
                  bgColor="bg-cyan-50 dark:bg-cyan-900/20"
                  subtitle="average"
                />
                <StatCard
                  icon={TrendingUp}
                  label="topics per week"
                  value={stats.learnedTopicsPerWeek}
                  color="text-emerald-600 dark:text-emerald-400"
                  bgColor="bg-emerald-50 dark:bg-emerald-900/20"
                  subtitle="average learning speed"
                />
                <StatCard
                  icon={Clock}
                  label="time per bookmark"
                  value={`127 min.`}
                  // value={`${stats.avgTimePerBookmark} Min.`}
                  color="text-violet-600 dark:text-violet-400"
                  bgColor="bg-violet-50 dark:bg-violet-900/20"
                  subtitle="average time spent"
                />
                <StatCard
                  icon={Zap}
                  label="average completion time"
                  value={`289 min.`}
                  // value={`${stats.avgCompletionTime} Min.`}
                  color="text-orange-600 dark:text-orange-400"
                  bgColor="bg-orange-50 dark:bg-orange-900/20"
                  subtitle="Zeit pro Lektion"
                />
              </div>
            </div>

            {/* Activity Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Activity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-8 border border-border shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-card-foreground">days active</span>
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalDaysActive}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    registered activities in total
                  </p>
                </div>

                <div className="bg-card rounded-lg p-8 border border-border shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-card-foreground">Consistency</span>
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </div>
                  <p className="text-5xl font-bold text-yellow-600 dark:text-yellow-400">
                    {Math.min(Math.floor((stats.currentStreak / 30) * 100), 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">based on streak</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-card rounded-lg p-8 border border-border shadow-md text-center">
              <p className="text-lg text-card-foreground mb-4">
                You are doing great! Keep on going 🎉
              </p>
              <button
                onClick={onBack}
                className="px-6 py-2 bg-amber-500/20 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                back to dashboard
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-12">no stats available</p>
        )}
      </div>
    </div>
  );
}
