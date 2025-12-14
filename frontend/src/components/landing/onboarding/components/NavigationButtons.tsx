import { Button } from '../../../../ui/button';
import { ArrowRight, ArrowLeft, Check, Save } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  onSave?: () => void;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onComplete,
  onSave,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t dark:border-gray-700">
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onPrev} disabled={currentStep === 1} className="gap-2">
          <ArrowLeft className="size-4" />
          back
        </Button>
        {onSave && (
          <Button variant="outline" onClick={onSave} className="gap-2" title="Save preferences">
            <Save className="size-4" />
            save
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
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
