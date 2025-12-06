import { StreakWidget } from './StreakWidget';
import { NextLessonWidget } from './NextLessonWidget';

export function CommonWidgetsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Widget 1 - Nächste Lektion */}
      <div className="md:col-span-2">
        <NextLessonWidget />
      </div>

      {/* Widget 2 - Streak */}
      <StreakWidget />
    </div>
  );
}
