import { motion } from 'framer-motion';
import { BookOpen, CheckCircle } from 'lucide-react';
// import { Youtube, BookOpen, CheckCircle } from 'lucide-react';
import { useBookmarks } from '../../contexts/useBookmarks';
import { CompactStreakWidget } from '../../pages/dashboard/CompactStreakWidget';
// Streak card uses a simple clickable card on the selection screen (compact variant) and links to statistics

interface DashboardSelectionProps {
  onSelect: (mode: 'learning' | 'statistics') => void;
}

export function DashboardSelection({ onSelect }: DashboardSelectionProps) {
  const { learnedTopics, bookmarks } = useBookmarks();

  // Get last 5 bookmarks sorted by addition date (most recent first)
  // const lastFiveBookmarks = bookmarks
  //   .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  //   .slice(0, 5);

  // Get last 3 bookmarks sorted by addition date (most recent first)
  const lastThreeBookmarks = bookmarks
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 3);

  // Get last 2 learned topics sorted by completion date (most recent first)
  const lastTwoLearnedTopics = learnedTopics
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 2);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-300 via-red-500  to-purple-600 bg-clip-text text-transparent mb-4">
            Continue your learning journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose an activity or customize your dashboard
          </p>
        </div>

        {/* // Main selection buttons grid */}
        <div className="grid md:grid-cols-1 gap-8 mb-12">
          {/* Studio AI selection removed */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('learning')}
            className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:border-purple-500 transition-colors group text-left"
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Continue Learning</h2>
            <p className="text-muted-foreground">
              Generate a learning path based on your knowledge and interests.
            </p>
          </motion.button>
        </div>

        {/* Last 3 bookmarks widget - above main buttons */}
        {lastThreeBookmarks.length > 0 && (
          <div className="mb-12 bg-card p-4 rounded-2xl shadow-lg border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">last 3 bookmarks</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {lastThreeBookmarks.map((bookmark) => (
                <div
                  key={`${bookmark.type}-${bookmark.title}`}
                  className="bg-card-foreground/5 dark:bg-card-foreground/30 p-2 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-xs text-foreground truncate flex-1">
                      {bookmark.title}
                    </h3>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                        bookmark.type === 'topic'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                      }`}
                    >
                      {bookmark.type === 'topic' ? 'Thema' : 'Sub'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom widgets grid - 1/3 and 2/3 split */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {/* Streak widget - 1/3 width: show the actual StreakWidget and pass navigation handler */}
          {/* Compact Streak widget - 1/3 width: show compact stats and link to statistics */}
          <div className="h-full">
            <CompactStreakWidget onStatisticsClick={() => onSelect('statistics')} />
          </div>

          {/* Last 2 learned learnpaths widget - 2/3 width */}
          {lastTwoLearnedTopics.length > 0 && (
            <div className="md:col-span-2 bg-card p-4 rounded-2xl shadow-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Lastly completed learning paths
                </h2>
              </div>
              <div className="space-y-2 overflow-y-auto">
                {lastTwoLearnedTopics.map((topic) => (
                  <div
                    key={`${topic.type}-${topic.title}`}
                    className="bg-gradient-to-br from-green-50 dark:from-green-900/20 to-green-100 dark:to-green-900/10 p-2 rounded-lg border border-green-200 dark:border-green-900/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs text-foreground truncate">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{topic.score} Points earned</p>
                      </div>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                          topic.type === 'topic'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        }`}
                      >
                        {topic.type === 'topic' ? 'Thema' : 'Sub'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
