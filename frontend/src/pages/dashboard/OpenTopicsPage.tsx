import { Bookmark, ChevronLeft, Target, Sparkles, X, FileText } from 'lucide-react';
import { useBookmarks } from '../../contexts/useBookmarks';
import { useLearning } from '../../contexts/useLearning';

interface OpenTopicsPageProps {
  onBack: () => void;
  onStartTopic?: (title: string) => void;
}

export function OpenTopicsPage({ onBack, onStartTopic }: OpenTopicsPageProps) {
  const { bookmarks, removeBookmark } = useBookmarks();
  const { currentLearningPath, setCurrentLearningPath, triggerSubtopicGeneration } = useLearning();

  const openTopics = (bookmarks || []).filter((b) => b.type === 'topic');
    const openSubtopics = (bookmarks || []).filter((b) => b.type === 'subtopic');

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
      {/* Grid with main topics and subtopics widgets - single source of Open topics/subtopics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main topics widget */}
          <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Open topics</h2>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {openTopics.length === 0 ? (
                <p className="text-muted-foreground">No open topics found.</p>
              ) : (
                openTopics.map((tb, idx) => (
                  <div
                    key={`${tb.type}-${tb.title}-${idx}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-card-foreground/5 dark:bg-card-foreground/30 border border-border group"
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
                    <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => triggerSubtopicGeneration({ title: tb.title, type: 'topic' })}
                        className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500 transition-colors"
                        title="generate subtopics"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentLearningPath({ title: tb.title, type: 'topic' });
                          if (onStartTopic) onStartTopic(tb.title);
                        }}
                        className={`p-1 rounded transition-colors ${
                          currentLearningPath?.title === tb.title
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'text-gray-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                        }`}
                        title="start topic"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeBookmark(tb.title)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                        title="remove bookmark"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subtopics widget */}
          <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Open subtopics</h2>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {openSubtopics.length === 0 ? (
                <p className="text-muted-foreground">No open subtopics found.</p>
              ) : (
                openSubtopics.map((tb, idx) => (
                  <div
                    key={`${tb.type}-${tb.title}-${idx}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-card-foreground/5 dark:bg-card-foreground/30 border border-border group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-orange-600 dark:text-orange-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{tb.title}</p>
                        <p className="text-xs text-muted-foreground">Subtopic</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => triggerSubtopicGeneration({ title: tb.title, type: 'subtopic' })}
                        className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500 transition-colors"
                        title="generate subtopics"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentLearningPath({ title: tb.title, type: 'subtopic' });
                          if (onStartTopic) onStartTopic(tb.title);
                        }}
                        className={`p-1 rounded transition-colors ${
                          currentLearningPath?.title === tb.title
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'text-gray-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                        }`}
                        title="start subtopic"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeBookmark(tb.title)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                        title="remove bookmark"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
