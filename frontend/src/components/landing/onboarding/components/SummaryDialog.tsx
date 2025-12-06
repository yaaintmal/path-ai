import { Button } from '../../../../ui/button';
import type { OnboardingData } from '../types';

interface SummaryDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: Partial<OnboardingData>;
  onSave: () => void;
}

export function SummaryDialog({ open, onOpenChange, data, onSave }: SummaryDialogProps) {
  const summary = [
    `Rolle: ${data.role ?? '-'}`,
    `Ziele: ${data.goals?.length ?? 0}`,
    `Fächer: ${data.subjects?.join(', ') ?? '-'}`,
    `Lerntyp: ${data.learningType?.join(', ') ?? '-'}`,
    `Stunden pro Woche: ${data.weeklyHours ?? 5}`,
    `Bevorzugter Lernrhythmus: ${data.schedule ?? '-'}`,
    `Beste Tageszeiten: ${data.bestTime?.join(', ') ?? '-'}`,
    `Gamification: ${data.gamification ?? '-'}`,
    `Belohnungen: ${data.rewards?.join(', ') ?? '-'}`,
    `Kommunikation: ${data.communicationStyle ?? '-'}`,
  ].join('\n');

  return open ? (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => onOpenChange(false)} />
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 max-w-md w-full z-50 max-h-[80vh] overflow-auto">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Summary of your inputs</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          <pre className="whitespace-pre-wrap">{summary}</pre>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
          >
            save
          </Button>
        </div>
      </div>
    </>
  ) : null;
}
