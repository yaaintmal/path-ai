import { Bookmark, X, CheckCircle, Target, Sparkles, Archive } from 'lucide-react';
import IconButton from '../../ui/IconButton';
import { useBookmarks } from '../../../contexts/useBookmarks';
import { useLearning } from '../../../contexts/useLearning';
import { FormattedText } from './learn/FormattedText';

interface SavedThemesWidgetProps {
  onCompletedTopicsClick?: () => void;
}

export function SavedThemesWidget({ onCompletedTopicsClick }: SavedThemesWidgetProps) {
  const { bookmarks, removeBookmark, markAsLearned } = useBookmarks();
  const { currentLearningPath, setCurrentLearningPath, triggerSubtopicGeneration } = useLearning();

  const validBookmarks =
    bookmarks && bookmarks.length > 0
      ? bookmarks.filter((bookmark) => {
          return bookmark && bookmark.title && bookmark.type;
        })
      : [];

  const isCurrentPath = (title: string) => currentLearningPath?.title === title;

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">saved topics</h2>
        <div className="flex items-center gap-3">
          <IconButton
            onClick={() => onCompletedTopicsClick && onCompletedTopicsClick()}
            ariaLabel="Completed topics"
            title="Completed topics"
            className="bg-gradient-to-br from-yellow-500 to-orange-500 hover:shadow-lg"
          >
            <Archive className="w-6 h-6 text-white" />
          </IconButton>
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {validBookmarks && validBookmarks.length > 0 ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="space-y-2 overflow-y-auto flex-1">
            {validBookmarks.map((bookmark, index) => (
              <div
                key={`${bookmark.type}-${bookmark.title}-${index}`}
                className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group ${
                  isCurrentPath(bookmark.title)
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      bookmark.type === 'topic' ? 'bg-yellow-500' : 'bg-orange-400'
                    }`}
                  ></div>
                  <span
                    className="text-sm text-gray-800 dark:text-gray-200 truncate"
                    title={bookmark.title}
                  >
                    <FormattedText text={bookmark.title} />
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      bookmark.type === 'topic'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    }`}
                  >
                    {bookmark.type === 'topic' ? 'main topic' : 'subtopic'}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() =>
                      triggerSubtopicGeneration({
                        title: bookmark.title,
                        type: bookmark.type || 'topic',
                      })
                    }
                    className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500 transition-colors"
                    title="generate subtopics"
                    aria-label={`Generate subtopics for ${bookmark.title}`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentLearningPath({
                        title: bookmark.title,
                        type: bookmark.type || 'topic',
                      })
                    }
                    className={`p-1 rounded transition-colors ${
                      isCurrentPath(bookmark.title)
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                        : 'text-gray-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                    }`}
                    title="mark as current learning path"
                    aria-label={`Set ${bookmark.title} as current learning path`}
                  >
                    <Target className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      markAsLearned(
                        bookmark.title,
                        bookmark.type || 'topic',
                        (bookmark.type || 'topic') === 'topic' ? 100 : 30
                      )
                    }
                    className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-400 hover:text-green-500 transition-colors"
                    title="mark as learned"
                    aria-label={`Mark ${bookmark.title} as learned`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.title)}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                    title="remove bookmark"
                    aria-label={`Remove ${bookmark.title} from bookmarks`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-6">
          no saved topics yet.
        </p>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        total: {bookmarks?.length || 0} topics
      </p>
    </div>
  );
}
