import { Check } from 'lucide-react';
import { StepHeader } from '../components/Headers';
import type { OnboardingData } from '../types';
import { cn } from '../../../../lib/utils';

const LANGUAGES = [
  { value: 'english', label: 'English', flag: '🇺🇸' },
  { value: 'german', label: 'German', flag: '🇩🇪' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
  { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
  { value: 'korean', label: 'Korean', flag: '🇰🇷' },
  { value: 'russian', label: 'Russian', flag: '🇷🇺' },
  { value: 'hindi', label: 'Hindi', flag: '🇮🇳' },
  { value: 'arabic', label: 'Arabic', flag: '🇸🇦' },
  { value: 'turkish', label: 'Turkish', flag: '🇹🇷' },
  { value: 'dutch', label: 'Dutch', flag: '🇳🇱' },
  { value: 'polish', label: 'Polish', flag: '🇵🇱' },
  { value: 'swedish', label: 'Swedish', flag: '🇸🇪' },
  { value: 'danish', label: 'Danish', flag: '🇩🇰' },
  { value: 'finnish', label: 'Finnish', flag: '🇫🇮' },
  { value: 'norwegian', label: 'Norwegian', flag: '🇳🇴' },
  { value: 'czech', label: 'Czech', flag: '🇨🇿' },
  { value: 'greek', label: 'Greek', flag: '🇬🇷' },
  { value: 'hungarian', label: 'Hungarian', flag: '🇭🇺' },
  { value: 'romanian', label: 'Romanian', flag: '🇷🇴' },
  { value: 'thai', label: 'Thai', flag: '🇹🇭' },
  { value: 'vietnamese', label: 'Vietnamese', flag: '🇻🇳' },
  { value: 'indonesian', label: 'Indonesian', flag: '🇮🇩' },
  { value: 'malay', label: 'Malay', flag: '🇲🇾' },
  { value: 'ukrainian', label: 'Ukrainian', flag: '🇺🇦' },
];

interface StepLanguageProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
}

export function StepLanguage({ data, updateData }: StepLanguageProps) {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Language preferences"
        description="Choose your native language and the language Path AI should use for content"
      />

      <div className="space-y-8">
        <div>
          <label className="text-sm font-medium text-foreground block mb-3">Native language</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={`native-${lang.value}`}
                onClick={() => updateData('nativeLanguage', lang.value)}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg border text-sm transition-all',
                  data.nativeLanguage === lang.value
                    ? 'bg-primary/10 border-primary ring-1 ring-primary'
                    : 'bg-card hover:bg-accent hover:text-accent-foreground border-border'
                )}
                type="button"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.label}</span>
                {data.nativeLanguage === lang.value && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">
              Language preferred for Path AI
            </label>
            <span className="text-xs text-muted-foreground">Used for content generation</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={`pref-${lang.value}`}
                onClick={() => updateData('preferredLanguage', lang.value)}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg border text-sm transition-all',
                  data.preferredLanguage === lang.value
                    ? 'bg-primary/10 border-primary ring-1 ring-primary'
                    : 'bg-card hover:bg-accent hover:text-accent-foreground border-border'
                )}
                type="button"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.label}</span>
                {data.preferredLanguage === lang.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepLanguage;
