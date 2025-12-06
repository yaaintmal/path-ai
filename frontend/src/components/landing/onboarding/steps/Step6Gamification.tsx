import { RadioGroup, RadioGroupItem } from '../../../../ui/radio-group';
import { Label } from '../../../../ui/label';
import { Checkbox } from '../../../../ui/checkbox';
import { StepHeader } from '../components/Headers';
import learningConfig from '../config/learning-config.json';
import type { OnboardingData } from '../types';

interface Step6GamificationProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
  toggleArrayItem: (field: keyof OnboardingData, item: string) => void;
}

export function Step6Gamification({ data, updateData, toggleArrayItem }: Step6GamificationProps) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Gamification-Einstellungen"
        description="Wie motivierend soll dein Lernerlebnis sein?"
      />

      <div className="space-y-3">
        <Label className="dark:text-white">Gamification-Level</Label>
        <RadioGroup
          value={data.gamification || ''}
          onValueChange={(value) => updateData('gamification', value)}
        >
          {learningConfig.gamificationLevels.map((level) => (
            <div
              key={level.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.gamification === level.id
                  ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={level.id} id={`gamification-${level.id}`} />
                <span className="text-2xl">{level.icon}</span>
                <Label htmlFor={`gamification-${level.id}`} className="cursor-pointer flex-1">
                  <div className="font-medium dark:text-white">{level.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {level.description}
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {data.gamification !== 'none' && (
        <div className="space-y-3">
          <Label className="dark:text-white">Welche Belohnungen motivieren dich?</Label>
          <div className="grid md:grid-cols-2 gap-3">
            {learningConfig.rewardTypes
              .filter((r) => r.id !== 'none' || data.gamification === 'light')
              .map((reward) => (
                <div
                  key={reward.id}
                  onClick={() => toggleArrayItem('rewards', reward.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    data.rewards?.includes(reward.id)
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div className="flex-1">
                      <Checkbox checked={data.rewards?.includes(reward.id) || false} />
                      <span className="ml-3 dark:text-white">{reward.label}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
