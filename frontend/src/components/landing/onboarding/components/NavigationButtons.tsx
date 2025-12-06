import { Button } from '../../../../ui/button';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onComplete,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t dark:border-gray-700">
      <Button variant="outline" onClick={onPrev} disabled={currentStep === 1} className="gap-2">
        <ArrowLeft className="size-4" />
        back
      </Button>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        step {currentStep} of {totalSteps}
      </div>

      {currentStep < totalSteps ? (
        <Button onClick={onNext} className="gap-2">
          next
          <ArrowRight className="size-4" />
        </Button>
      ) : (
        <Button
          onClick={onComplete}
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
        >
          CREATE dashboard
          <Check className="size-4" />
        </Button>
      )}
    </div>
  );
}
