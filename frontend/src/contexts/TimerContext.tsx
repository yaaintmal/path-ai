import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getApiUrl } from '../config/app.config';
import { toast } from 'sonner';

interface TimerContextType {
  isActive: boolean;
  startTime: Date | null;
  elapsedTime: number; // in seconds
  currentGoal: string | null;
  timeGoal: number | null; // in seconds
  startTimer: (goal: string, timeGoal?: number, learningPath?: string) => Promise<void>;
  stopTimer: () => Promise<void>;
  isLoading: boolean;
  setTimeGoal: (seconds: number | null) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export { TimerContext };

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentGoal, setCurrentGoal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeGoal, setTimeGoal] = useState<number | null>(null);

  // Fetch active session on mount/auth
  useEffect(() => {
    const fetchActiveSession = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(getApiUrl('/api/timer/active'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.session) {
            setIsActive(true);
            const start = new Date(data.session.startTime);
            setStartTime(start);
            setCurrentGoal(data.session.goal);
            const now = new Date();
            setElapsedTime(Math.floor((now.getTime() - start.getTime()) / 1000));
          }
        }
      } catch (error) {
        console.error('Failed to fetch active session', error);
      }
    };

    if (isAuthenticated) {
      fetchActiveSession();
    } else {
      setIsActive(false);
      setStartTime(null);
      setElapsedTime(0);
      setCurrentGoal(null);
    }
  }, [isAuthenticated]);

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  const startTimer = useCallback(async (goal: string, timeGoal?: number, learningPath?: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/timer/start'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal, learningPath }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsActive(true);
        setStartTime(new Date(data.session.startTime));
        setCurrentGoal(goal);
        setElapsedTime(0);
        if (timeGoal) {
          setTimeGoal(timeGoal);
        }
        toast.success('Learning session started!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to start timer');
      }
    } catch (error) {
      console.error('Error starting timer', error);
      toast.error('Error starting timer');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopTimer = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/timer/stop'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsActive(false);
        setStartTime(null);
        setCurrentGoal(null);
        setElapsedTime(0);
        setTimeGoal(null);
        toast.success('Learning session stopped!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to stop timer');
      }
    } catch (error) {
      console.error('Error stopping timer', error);
      toast.error('Error stopping timer');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TimerContext.Provider
      value={{
        isActive,
        startTime,
        elapsedTime,
        currentGoal,
        timeGoal,
        startTimer,
        stopTimer,
        isLoading,
        setTimeGoal,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
