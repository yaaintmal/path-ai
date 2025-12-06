import { Bookmark, ChevronLeft } from 'lucide-react';
import { useBookmarks } from '../../contexts/useBookmarks';
import { useLearning } from '../../contexts/useLearning';

interface OpenTopicsPageProps {
  onBack: () => void;
  onStartTopic?: (title: string) => void;
}

export function OpenTopicsPage({ onBack, onStartTopic }: OpenTopicsPageProps) {
  const { bookmarks, removeBookmark } = useBookmarks();
  const { setCurrentLearningPath } = useLearning();

  const openTopics = (bookmarks || []).filter((b) => b.type === 'topic');

  return (
    <div className="min-h-screen bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded hover:bg-card-foreground/5 dark:hover:bg-card-foreground/30 transition-colors"
            title="Back to learning"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Open topics</h2>
        </div>
      </div>
      <div className="space-y-2">
        {openTopics.length === 0 ? (
          <p className="text-muted-foreground">No open topics found.</p>
        ) : (
          openTopics.map((tb, idx) => (
            <div
              key={`${tb.type}-${tb.title}-${idx}`}
              className="flex items-center justify-between p-2 rounded-lg bg-card-foreground/5 dark:bg-card-foreground/30 border border-border"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{tb.title}</p>
                  <p className="text-xs text-muted-foreground">Bookmark</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setCurrentLearningPath({ title: tb.title, type: 'topic' });
                    if (onStartTopic) onStartTopic(tb.title);
                  }}
                  className="px-3 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={() => removeBookmark(tb.title)}
                  className="px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
