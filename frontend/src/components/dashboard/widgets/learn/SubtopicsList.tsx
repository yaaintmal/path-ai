import { ChevronRight, Bookmark, BookmarkCheck, CheckCircle } from 'lucide-react';
import type { SubTopic } from './learn.types';
import { DIFFICULTY_LABELS } from './learn.constants';
import { FormattedText } from './FormattedText';

interface SubtopicsListProps {
  subtopics: SubTopic[];
  isBookmarked: (title: string) => boolean;
  isLearned: (title: string) => boolean;
  onToggleBookmark: (title: string, type: 'topic' | 'subtopic') => void;
  onMarkLearned: (title: string, type: 'topic' | 'subtopic') => void;
}

export function SubtopicsList({
  subtopics,
  isBookmarked,
  isLearned,
  onToggleBookmark,
  onMarkLearned,
}: SubtopicsListProps) {
  if (subtopics.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        available subtopics (according difficulty):
      </h3>
      <div className="space-y-2">
        {subtopics.map((subtopic) => (
          <div key={subtopic.id} className="flex items-center gap-2">
            <button className="flex-1 text-left p-3 rounded-lg bg-card-foreground/5 dark:bg-card-foreground/30 border border-border hover:border-blue-500 dark:hover:border-blue-500 hover:bg-card-foreground/10 dark:hover:bg-card-foreground/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">
                    <FormattedText text={subtopic.title} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    difficulty:{' '}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        subtopic.difficulty === 'beginner'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : subtopic.difficulty === 'intermediate'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {DIFFICULTY_LABELS[subtopic.difficulty || 'beginner']}
                    </span>
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => onMarkLearned(subtopic.title, 'subtopic')}
                className={`p-2 rounded-lg transition-colors ${
                  isLearned(subtopic.title)
                    ? 'text-green-500 cursor-default'
                    : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-400 hover:text-green-500'
                }`}
                title={isLearned(subtopic.title) ? 'Bereits gelernt' : 'Als gelernt markieren'}
                aria-label={
                  isLearned(subtopic.title)
                    ? `Subtopic ${subtopic.title} already learned`
                    : `Mark subtopic ${subtopic.title} as learned`
                }
              >
                <CheckCircle
                  className={`w-5 h-5 ${isLearned(subtopic.title) ? 'fill-current' : ''}`}
                />
              </button>
              <button
                onClick={() => onToggleBookmark(subtopic.title, 'subtopic')}
                disabled={isLearned(subtopic.title)}
                className={`p-2 rounded-lg transition-colors ${
                  isLearned(subtopic.title)
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                }`}
                title={
                  isLearned(subtopic.title)
                    ? 'Bereits gelernt'
                    : isBookmarked(subtopic.title)
                      ? 'Aus Lesezeichen entfernen'
                      : 'Zu Lesezeichen hinzufügen'
                }
                aria-label={
                  isLearned(subtopic.title)
                    ? `Subtopic ${subtopic.title} already learned`
                    : isBookmarked(subtopic.title)
                      ? `Remove subtopic ${subtopic.title} from bookmarks`
                      : `Add subtopic ${subtopic.title} to bookmarks`
                }
              >
                {isBookmarked(subtopic.title) ? (
                  <BookmarkCheck className="w-5 h-5 text-yellow-500 fill-current" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
