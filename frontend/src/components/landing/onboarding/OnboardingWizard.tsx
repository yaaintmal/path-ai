import { useState, useEffect } from 'react';
import { Card } from '../../../ui/card';
import { toast } from 'sonner';
import { getApiUrl } from '../../../config/app.config';
import { PageHeader } from './components/Headers';
import { ProgressBar } from './components/ProgressBar';
import { NavigationButtons } from './components/NavigationButtons';
import { SummaryDialog } from './components/SummaryDialog';
import { Step1Role } from './steps/Step1Role';
import { Step2Goals } from './steps/Step2Goals';
import { Step3Skills } from './steps/Step3Skills';
import { Step4LearningType } from './steps/Step4LearningType';
import { Step5Time } from './steps/Step5Time';
import { Step6Gamification } from './steps/Step6Gamification';
import { Step7Communication } from './steps/Step7Communication';
import stepsConfig from './config/steps.json';
import type { OnboardingData } from './types';
import {
  GraduationCap,
  BookOpen,
  Target,
  Brain,
  Clock,
  Gamepad2,
  MessageSquare,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType> = {
  GraduationCap,
  Target,
  Brain,
  BookOpen,
  Clock,
  Gamepad2,
  MessageSquare,
};

const defaultData: Partial<OnboardingData> = {
  role: '',
  level: '',
  goals: [],
  subjects: [],
  skillLevels: [],
  learningType: [],
  weeklyHours: 5,
  schedule: '',
  bestTime: [],
  gamification: '',
  rewards: [],
  communicationStyle: '',
};

function getInitialData(): Partial<OnboardingData> {
  if (typeof window === 'undefined') return defaultData;

  const savedData = localStorage.getItem('onboarddata');
  if (savedData) {
    try {
      return JSON.parse(savedData) as Partial<OnboardingData>;
    } catch {
      console.error('Failed to parse localStorage data');
      return defaultData;
    }
  }
  return defaultData;
}

export function OnboardingWizard({
  setHasOnboardingData,
}: {
  setHasOnboardingData?: (has: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>(getInitialData());
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Show notification if data was loaded from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('onboarddata');
    const hasData = Object.values(data).some((value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length > 0;
      }
      return value !== '' && value !== 5;
    });

    if (savedData && hasData) {
      toast.info('Your data was loaded from storage.');
    }
  }, [data]);

  const nextStep = () => {
    if (currentStep < stepsConfig.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: keyof OnboardingData, value: unknown) => {
    setData({ ...data, [field]: value });
  };

  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    const currentArray = (data[field] as string[]) || [];
    if (currentArray.includes(item)) {
      updateData(
        field,
        currentArray.filter((i) => i !== item)
      );
    } else {
      updateData(field, [...currentArray, item]);
    }
  };

  const handleComplete = () => {
    setConfirmOpen(true);
  };

  const handleSave = async () => {
    localStorage.setItem('onboarddata', JSON.stringify(data));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(getApiUrl('/api/users/onboarding'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ onboardingData: data }),
        });

        if (!response.ok) {
          console.error('Failed to save to backend');
        } else {
          const responseData = await response.json();
          localStorage.setItem('user', JSON.stringify(responseData.user));
          if (setHasOnboardingData) {
            setHasOnboardingData(true);
          }
        }
      } catch (error) {
        console.error('Error saving to backend', error);
      }
    }

    setConfirmOpen(false);
    toast.success('Thanks 🤗 Your answers have been saved. Redirecting to home...');
    setTimeout(() => {
      window.location.href = '/';
    }, 1200);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <PageHeader
          subtitle="Personal Setup"
          title="erstellen"
          highlight="perfektes Dashboard"
          description="Beantworte ein paar Fragen und wir passen alles an deine Bedürfnisse an"
        />

        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={stepsConfig.length}
          steps={stepsConfig}
          iconMap={iconMap}
        />

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 dark:bg-gray-800 dark:border-gray-700">
            {/* Step Components */}
            {currentStep === 1 && <Step1Role data={data} updateData={updateData} />}
            {currentStep === 2 && (
              <Step2Goals data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />
            )}
            {currentStep === 3 && <Step3Skills data={data} updateData={updateData} />}
            {currentStep === 4 && (
              <Step4LearningType data={data} toggleArrayItem={toggleArrayItem} />
            )}
            {currentStep === 5 && (
              <Step5Time data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />
            )}
            {currentStep === 6 && (
              <Step6Gamification
                data={data}
                updateData={updateData}
                toggleArrayItem={toggleArrayItem}
              />
            )}
            {currentStep === 7 && <Step7Communication data={data} updateData={updateData} />}

            {/* Navigation */}
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={stepsConfig.length}
              onPrev={prevStep}
              onNext={nextStep}
              onComplete={handleComplete}
            />
          </Card>
          <SummaryDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            data={data}
            onSave={handleSave}
          />
        </div>
      </div>
    </section>
  );
}
