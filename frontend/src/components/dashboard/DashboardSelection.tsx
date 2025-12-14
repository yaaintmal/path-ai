import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Sparkles, Target, X, Archive } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchRecentChangelog, type ChangelogEntry } from '../../api/changelog';
import { useAuth } from '../../contexts/useAuth';
// import { Youtube, BookOpen, CheckCircle } from 'lucide-react';
import { useBookmarks } from '../../contexts/useBookmarks';
// Using an inline small type for bookmark items in this component
import { useLearning } from '../../contexts/useLearning';
import { CompactStreakWidget } from '../../pages/dashboard/CompactStreakWidget';
// Streak card uses a simple clickable card on the selection screen (compact variant) and links to statistics

interface DashboardSelectionProps {
  onSelect: (mode: 'learning' | 'statistics') => void;
}

function BookmarkActions({
  bookmark,
  showIconsOnly,
}: {
  bookmark: { title: string; type: 'topic' | 'subtopic' };
  showIconsOnly?: boolean;
}) {
  const { removeBookmark, markAsLearned } = useBookmarks();
  const { triggerSubtopicGeneration, setCurrentLearningPath, currentLearningPath } = useLearning();

  const isCurrent = currentLearningPath?.title === bookmark.title;
  const bType = (bookmark.type ?? 'topic') as 'topic' | 'subtopic';

  if (showIconsOnly) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => triggerSubtopicGeneration({ title: bookmark.title, type: bType })}
          className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500 transition-colors"
          title="generate subtopics"
        >
          <Sparkles className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrentLearningPath({ title: bookmark.title, type: bType })}
          className={`p-1 rounded transition-colors ${
            isCurrent
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              : 'text-gray-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
          }`}
          title="mark as current learning path"
        >
          <Target className="w-4 h-4" />
        </button>
        <button
          onClick={() => markAsLearned(bookmark.title, bType, bType === 'topic' ? 100 : 30)}
          className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-400 hover:text-green-500 transition-colors"
          title="mark as learned"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
        <button
          onClick={() => removeBookmark(bookmark.title)}
          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
          title="remove bookmark"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <button
        onClick={() => triggerSubtopicGeneration({ title: bookmark.title, type: bType })}
        className="px-2 py-1 rounded-md hover:bg-card-foreground/5 dark:hover:bg-card-foreground/30 transition-colors flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-gray-500" />
        <span>subtopics</span>
      </button>
      <button
        onClick={() => setCurrentLearningPath({ title: bookmark.title, type: bType })}
        className={`px-2 py-1 rounded-md transition-colors flex items-center gap-2 ${
          isCurrent
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            : 'text-gray-500 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
        }`}
      >
        <Target className="w-4 h-4" />
        <span>{isCurrent ? 'current' : 'open'}</span>
      </button>
      <button
        onClick={() => markAsLearned(bookmark.title, bType, bType === 'topic' ? 100 : 30)}
        className="px-2 py-1 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center gap-2 text-gray-500"
      >
        <CheckCircle className="w-4 h-4" />
        <span>learned</span>
      </button>
      <button
        onClick={() => removeBookmark(bookmark.title)}
        className="px-2 py-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2 text-gray-500"
      >
        <X className="w-4 h-4" />
        <span>remove</span>
      </button>
    </div>
  );
}

export function DashboardSelection({ onSelect }: DashboardSelectionProps) {
  const { learnedTopics, bookmarks } = useBookmarks();
  const { triggerSubtopicGeneration, setCurrentLearningPath, currentLearningPath } = useLearning();

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 via-amber-500  to-yellow-600 bg-clip-text text-transparent mb-4">
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
            className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:border-amber-500 transition-colors group text-left"
          >
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
              <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Continue Learning</h2>
            <p className="text-muted-foreground">
              Generate a learning path based on your knowledge and interests.
            </p>
          </motion.button>
        </div>

        {/* Top widgets row: Last 3 bookmarks and What's New */}
        <div className="mb-12 grid md:grid-cols-3 gap-4">
          {/* Bookmarks take 2/3 on md screens */}
          <div className="md:col-span-2 bg-card p-4 rounded-2xl shadow-lg border border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">last 3 bookmarks</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {lastThreeBookmarks.map((bookmark, index) => (
                <div
                  key={`${bookmark.type}-${bookmark.title}-${index}`}
                  className={`bg-card-foreground/5 dark:bg-card-foreground/30 p-2 rounded-lg group`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                            bookmark.type === 'topic'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          }`}
                        >
                          {bookmark.type === 'topic' ? 'Thema' : 'Sub'}
                        </span>
                        <h3 className="font-semibold text-xs text-foreground truncate flex-1 min-w-0">
                          {bookmark.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookmarkActions bookmark={bookmark} showIconsOnly />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's New widget - 1/3 width */}
          <div className="bg-card p-4 rounded-2xl shadow-lg border border-border">
            <WhatsNewWidget />
          </div>
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
            <div className="md:col-span-2 bg-card p-4 rounded-2xl shadow-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Lastly completed learning paths
                </h2>
              </div>
              <div className="space-y-2 overflow-y-auto">
                {lastTwoLearnedTopics.map((topic) => (
                  <div
                    key={`${topic.type}-${topic.title}`}
                    className="group bg-gradient-to-br from-green-50 dark:from-green-900/20 to-green-100 dark:to-green-900/10 p-2 rounded-lg border border-green-200 dark:border-green-900/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                              topic.type === 'topic'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                            }`}
                          >
                            {topic.type === 'topic' ? 'Thema' : 'Sub'}
                          </span>
                          <h3 className="font-semibold text-xs text-foreground truncate flex-1 min-w-0">
                            {topic.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{topic.score} Points earned</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            triggerSubtopicGeneration({ title: topic.title, type: 'topic' })
                          }
                          className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500 transition-colors"
                          title="generate subtopics"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentLearningPath({ title: topic.title, type: 'topic' });
                            // navigate to learning view so the topic reacts immediately
                            onSelect('learning');
                            triggerSubtopicGeneration({ title: topic.title, type: 'topic' });
                          }}
                          className={`p-1 rounded transition-colors ${
                            currentLearningPath?.title === topic.title
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                              : 'text-gray-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                          }`}
                          title="revisit topic"
                        >
                          <Target className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            try {
                              const ev = new CustomEvent('showCompletedTopics');
                              window.dispatchEvent(ev);
                            } catch {
                              window.dispatchEvent(new Event('showCompletedTopics'));
                            }
                          }}
                          className="p-1 rounded hover:bg-card-foreground/5 dark:hover:bg-card-foreground/30 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View all completed topics"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
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

function WhatsNewWidget() {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchRecentChangelog(3);
        if (mounted && res?.entries) setEntries(res.entries);
      } catch (err) {
        console.error('Failed to load recent changelog:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (isAuthenticated) load();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">what's new</h2>
        <button
          className="text-xs text-muted-foreground hover:underline"
          onClick={() => {
            try {
              const ev = new CustomEvent('showChangelog');
              window.dispatchEvent(ev);
            } catch {
              window.dispatchEvent(new Event('showChangelog'));
            }
          }}
          title="View full changelog"
        >
          View all
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : entries.length > 0 ? (
        <ul className="space-y-2">
          {entries.map((e) => (
            <li key={e.version} className="text-sm">
              <button
                onClick={() => {
                  try {
                    const ev = new CustomEvent('showChangelog', { detail: { version: e.version } });
                    window.dispatchEvent(ev);
                  } catch {
                    window.dispatchEvent(new Event('showChangelog'));
                  }
                }}
                className="text-left w-full hover:underline text-foreground"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{e.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">{e.version}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{e.description}</p>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No updates available</p>
      )}
    </div>
  );
}
