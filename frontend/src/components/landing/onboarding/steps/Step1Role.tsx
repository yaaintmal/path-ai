import { RadioGroup, RadioGroupItem } from '../../../../ui/radio-group';
import { Label } from '../../../../ui/label';
import { StepHeader } from '../components/Headers';
import rolesData from '../config/roles-and-goals.json';
import type { OnboardingData } from '../types';

interface Step1RoleProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
}

export function Step1Role({ data, updateData }: Step1RoleProps) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Welche Rolle hast du?"
        description="Wir passen das Dashboard sofort an deine Rolle an"
      />

      <RadioGroup value={data.role || ''} onValueChange={(value) => updateData('role', value)}>
        <div className="space-y-3">
          {rolesData.roles.map((role) => (
            <div
              key={role.id}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.role === role.id
                  ? `border-${role.color}-600 bg-${role.color}-50 dark:bg-${role.color}-900/20`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <RadioGroupItem value={role.id} id={role.id} />
              <Label htmlFor={role.id} className="flex items-center gap-3 cursor-pointer flex-1">
                <div className={`text-6xl`}>👤</div>
                <div>
                  <div className="font-medium dark:text-white">{role.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{role.description}</div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {data.role && (
        <div className="mt-6 space-y-4">
          <Label className="dark:text-white">
            {rolesData.roles.find((r) => r.id === data.role)?.levelLabel}
          </Label>
          <input
            type="text"
            placeholder={rolesData.roles.find((r) => r.id === data.role)?.levelPlaceholder}
            value={data.level || ''}
            onChange={(e) => updateData('level', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}
