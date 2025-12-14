import { Archive, CheckCircle, Sparkles, Target } from 'lucide-react';
import { useLearning } from '../../contexts/useLearning';
import { useBookmarks } from '../../contexts/useBookmarks';

export function CompletedPathsWidget({
  onSelect,
}: {
  onSelect: (mode: 'learning' | 'statistics') => void;
}) {
  const { learnedTopics } = useBookmarks();
  const { triggerSubtopicGeneration, setCurrentLearningPath, currentLearningPath } = useLearning();

  const lastTwoLearnedTopics = learnedTopics
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 2);

  if (lastTwoLearnedTopics.length === 0) return null;

  return (
    <div className="md:col-span-2 bg-card p-4 rounded-2xl shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Lastly completed learning paths</h2>
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
                  onClick={() => triggerSubtopicGeneration({ title: topic.title, type: 'topic' })}
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
  );
}
