import { LearnWidget } from '../../components/dashboard/widgets/learn';
import { ProgressWidget } from './ProgressWidget';
import { SavedThemesWidget } from '../../components/dashboard/widgets/SavedThemesWidget';
// import { ImportedByVideoStudioWidget } from './ImportedByVideoStudioWidget';
import { NextLessonWidget } from './NextLessonWidget';
// import { StreakWidget } from './StreakWidget';
import { CompactStreakWidget } from './CompactStreakWidget';
// import { EnhancedStreakWidget } from './EnhancedStreakWidget';

interface LearningSectionProps {
  onStatisticsClick?: () => void;
  onStoreClick?: () => void;
  onOpenTopicsClick?: () => void;
  onCompletedTopicsClick?: () => void;
  onTemplatesClick?: () => void;
}

export function LearningSection({
  onStatisticsClick,
  onStoreClick,
  onOpenTopicsClick,
  onCompletedTopicsClick,
  onTemplatesClick,
}: LearningSectionProps) {
  return (
    <>
      {/* Widget 1 - LearnWidget (full width) */}
      <div className="mb-6">
        <LearnWidget onTemplatesClick={onTemplatesClick} />
      </div>

      {/* Widget 4 - NextLessonWidget and StreakWidget (2/3 and 1/3 grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <NextLessonWidget onOpenTopicsClick={onOpenTopicsClick} />
        </div>

        {/* <StreakWidget /> */}
        <CompactStreakWidget onStatisticsClick={onStatisticsClick} />
        {/* <EnhancedStreakWidget /> */}
      </div>

      {/* Widget 2 - ProgressWidget (1/3) and SavedThemesWidget (2/3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ProgressWidget onStoreClick={onStoreClick} />
        <div className="md:col-span-2">
          <SavedThemesWidget onCompletedTopicsClick={onCompletedTopicsClick} />
        </div>
      </div>

      {/* Widget 3 - ImportedByVideoStudio Widget */}
      {/* <div className="mb-6">
        <ImportedByVideoStudioWidget />
      </div> */}
    </>
  );
}
