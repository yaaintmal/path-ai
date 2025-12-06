import { Archive, ChevronLeft } from 'lucide-react';
import { useBookmarks } from '../../contexts/useBookmarks';
import { useLearning } from '../../contexts/useLearning';

interface CompletedTopicsPageProps {
  onBack: () => void;
  onStartTopic?: (title: string) => void;
}

export function CompletedTopicsPage({ onBack, onStartTopic }: CompletedTopicsPageProps) {
  const { learnedTopics } = useBookmarks();
  const { setCurrentLearningPath, triggerSubtopicGeneration } = useLearning();

  const completedTopics = (learnedTopics || []).filter((t) => t.type === 'topic');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Back to learning"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Completed topics</h2>
        </div>
      </div>

      <div className="space-y-2">
        {completedTopics.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No completed topics found.</p>
        ) : (
          completedTopics.map((ct, idx) => (
            <div
              key={`${ct.type}-${ct.title}-${idx}`}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Archive className="w-4 h-4 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white truncate">{ct.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Learned</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setCurrentLearningPath({ title: ct.title, type: 'topic' });
                    if (onStartTopic) onStartTopic(ct.title);
                    triggerSubtopicGeneration({ title: ct.title, type: 'topic' });
                  }}
                  className="px-3 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  Revisit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
