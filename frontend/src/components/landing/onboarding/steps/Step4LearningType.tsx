import { Checkbox } from '../../../../ui/checkbox';
import { StepHeader } from '../components/Headers';
import learningConfig from '../config/learning-config.json';
import type { OnboardingData } from '../types';

interface Step4LearningTypeProps {
  data: Partial<OnboardingData>;
  toggleArrayItem: (field: keyof OnboardingData, item: string) => void;
}

export function Step4LearningType({ data, toggleArrayItem }: Step4LearningTypeProps) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Wie lernst du am liebsten?"
        description="Wähle deine bevorzugten Lernmethoden (mehrere möglich)"
      />

      <div className="grid md:grid-cols-2 gap-3">
        {learningConfig.learningTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => toggleArrayItem('learningType', type.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.learningType?.includes(type.id)
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{type.icon}</span>
              <div className="flex-1">
                <Checkbox checked={data.learningType?.includes(type.id) || false} />
                <span className="ml-3 dark:text-white">{type.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <p className="text-sm text-purple-900 dark:text-purple-200">
          🎯 Wir erstellen deinen Lernplan basierend auf deinem bevorzugten Lernstil und stellen
          passende Inhalte zusammen.
        </p>
      </div>
    </div>
  );
}
