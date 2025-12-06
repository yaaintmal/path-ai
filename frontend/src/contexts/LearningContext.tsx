import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { LearningPath } from '../types/learning';

export interface CurrentGoal {
  title: string;
  pathId: string;
  pathTopic: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  setAt?: string;
}

export interface LearningTopic {
  title: string;
  type: 'topic' | 'subtopic';
}

export interface LearningContextType {
  currentGoal: CurrentGoal | null;
  setCurrentGoal: (goal: CurrentGoal | null) => void;
  currentPath: LearningPath | null;
  setCurrentPath: (path: LearningPath | null) => void;
  generateSubtopicsForGoal: (goal: CurrentGoal) => Promise<void>;
  setGenerateSubtopicsForGoal: (fn: (goal: CurrentGoal) => Promise<void>) => void;
  lastSubtopic: { title: string; pathTopic: string } | null;
  setLastSubtopic: (subtopic: { title: string; pathTopic: string } | null) => void;
  currentLearningPath: LearningTopic | null;
  setCurrentLearningPath: (path: LearningTopic | null) => void;
  // Trigger for generating subtopics from saved themes
  pendingSubtopicGeneration: LearningTopic | null;
  triggerSubtopicGeneration: (topic: LearningTopic) => void;
  clearPendingSubtopicGeneration: () => void;
}

export const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [currentGoal, setCurrentGoal] = useState<CurrentGoal | null>(null);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [generateSubtopicsForGoal, setGenerateSubtopicsForGoal] = useState<
    (goal: CurrentGoal) => Promise<void>
  >(async () => {});
  const [lastSubtopic, setLastSubtopic] = useState<{ title: string; pathTopic: string } | null>(
    null
  );
  const [currentLearningPath, setCurrentLearningPathState] = useState<LearningTopic | null>(() => {
    const saved = localStorage.getItem('currentLearningPath');
    return saved ? JSON.parse(saved) : null;
  });
  const [pendingSubtopicGeneration, setPendingSubtopicGeneration] = useState<LearningTopic | null>(
    null
  );

  const handleSetCurrentGoal = useCallback((goal: CurrentGoal | null) => {
    setCurrentGoal(goal);
  }, []);

  const handleSetCurrentPath = useCallback((path: LearningPath | null) => {
    setCurrentPath(path);
  }, []);

  const handleSetLastSubtopic = useCallback(
    (subtopic: { title: string; pathTopic: string } | null) => {
      setLastSubtopic(subtopic);
    },
    []
  );

  const handleSetCurrentLearningPath = useCallback((path: LearningTopic | null) => {
    setCurrentLearningPathState(path);
    if (path) {
      localStorage.setItem('currentLearningPath', JSON.stringify(path));
    } else {
      localStorage.removeItem('currentLearningPath');
    }
  }, []);

  const triggerSubtopicGeneration = useCallback((topic: LearningTopic) => {
    setPendingSubtopicGeneration(topic);
  }, []);

  const clearPendingSubtopicGeneration = useCallback(() => {
    setPendingSubtopicGeneration(null);
  }, []);

  const value = useMemo(
    () => ({
      currentGoal,
      setCurrentGoal: handleSetCurrentGoal,
      currentPath,
      setCurrentPath: handleSetCurrentPath,
      generateSubtopicsForGoal,
      setGenerateSubtopicsForGoal,
      lastSubtopic,
      setLastSubtopic: handleSetLastSubtopic,
      currentLearningPath,
      setCurrentLearningPath: handleSetCurrentLearningPath,
      pendingSubtopicGeneration,
      triggerSubtopicGeneration,
      clearPendingSubtopicGeneration,
    }),
    [
      currentGoal,
      handleSetCurrentGoal,
      currentPath,
      handleSetCurrentPath,
      generateSubtopicsForGoal,
      lastSubtopic,
      handleSetLastSubtopic,
      currentLearningPath,
      handleSetCurrentLearningPath,
      pendingSubtopicGeneration,
      triggerSubtopicGeneration,
      clearPendingSubtopicGeneration,
    ]
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export default LearningContext;
