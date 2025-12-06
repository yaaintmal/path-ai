import { useLearning } from '../../contexts/useLearning';
import { Target as Darts } from 'lucide-react';

interface NextLessonWidgetProps {
  onOpenTopicsClick?: () => void;
}

export function NextLessonWidget({ onOpenTopicsClick }: NextLessonWidgetProps) {
  const { currentLearningPath, triggerSubtopicGeneration } = useLearning();

  if (!currentLearningPath) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-visible h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">next lesson</h2>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Darts className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400 text-center py-6">
            choose one of your saved learning paths to start the lesson
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow overflow-visible h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">next lesson</h2>
        <div
          onClick={() => onOpenTopicsClick && onOpenTopicsClick()}
          className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center cursor-pointer"
          title="Open topics"
        >
          <Darts className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">actual learning path</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentLearningPath.title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {currentLearningPath.type === 'topic' ? 'main topic' : 'subtopic'}
          </p>
        </div>
        <button
          onClick={() =>
            triggerSubtopicGeneration({
              title: currentLearningPath.title,
              type: currentLearningPath.type || 'topic',
            })
          }
          className="w-full py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium"
        >
          start lesson
        </button>
      </div>
    </div>
  );
}
