import { RadioGroup, RadioGroupItem } from '../../../../ui/radio-group';
import { Label } from '../../../../ui/label';
import { Sparkles } from 'lucide-react';
import { StepHeader } from '../components/Headers';
import learningConfig from '../config/learning-config.json';
import type { OnboardingData } from '../types';

interface Step7CommunicationProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
}

export function Step7Communication({ data, updateData }: Step7CommunicationProps) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Wie soll dein Assistent mit dir sprechen?"
        description="Wähle den Kommunikationsstil, der am besten zu dir passt"
      />

      <RadioGroup
        value={data.communicationStyle || ''}
        onValueChange={(value) => updateData('communicationStyle', value)}
      >
        {learningConfig.communicationStyles.map((style) => (
          <div
            key={style.id}
            className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
              data.communicationStyle === style.id
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <RadioGroupItem value={style.id} id={`communication-${style.id}`} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={`communication-${style.id}`} className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{style.icon}</span>
                    <span className="font-medium dark:text-white">{style.label}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {style.example}
                  </div>
                </Label>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <Sparkles className="size-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-900 dark:text-purple-200">
            <strong>Fast fertig!</strong> Basierend auf deinen Antworten erstellen wir jetzt dein
            perfekt personalisiertes Dashboard mit individuellen Lernplänen und Empfehlungen.
          </div>
        </div>
      </div>
    </div>
  );
}
