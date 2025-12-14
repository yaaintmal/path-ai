import { useState, useEffect, useCallback } from 'react';
import { useBookmarks } from '../../../../contexts/useBookmarks';
import { useLearning } from '../../../../contexts/useLearning';
import { LLM_MODEL, PROMPTS, getPreferredLanguage } from './learn.constants';
import { parseStartingPointsResponse, parseSubtopicsResponse } from './learn.utils';
import { config } from '../../../../config/app.config';
import { generate as generateWithLLM } from './llmAdapter';
import type { SubTopic, StartingPoint } from './learn.types';

export function useLearnWidget() {
  const [learntopic, setLearntopic] = useState('');
  const [startingPoints, setStartingPoints] = useState<StartingPoint[]>([]);
  const [selectedStartingPoint, setSelectedStartingPoint] = useState<string | null>(null);
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [isLoadingStarting, setIsLoadingStarting] = useState(false);
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addBookmark, removeBookmark, isBookmarked, markAsLearned, isLearned } = useBookmarks();
  const { pendingSubtopicGeneration, clearPendingSubtopicGeneration } = useLearning();

  // Generate subtopics directly for a given topic (used when clicking from SavedThemesWidget)
  const generateSubtopicsForTopic = useCallback(async (topicTitle: string) => {
    setLearntopic(topicTitle);
    setSelectedStartingPoint(topicTitle);
    setIsLoadingSubtopics(true);
    setError(null);
    setSubtopics([]);
    setStartingPoints([]); // Clear starting points since we're going directly to subtopics

    try {
      const prompt = PROMPTS.subtopics(topicTitle, topicTitle, getPreferredLanguage());
      const data = await generateWithLLM(prompt, LLM_MODEL);
      setSubtopics(parseSubtopicsResponse(data.response, config.llm.useGoogleGemini));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subtopics';
      setError(message);
      console.error('Error fetching subtopics for saved topic:', err);
    } finally {
      setIsLoadingSubtopics(false);
    }
  }, []);

  // Listen for pending subtopic generation from SavedThemesWidget
  useEffect(() => {
    if (pendingSubtopicGeneration) {
      generateSubtopicsForTopic(pendingSubtopicGeneration.title);
      clearPendingSubtopicGeneration();
    }
  }, [pendingSubtopicGeneration, generateSubtopicsForTopic, clearPendingSubtopicGeneration]);

  const fetchStartingPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learntopic.trim()) return;

    setIsLoadingStarting(true);
    setError(null);
    setStartingPoints([]);
    setSelectedStartingPoint(null);
    setSubtopics([]);

    try {
      const prompt = PROMPTS.startingPoints(learntopic, getPreferredLanguage());
      const data = await generateWithLLM(prompt, LLM_MODEL);
      setStartingPoints(parseStartingPointsResponse(data.response, config.llm.useGoogleGemini));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch starting points';
      setError(message);
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
      const prompt = PROMPTS.subtopics(startingPoint, learntopic, getPreferredLanguage());
      const data = await generateWithLLM(prompt, LLM_MODEL);
      setSubtopics(parseSubtopicsResponse(data.response, config.llm.useGoogleGemini));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subtopics';
      setError(message);
      console.error('Error fetching subtopics:', err);
    } finally {
      setIsLoadingSubtopics(false);
    }
  };

  const toggleBookmark = (title: string, type: 'topic' | 'subtopic') => {
    if (isLearned(title)) return;
    if (isBookmarked(title)) {
      removeBookmark(title);
    } else {
      addBookmark(title, type);
    }
  };

  const markLearned = (title: string, type: 'topic' | 'subtopic') => {
    if (isLearned(title)) return;
    const score = type === 'topic' ? 100 : 30;
    markAsLearned(title, type, score);
  };

  return {
    // State
    learntopic,
    startingPoints,
    selectedStartingPoint,
    subtopics,
    isLoadingStarting,
    isLoadingSubtopics,
    error,
    // Setters
    setLearntopic,
    // Handlers
    fetchStartingPoints,
    fetchSubtopics,
    toggleBookmark,
    markLearned,
    // Context methods
    isBookmarked,
    isLearned,
  };
}
