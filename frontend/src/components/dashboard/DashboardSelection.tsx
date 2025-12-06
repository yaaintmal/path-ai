import { motion } from 'framer-motion';
import { Youtube, BookOpen, CheckCircle } from 'lucide-react';
import { useBookmarks } from '../../contexts/useBookmarks';
import { CompactStreakWidget } from '../../pages/dashboard/CompactStreakWidget';
// Streak card uses a simple clickable card on the selection screen (compact variant) and links to statistics

interface DashboardSelectionProps {
  onSelect: (mode: 'video-translation' | 'learning' | 'statistics') => void;
}

export function DashboardSelection({ onSelect }: DashboardSelectionProps) {
  const { learnedTopics, bookmarks } = useBookmarks();

  // Get last 5 bookmarks sorted by addition date (most recent first)
  const lastFiveBookmarks = bookmarks
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);

  // Get last 2 learned topics sorted by completion date (most recent first)
  const lastTwoLearnedTopics = learnedTopics
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 2);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-300 via-red-500  to-purple-600 bg-clip-text text-transparent mb-4">
            What you wanna do today?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose an activity or customize your dashboard
          </p>
        </div>

        {/* Last 5 bookmarks widget - above main buttons */}
        {lastFiveBookmarks.length > 0 && (
          <div className="mb-12 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              last 5 bookmarks
            </h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {lastFiveBookmarks.map((bookmark) => (
                <div
                  key={`${bookmark.type}-${bookmark.title}`}
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-xs text-gray-900 dark:text-white truncate flex-1">
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

        <div className="grid md:grid-cols-2 gap-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('video-translation')}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group text-left"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
              <Youtube className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Studio AI</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Transcribe and translate videos and integrate them into your learning path.
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('learning')}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors group text-left"
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Path AI</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Generate a learning path based on your knowledge and interests.
            </p>
          </motion.button>
        </div>

        {/* Bottom widgets grid - 1/3 and 2/3 split */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {/* Streak widget - 1/3 width: show the actual StreakWidget and pass navigation handler */}
          {/* Compact Streak widget - 1/3 width: show compact stats and link to statistics */}
          <div className="h-full">
            <CompactStreakWidget onStatisticsClick={() => onSelect('statistics')} />
          </div>

          {/* Last 2 learned learnpaths widget - 2/3 width */}
          {lastTwoLearnedTopics.length > 0 && (
            <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-green-200 dark:border-green-900/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
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
                        <h3 className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {topic.score} Points earned
                        </p>
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
