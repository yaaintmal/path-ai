import { Badge } from '../../../../ui/badge';
import { Slider } from '../../../../ui/slider';
import { Label } from '../../../../ui/label';
import { StepHeader } from '../components/Headers';
import type { OnboardingData } from '../types';

interface Step3SkillsProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
}

export function Step3Skills({ data, updateData }: Step3SkillsProps) {
  const subjects = data.subjects || ['Mathematik', 'Englisch', 'Informatik'];

  const getLevel = (subject: string) => {
    return data.skillLevels?.find((s) => s.subject === subject)?.level || 3;
  };

  const updateLevel = (subject: string, level: number) => {
    const currentLevels = data.skillLevels || [];
    const existingIndex = currentLevels.findIndex((s) => s.subject === subject);
    let newLevels;
    if (existingIndex >= 0) {
      newLevels = [...currentLevels];
      newLevels[existingIndex] = { subject, level };
    } else {
      newLevels = [...currentLevels, { subject, level }];
    }
    updateData('skillLevels', newLevels);
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Wie schätzt du deine Skills ein?"
        description="Hilf uns, das richtige Level für dich zu finden"
      />

      <div className="space-y-6">
        {subjects.slice(0, 3).map((subject: string) => (
          <div key={subject} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="dark:text-white">{subject}</Label>
              <Badge variant="outline">Level {getLevel(subject)}</Badge>
            </div>
            <Slider
              value={[getLevel(subject)]}
              onValueChange={(value) => updateLevel(subject, value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Anfänger</span>
              <span>Fortgeschritten</span>
              <span>Experte</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 Basierend auf deinen Angaben empfehlen wir passende Lernmaterialien und passen die
          Schwierigkeit automatisch an.
        </p>
      </div>
    </div>
  );
}
