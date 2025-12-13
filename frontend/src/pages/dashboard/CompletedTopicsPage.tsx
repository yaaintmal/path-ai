import { Archive, ChevronLeft, Target, Sparkles } from 'lucide-react';
import { useBookmarks } from '../../contexts/useBookmarks';
import { useLearning } from '../../contexts/useLearning';

interface CompletedTopicsPageProps {
  onBack: () => void;
  onStartTopic?: (title: string) => void;
}

export function CompletedTopicsPage({ onBack, onStartTopic }: CompletedTopicsPageProps) {
  const { learnedTopics } = useBookmarks();
  const { currentLearningPath, setCurrentLearningPath, triggerSubtopicGeneration } = useLearning();

  const completedTopics = (learnedTopics || []).filter((t) => t.type === 'topic');

  return (
    <div className="min-h-screen bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Back to learning"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">Completed topics</h2>
        </div>
      </div>

      <div className="space-y-2">
        {completedTopics.length === 0 ? (
          <p className="text-muted-foreground">No completed topics found.</p>
        ) : (
          completedTopics.map((ct, idx) => (
            <div
              key={`${ct.type}-${ct.title}-${idx}`}
              className="flex items-center justify-between p-2 rounded-lg bg-card-foreground/5 dark:bg-card-foreground/30 border border-border group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Archive className="w-4 h-4 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{ct.title}</p>
                  <p className="text-xs text-muted-foreground">Learned</p>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    triggerSubtopicGeneration({ title: ct.title, type: 'topic' })
                  }
                  className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500 transition-colors"
                  title="generate subtopics"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentLearningPath({ title: ct.title, type: 'topic' });
                    if (onStartTopic) onStartTopic(ct.title);
                  }}
                  className={`p-1 rounded transition-colors ${
                    currentLearningPath?.title === ct.title
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-gray-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  }`}
                  title="revisit topic"
                >
                  <Target className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
