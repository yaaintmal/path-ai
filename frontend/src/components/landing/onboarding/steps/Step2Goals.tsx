import { Checkbox } from '../../../../ui/checkbox';
import { StepHeader } from '../components/Headers';
import rolesData from '../config/roles-and-goals.json';
import type { OnboardingData } from '../types';

interface Step2GoalsProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
  toggleArrayItem: (field: keyof OnboardingData, item: string) => void;
}

export function Step2Goals({ data, updateData, toggleArrayItem }: Step2GoalsProps) {
  const getGoals = () => {
    if (data.role === 'pupil') return rolesData.pupilGoals;
    if (data.role === 'student') return rolesData.studentGoals;
    return rolesData.teacherGoals;
  };

  const goals = getGoals();

  return (
    <div className="space-y-6">
      <StepHeader
        title="Was sind deine Ziele?"
        description="Wähle alles aus, was auf dich zutrifft (mehrere möglich)"
      />

      <div className="grid md:grid-cols-2 gap-3">
        {goals.map((goal) => (
          <div
            key={goal}
            onClick={() => toggleArrayItem('goals', goal)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.goals?.includes(goal)
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={data.goals?.includes(goal) || false} />
              <span className="dark:text-white">{goal}</span>
            </div>
          </div>
        ))}
      </div>

      {(data.role === 'pupil' || data.role === 'student') && (
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium dark:text-white">
            {rolesData.subjectsLabel[data.role as keyof typeof rolesData.subjectsLabel]}
          </label>
          <input
            type="text"
            placeholder={rolesData.subjectsPlaceholder}
            value={data.subjects?.join(', ') || ''}
            onChange={(e) =>
              updateData(
                'subjects',
                e.target.value.split(',').map((s: string) => s.trim())
              )
            }
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}
