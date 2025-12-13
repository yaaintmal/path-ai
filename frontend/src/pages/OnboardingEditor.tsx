import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { getApiUrl } from '../config/app.config';
import { PageHeader } from '../components/landing/onboarding/components/Headers';
import { ProgressBar } from '../components/landing/onboarding/components/ProgressBar';
import { NavigationButtons } from '../components/landing/onboarding/components/NavigationButtons';
import { SummaryDialog } from '../components/landing/onboarding/components/SummaryDialog';
import { Step1Role } from '../components/landing/onboarding/steps/Step1Role';
import { Step2Goals } from '../components/landing/onboarding/steps/Step2Goals';
import { Step3Skills } from '../components/landing/onboarding/steps/Step3Skills';
import { Step4LearningType } from '../components/landing/onboarding/steps/Step4LearningType';
import { Step5Time } from '../components/landing/onboarding/steps/Step5Time';
import { Step6Gamification } from '../components/landing/onboarding/steps/Step6Gamification';
import { Step7Communication } from '../components/landing/onboarding/steps/Step7Communication';
import stepsConfig from '../components/landing/onboarding/config/steps.json';
import type { OnboardingData } from '../components/landing/onboarding/types';
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

interface OnboardingEditorProps {
  setShowOnboardingEditor: (show: boolean) => void;
  setHasOnboardingData: (has: boolean) => void;
  setShowDashboard?: (show: boolean) => void;
}

export function OnboardingEditor({
  setShowOnboardingEditor,
  setHasOnboardingData,
  setShowDashboard,
}: OnboardingEditorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing data from user in localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.onboardingData) {
          const loadedData = user.onboardingData;
          // Migration for skillLevels if it's an object (old format)
          if (loadedData.skillLevels && !Array.isArray(loadedData.skillLevels)) {
            loadedData.skillLevels = Object.entries(loadedData.skillLevels).map(
              ([subject, level]) => ({ subject, level: Number(level) })
            );
          }
          setData(loadedData);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

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

    const token = localStorage.getItem('authToken');
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

        if (response.ok) {
          const responseData = await response.json();
          localStorage.setItem('user', JSON.stringify(responseData.user));
          setHasOnboardingData(true);
        } else {
          const errorText = await response.text();
          console.error(
            `Failed to save to backend: ${response.status} ${response.statusText}`,
            errorText
          );
          toast.error(`Failed to save: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error saving to backend', error);
        toast.error('Error saving to backend');
      }
    }

    setConfirmOpen(false);
    toast.success('Changes saved!');
    setTimeout(() => {
      setShowOnboardingEditor(false);
      if (setShowDashboard) {
        setShowDashboard(true);
      }
      window.scrollTo(0, 0);
    }, 1500);
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <PageHeader
          subtitle="adjust dashboard"
          title="now"
          highlight="update"
          description="Check your settings and make changes as needed"
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
