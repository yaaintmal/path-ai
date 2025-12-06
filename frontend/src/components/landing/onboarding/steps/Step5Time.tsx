import { RadioGroup, RadioGroupItem } from '../../../../ui/radio-group';
import { Label } from '../../../../ui/label';
import { Badge } from '../../../../ui/badge';
import { Slider } from '../../../../ui/slider';
import { StepHeader } from '../components/Headers';
import learningConfig from '../config/learning-config.json';
import type { OnboardingData } from '../types';

interface Step5TimeProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
  toggleArrayItem: (field: keyof OnboardingData, item: string) => void;
}

export function Step5Time({ data, updateData, toggleArrayItem }: Step5TimeProps) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Wann kannst du lernen?"
        description="Hilf uns, deinen perfekten Lernplan zu erstellen"
      />

      <div className="space-y-4">
        <Label className="dark:text-white">Wie viele Stunden pro Woche?</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[data.weeklyHours || 5]}
            onValueChange={(value) => updateData('weeklyHours', value[0])}
            max={40}
            min={1}
            step={1}
            className="flex-1"
          />
          <Badge className="bg-blue-600 text-white border-0 px-4">{data.weeklyHours || 5}h</Badge>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="dark:text-white">Bevorzugter Lernrhythmus</Label>
        <RadioGroup
          value={data.schedule || ''}
          onValueChange={(value) => updateData('schedule', value)}
        >
          {learningConfig.scheduleTypes.map((type) => (
            <div
              key={type.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.schedule === type.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={type.id} id={`schedule-${type.id}`} />
                <Label htmlFor={`schedule-${type.id}`} className="cursor-pointer flex-1">
                  <div className="font-medium dark:text-white">{type.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{type.description}</div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="dark:text-white">Beste Tageszeiten für dich</Label>
        <div className="grid grid-cols-3 gap-2">
          {learningConfig.timeSlots.map((slot) => (
            <div
              key={slot}
              onClick={() => toggleArrayItem('bestTime', slot)}
              className={`p-3 text-center rounded-lg border-2 cursor-pointer transition-all ${
                data.bestTime?.includes(slot)
                  ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="text-sm dark:text-white">{slot}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
