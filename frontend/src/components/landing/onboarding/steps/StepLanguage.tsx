import { StepHeader } from '../components/Headers';
import type { OnboardingData } from '../types';

interface StepLanguageProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
}

export function StepLanguage({ data, updateData }: StepLanguageProps) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Language preferences"
        description="Choose your native language and the language Path AI should use for content"
      />

      <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900/10 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Native language</label>
            <select
              value={data.nativeLanguage || ''}
              onChange={(e) => updateData('nativeLanguage', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
            >
              <option value="">(not set)</option>
              <option value="english">English</option>
              <option value="german">German</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Language preferred for Path AI
            </label>
            <select
              value={data.preferredLanguage || ''}
              onChange={(e) => updateData('preferredLanguage', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded"
            >
              <option value="">(use browser default)</option>
              <option value="english">English</option>
              <option value="german">German</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="chinese">Chinese</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              This setting will be used for Path AI content generation (LLM language).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepLanguage;
