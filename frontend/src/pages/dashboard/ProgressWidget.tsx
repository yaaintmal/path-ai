import { useBookmarks } from '../../contexts/useBookmarks';
import { TrendingUp, ShoppingCart } from 'lucide-react';
import {
  getCurrentBadge,
  getNextBadge,
  getProgressToNextBadge,
  formatExp,
} from '../../utils/BadgeSystem';

const TOPIC_WEIGHT = 100; // Topics (starting points) worth 100 progress points
const SUBTOPIC_WEIGHT = 30; // Subtopics worth 30 progress points

interface ProgressWidgetProps {
  onStoreClick?: () => void;
}

export function ProgressWidget({ onStoreClick }: ProgressWidgetProps) {
  const { bookmarks, learnedTopics } = useBookmarks();

  // Count bookmarked (open) topics and learned topics
  const openTopics = bookmarks?.filter((b) => b.type === 'topic' || !b.type).length || 0;
  const openSubtopics = bookmarks?.filter((b) => b.type === 'subtopic').length || 0;

  const learnedTopicsCount =
    learnedTopics?.filter((t) => t.type === 'topic' || !t.type).length || 0;
  const learnedSubtopicsCount = learnedTopics?.filter((t) => t.type === 'subtopic').length || 0;

  // Progress: based on LEARNED topics (how much you've completed out of total encountered)
  // Total encountered = learned + open
  const totalTopicsEncountered = learnedTopicsCount + openTopics;
  const totalSubtopicsEncountered = learnedSubtopicsCount + openSubtopics;

  // Progress shows ratio of learned to total encountered
  const learnedExp = learnedTopicsCount * TOPIC_WEIGHT + learnedSubtopicsCount * SUBTOPIC_WEIGHT;
  const totalPossibleExp =
    totalTopicsEncountered * TOPIC_WEIGHT + totalSubtopicsEncountered * SUBTOPIC_WEIGHT;
  const progress = totalPossibleExp > 0 ? Math.round((learnedExp / totalPossibleExp) * 100) : 0;

  // Persistent EXP: based on learned topics (permanent score)
  const persistentExp = learnedTopicsCount * TOPIC_WEIGHT + learnedSubtopicsCount * SUBTOPIC_WEIGHT;

  // Badge system
  const currentBadge = getCurrentBadge(persistentExp);
  const nextBadge = getNextBadge(persistentExp);
  const badgeProgress = getProgressToNextBadge(persistentExp);

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">your progress</h2>
        <div className="flex items-center gap-2">
          {/* Store Button */}
          <button
            onClick={onStoreClick}
            className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            aria-label="Store öffnen"
            title="Store öffnen"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Current Badge Display */}
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentBadge.icon}</span>
            <div>
              <p className="font-semibold text-card-foreground text-sm">{currentBadge.title}</p>
              <p className="text-xs text-muted-foreground">{formatExp(persistentExp)} EXP</p>
            </div>
          </div>
          {nextBadge && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">next:</p>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                {nextBadge.icon} {nextBadge.title}
              </p>
            </div>
          )}
        </div>
        {nextBadge && (
          <div className="mt-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${badgeProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {badgeProgress}% to {nextBadge.title}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Total Progress (Completion Rate)</span>
            <span className="font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {learnedTopicsCount + learnedSubtopicsCount} of{' '}
            {totalTopicsEncountered + totalSubtopicsEncountered} learned topics
          </p>
        </div>

        {/* Open Topics to Learn */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Main Topic Progress</span>
            <span className="font-medium text-blue-600">
              {learnedTopicsCount}/{totalTopicsEncountered}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${totalTopicsEncountered > 0 ? (learnedTopicsCount / totalTopicsEncountered) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-blue-600">
              {totalTopicsEncountered > 0
                ? Math.round((learnedTopicsCount / totalTopicsEncountered) * 100)
                : 0}
              %
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {learnedTopicsCount} learned {openTopics > 0 && `• ${openTopics} open`}
          </p>
        </div>

        {/* Open Subtopics to Learn */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Subtopic Progress</span>
            <span className="font-medium text-cyan-600">
              {learnedSubtopicsCount}/{totalSubtopicsEncountered}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
              <div
                className="h-full bg-cyan-500"
                style={{
                  width: `${totalSubtopicsEncountered > 0 ? (learnedSubtopicsCount / totalSubtopicsEncountered) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-cyan-600">
              {totalSubtopicsEncountered > 0
                ? Math.round((learnedSubtopicsCount / totalSubtopicsEncountered) * 100)
                : 0}
              %
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {learnedSubtopicsCount} learned {openSubtopics > 0 && `• ${openSubtopics} open`}
          </p>
        </div>

        {/* Persistent EXP from Learned Topics */}
        <div className="pt-2 border-t border-border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Total EXP (persistent)
            </span>
            <span className="text-lg font-bold text-green-600">{persistentExp}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {learnedTopicsCount + learnedSubtopicsCount > 0
              ? `${learnedTopicsCount} main topics + ${learnedSubtopicsCount} subtopics learned `
              : 'Mark topics as learned to collect EXP'}
          </p>
        </div>
      </div>
    </div>
  );
}
