import { Progress } from '../../../../ui/progress';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: number; title: string; icon: string }>;
  iconMap: Record<string, React.ComponentType>;
}

export function ProgressBar({ currentStep, totalSteps, steps, iconMap }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const IconComponent = iconMap[step.icon];
          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    currentStep === step.id
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-110'
                      : currentStep > step.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? <Check className="size-5" /> : <IconComponent />}
                </div>
                <span
                  className={`text-xs hidden md:block ${currentStep === step.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                />
              )}
            </div>
          );
        })}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
