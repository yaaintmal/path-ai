import { ChevronRight, Bookmark, BookmarkCheck, CheckCircle } from 'lucide-react';
import type { StartingPoint } from './learn.types';
import { FormattedText } from './FormattedText';

interface StartingPointsListProps {
  points: StartingPoint[];
  selectedPoint: string | null;
  isLoadingSubtopics: boolean;
  isBookmarked: (title: string) => boolean;
  isLearned: (title: string) => boolean;
  onSelect: (point: string) => void;
  onToggleBookmark: (title: string, type: 'topic' | 'subtopic') => void;
  onMarkLearned: (title: string, type: 'topic' | 'subtopic') => void;
}

export function StartingPointsList({
  points,
  selectedPoint,
  isLoadingSubtopics,
  isBookmarked,
  isLearned,
  onSelect,
  onToggleBookmark,
  onMarkLearned,
}: StartingPointsListProps) {
  if (points.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3">choose a starting point:</h3>
      <div className="space-y-2">
        {points.map((point) => (
          <div key={point.id} className="flex items-center gap-2">
            <button
              onClick={() => onSelect(point.title)}
              disabled={isLoadingSubtopics}
              className={`flex-1 text-left p-3 rounded-lg border transition-all ${
                selectedPoint === point.title
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-500'
                  : 'bg-card-foreground/5 dark:bg-card-foreground/30 border-border hover:border-purple-500 dark:hover:border-purple-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm">
                  <FormattedText text={point.title} />
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => onMarkLearned(point.title, 'topic')}
                className={`p-2 rounded-lg transition-colors ${
                  isLearned(point.title)
                    ? 'text-green-500 cursor-default'
                    : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-muted-foreground hover:text-green-500'
                }`}
                title={isLearned(point.title) ? 'Bereits gelernt' : 'Als gelernt markieren'}
              >
                <CheckCircle
                  className={`w-5 h-5 ${isLearned(point.title) ? 'fill-current' : ''}`}
                />
              </button>
              <button
                onClick={() => onToggleBookmark(point.title, 'topic')}
                disabled={isLearned(point.title)}
                className={`p-2 rounded-lg transition-colors ${
                  isLearned(point.title)
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                }`}
                title={
                  isLearned(point.title)
                    ? 'Bereits gelernt'
                    : isBookmarked(point.title)
                      ? 'Aus Lesezeichen entfernen'
                      : 'Zu Lesezeichen hinzufügen'
                }
              >
                {isBookmarked(point.title) ? (
                  <BookmarkCheck className="w-5 h-5 text-yellow-500 fill-current" />
                ) : (
                  <Bookmark className="w-5 h-5 text-muted-foreground hover:text-yellow-500" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
