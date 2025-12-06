import { ThinkingSpinner } from '../../../ui/ThinkingSpinner';
import { useLearnWidget } from './useLearnWidget';
import { LearnHeader } from './LearnHeader';
import { LearnTopicForm } from './LearnTopicForm';
import { StartingPointsList } from './StartingPointsList';
import { SubtopicsList } from './SubtopicsList';

interface LearnWidgetProps {
  onTemplatesClick?: () => void;
}

export function LearnWidget({ onTemplatesClick }: LearnWidgetProps) {
  const {
    learntopic,
    setLearntopic,
    startingPoints,
    selectedStartingPoint,
    subtopics,
    isLoadingStarting,
    isLoadingSubtopics,
    error,
    fetchStartingPoints,
    fetchSubtopics,
    toggleBookmark,
    markLearned,
    isBookmarked,
    isLearned,
  } = useLearnWidget();

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
      <LearnHeader onTemplatesClick={onTemplatesClick} />
      <LearnTopicForm
        value={learntopic}
        onChange={setLearntopic}
        onSubmit={fetchStartingPoints}
        isLoading={isLoadingStarting}
        error={error}
      />

      {isLoadingStarting && <ThinkingSpinner />}

      <StartingPointsList
        points={startingPoints}
        selectedPoint={selectedStartingPoint}
        isLoadingSubtopics={isLoadingSubtopics}
        isBookmarked={isBookmarked}
        isLearned={isLearned}
        onSelect={fetchSubtopics}
        onToggleBookmark={toggleBookmark}
        onMarkLearned={markLearned}
      />

      <SubtopicsList
        subtopics={subtopics}
        isBookmarked={isBookmarked}
        isLearned={isLearned}
        onToggleBookmark={toggleBookmark}
        onMarkLearned={markLearned}
      />

      {isLoadingSubtopics && <ThinkingSpinner />}
    </div>
  );
}
