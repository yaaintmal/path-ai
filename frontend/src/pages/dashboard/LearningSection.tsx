import { LearnWidget } from '../../components/dashboard/widgets/learn';
import { ProgressWidget } from './ProgressWidget';
import { SavedThemesWidget } from '../../components/dashboard/widgets/SavedThemesWidget';
// import { ImportedByVideoStudioWidget } from './ImportedByVideoStudioWidget';
import { NextLessonWidget } from './NextLessonWidget';
// import { StreakWidget } from './StreakWidget';
import { CompactStreakWidget } from './CompactStreakWidget';
// import { EnhancedStreakWidget } from './EnhancedStreakWidget';
import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';

interface LearningSectionProps {
  onStatisticsClick?: () => void;
  onStoreClick?: () => void;
  onOpenTopicsClick?: () => void;
  onCompletedTopicsClick?: () => void;
  onTemplatesClick?: () => void;
  onBack?: () => void;
}

export function LearningSection({
  onStatisticsClick,
  onStoreClick,
  onOpenTopicsClick,
  onCompletedTopicsClick,
  onTemplatesClick,
  onBack,
}: LearningSectionProps) {
  return (
    <>
      {onBack && (
        <div className="mb-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 gap-2 hover:bg-transparent hover:text-primary"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('[LearningSection] Back to overview clicked');
              onBack();
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to overview
          </Button>
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
                fill="currentColor"
              />
            </svg>
            Learn Mode
          </span>
        </div>
      )}
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
