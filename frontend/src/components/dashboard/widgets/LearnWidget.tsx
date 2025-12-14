import { useState } from 'react';
import { BookOpen, ChevronRight, Bookmark, BookmarkCheck, CheckCircle } from 'lucide-react';
import { ThinkingSpinner } from '../../ui/ThinkingSpinner';
import { config } from '../../../config/app.config';
import { getPreferredLanguage } from './learn/learn.constants';
import { useBookmarks } from '../../../contexts/useBookmarks';

interface SubTopic {
  id: string;
  title: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface StartingPoint {
  id: string;
  title: string;
}

const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL || config.ollama.apiUrl;
const LLM_MODEL = import.meta.env.VITE_OLLAMA_MODEL || config.ollama.model;
// Resolve language at request time via getPreferredLanguage()

export function LearnWidget() {
  const [learntopic, setLearntopic] = useState('');
  const [startingPoints, setStartingPoints] = useState<StartingPoint[]>([]);
  const [selectedStartingPoint, setSelectedStartingPoint] = useState<string | null>(null);
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [isLoadingStarting, setIsLoadingStarting] = useState(false);
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addBookmark, removeBookmark, isBookmarked, markAsLearned, isLearned } = useBookmarks();

  const fetchStartingPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learntopic.trim()) return;

    setIsLoadingStarting(true);
    setError(null);
    setStartingPoints([]);
    setSelectedStartingPoint(null);
    setSubtopics([]);

    try {
      const prompt = `You are a learning assistant. A user wants to learn about "${learntopic}". Generate a numbered list of 3 starting points to help them start their learning journey.
      The starting points should be specific and related to the main topic.
      Format ONLY as numbered list like:
      1. Starting point 1
      2. Starting point 2
      3. Starting point 3
      Answer on ${getPreferredLanguage()}`;

      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: LLM_MODEL,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API failed: ${response.status}`);
      }

      const data = await response.json();
      const lines = data.response
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

      const points = lines.map((title: string, idx: number) => ({
        id: `start-${idx}`,
        title,
      }));

      setStartingPoints(points);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch starting points');
      console.error('Error fetching starting points:', err);
    } finally {
      setIsLoadingStarting(false);
    }
  };

  const fetchSubtopics = async (startingPoint: string) => {
    setSelectedStartingPoint(startingPoint);
    setIsLoadingSubtopics(true);
    setError(null);
    setSubtopics([]);

    try {
      const prompt = `You are a learning assistant. A user selected the subtopic "${startingPoint}" related to learning "${learntopic}". Generate a numbered list of 5 matching subtopics with different difficulty levels.
      Provide 5 subtopics in this exact format (one per line):
      1. [BEGINNER] Subtopic 1
      2. [BEGINNER] Subtopic 2
      3. [INTERMEDIATE] Subtopic 3
      4. [INTERMEDIATE] Subtopic 4
      5. [ADVANCED] Subtopic 5
      
      Make them progressively more complex. Answer on ${getPreferredLanguage()}`;

      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: LLM_MODEL,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API failed: ${response.status}`);
      }

      const data = await response.json();
      const lines = data.response
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

      const topics = lines.map((title: string, idx: number) => {
        let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
        if (title.includes('[ADVANCED]')) {
          difficulty = 'advanced';
          title = title.replace(/\[ADVANCED\]\s*/, '');
        } else if (title.includes('[INTERMEDIATE]')) {
          difficulty = 'intermediate';
          title = title.replace(/\[INTERMEDIATE\]\s*/, '');
        } else {
          title = title.replace(/\[BEGINNER\]\s*/, '');
        }

        return {
          id: `sub-${idx}`,
          title,
          difficulty,
        };
      });

      setSubtopics(topics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subtopics');
      console.error('Error fetching subtopics:', err);
    } finally {
      setIsLoadingSubtopics(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
                fill="currentColor"
              />
            </svg>
            PATH AI
          </span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">learn</h2>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Learning Topic Input */}
      <form onSubmit={fetchStartingPoints} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={learntopic}
            onChange={(e) => setLearntopic(e.target.value)}
            placeholder="Z.B. 'Englisch Grammatik' oder 'Python Programmierung'"
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoadingStarting}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoadingStarting ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}
            {isLoadingStarting ? 'Wird geladen...' : 'Starten'}
          </button>
        </div>
        {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>}
      </form>

      {/* Loading Spinner for Starting Points */}
      {isLoadingStarting && <ThinkingSpinner />}

      {/* Starting Points */}
      {startingPoints.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Wähle einen Startpunkt:
          </h3>
          <div className="space-y-2">
            {startingPoints.map((point) => (
              <div key={point.id} className="flex items-center gap-2">
                <button
                  onClick={() => fetchSubtopics(point.title)}
                  disabled={isLoadingSubtopics}
                  className={`flex-1 text-left p-3 rounded-lg border transition-all ${
                    selectedStartingPoint === point.title
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-500'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white text-sm">{point.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLearned(point.title)) return; // Already learned
                      markAsLearned(point.title, 'topic', 100);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isLearned(point.title)
                        ? 'text-green-500 cursor-default'
                        : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-400 hover:text-green-500'
                    }`}
                    title={isLearned(point.title) ? 'Bereits gelernt' : 'Als gelernt markieren'}
                    aria-label={
                      isLearned(point.title)
                        ? `Topic ${point.title} already learned`
                        : `Mark topic ${point.title} as learned`
                    }
                  >
                    <CheckCircle
                      className={`w-5 h-5 ${isLearned(point.title) ? 'fill-current' : ''}`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLearned(point.title)) return; // Can't bookmark if learned
                      if (isBookmarked(point.title)) {
                        removeBookmark(point.title);
                      } else {
                        addBookmark(point.title, 'topic');
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isLearned(point.title)
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                    }`}
                    disabled={isLearned(point.title)}
                    title={
                      isLearned(point.title)
                        ? 'Bereits gelernt'
                        : isBookmarked(point.title)
                          ? 'Aus Lesezeichen entfernen'
                          : 'Zu Lesezeichen hinzufügen'
                    }
                    aria-label={
                      isLearned(point.title)
                        ? `Topic ${point.title} already learned`
                        : isBookmarked(point.title)
                          ? `Remove topic ${point.title} from bookmarks`
                          : `Add topic ${point.title} to bookmarks`
                    }
                  >
                    {isBookmarked(point.title) ? (
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
      )}

      {/* Subtopics */}
      {subtopics.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Verfügbare Themen (nach Schwierigkeit):
          </h3>
          <div className="space-y-2">
            {subtopics.map((subtopic) => (
              <div key={subtopic.id} className="flex items-center gap-2">
                <button
                  onClick={() => {}}
                  className="flex-1 text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white text-sm font-medium">
                        {subtopic.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Schwierigkeit:{' '}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            subtopic.difficulty === 'beginner'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : subtopic.difficulty === 'intermediate'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {subtopic.difficulty === 'beginner'
                            ? 'Anfänger'
                            : subtopic.difficulty === 'intermediate'
                              ? 'Mittelstufe'
                              : 'Fortgeschritten'}
                        </span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLearned(subtopic.title)) return;
                      markAsLearned(subtopic.title, 'subtopic', 30);
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isLearned(subtopic.title)) return;
                      if (isBookmarked(subtopic.title)) {
                        removeBookmark(subtopic.title);
                      } else {
                        addBookmark(subtopic.title, 'subtopic');
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isLearned(subtopic.title)
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                    }`}
                    disabled={isLearned(subtopic.title)}
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
      )}

      {isLoadingSubtopics && <ThinkingSpinner />}
    </div>
  );
}
