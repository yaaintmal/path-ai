import { Sparkles, Target, CheckCircle, X } from 'lucide-react';
import { useBookmarks } from '../../contexts/useBookmarks';
import { useLearning } from '../../contexts/useLearning';

export function BookmarkActions({
  bookmark,
  showIconsOnly,
}: {
  bookmark: { title: string; type: 'topic' | 'subtopic'; addedAt?: string };
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

export function BookmarksWidget({ max = 3 }: { max?: number }) {
  const { bookmarks } = useBookmarks();

  const last = bookmarks
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, max);

  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-3">last {max} bookmarks</h2>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {last.map((bookmark, index) => (
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
  );
}
