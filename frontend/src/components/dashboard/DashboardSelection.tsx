import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
// local widget imports moved to separate files
// import { Youtube, BookOpen, CheckCircle } from 'lucide-react';
import { BookmarksWidget } from './BookmarksWidget';
import { CompletedPathsWidget } from './CompletedPathsWidget';
import { CompactStreakWidget } from '../../pages/dashboard/CompactStreakWidget';
import { WhatsNewWidget } from './WhatsNewWidget';
// Streak card uses a simple clickable card on the selection screen (compact variant) and links to statistics

interface DashboardSelectionProps {
  onSelect: (mode: 'learning' | 'statistics') => void;
}

// BookmarkActions extracted to `BookmarksWidget` for reuse

export function DashboardSelection({ onSelect }: DashboardSelectionProps) {
  // Widget components handle their own data and logic; this component focuses on layout
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 via-amber-500  to-yellow-600 bg-clip-text text-transparent mb-4">
            Continue your learning journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose an activity or customize your dashboard
          </p>
        </div>

        {/* // Main selection buttons grid */}
        <div className="grid md:grid-cols-1 gap-8 mb-12">
          {/* Studio AI selection removed */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('learning')}
            className="bg-card p-8 rounded-2xl shadow-lg border border-border hover:border-amber-500 transition-colors group text-left"
          >
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
              <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Continue Learning</h2>
            <p className="text-muted-foreground">
              Generate a learning path based on your knowledge and interests.
            </p>
          </motion.button>
        </div>

        {/* Top widgets row: Last 3 bookmarks and What's New */}
        <div className="mb-12 grid md:grid-cols-3 gap-4">
          {/* Bookmarks take 2/3 on md screens */}
          <div className="md:col-span-2 bg-card p-4 rounded-2xl shadow-lg border border-border">
            <BookmarksWidget max={3} />
          </div>

          {/* What's New widget - 1/3 width */}
          <div className="bg-card p-4 rounded-2xl shadow-lg border border-border">
            <WhatsNewWidget />
          </div>
        </div>

        {/* Bottom widgets grid - 1/3 and 2/3 split */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {/* Streak widget - 1/3 width: show the actual StreakWidget and pass navigation handler */}
          {/* Compact Streak widget - 1/3 width: show compact stats and link to statistics */}
          <div className="h-full">
            <CompactStreakWidget onStatisticsClick={() => onSelect('statistics')} />
          </div>

          {/* Completed learning paths widget */}
          <CompletedPathsWidget onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}

// WhatsNewWidget moved to its own module for easier maintenance
