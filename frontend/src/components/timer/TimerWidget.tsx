import { useState, useEffect } from 'react';
import { useTimer } from '../../contexts/useTimer';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Play, Square } from 'lucide-react';

interface TimerWidgetProps {
  goals?: string[];
  subjects?: string[];
  currentLearningPathTitle?: string;
}

export function TimerWidget({ goals, subjects, currentLearningPathTitle }: TimerWidgetProps) {
  const {
    isActive,
    elapsedTime,
    currentGoal,
    timeGoal,
    startTimer,
    stopTimer,
    isLoading,
    setTimeGoal,
  } = useTimer();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [inputTimeMinutes, setInputTimeMinutes] = useState<string>('');
  const [showTimeGoalInput, setShowTimeGoalInput] = useState(false);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimeGoal = (seconds: number | null) => {
    if (!seconds) return 'Not set';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  // Set default goal
  useEffect(() => {
    if (goals && goals.length > 0 && !selectedGoal) {
      const timer = setTimeout(() => {
        setSelectedGoal(goals[0]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [goals]);

  const handleStart = () => {
    if (selectedGoal) {
      const timeGoalSeconds = inputTimeMinutes ? parseInt(inputTimeMinutes) * 60 : undefined;
      startTimer(selectedGoal, timeGoalSeconds, currentLearningPathTitle);
      setInputTimeMinutes('');
    }
  };

  const handleSetTimeGoal = () => {
    if (inputTimeMinutes && !isActive) {
      const seconds = parseInt(inputTimeMinutes) * 60;
      setTimeGoal(seconds);
      setShowTimeGoalInput(false);
    }
  };

  return (
    <Card className="p-8 flex flex-col items-center gap-8 bg-card/50 backdrop-blur-sm border-primary/20">
      {/* Timer Display */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative text-7xl font-mono font-bold tracking-wider tabular-nums text-foreground">
          {formatTime(elapsedTime)}
        </div>
        {timeGoal && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Goal: {formatTimeGoal(timeGoal)}
          </p>
        )}
      </div>

      {/* Goal Selection / Display */}
      <div className="w-full text-center space-y-2">
        {isActive ? (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Current Goal</p>
            <p className="text-xl font-medium text-primary animate-pulse">{currentGoal}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground uppercase tracking-widest">
              Select Goal
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full p-3 rounded-lg bg-background border border-input text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              disabled={isLoading}
            >
              <option value="" disabled>
                Select a goal...
              </option>
              {goals?.map((goal: string) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
              {subjects?.map((subject: string) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Time Goal Section */}
      {!isActive && (
        <div className="w-full border-t border-border pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground uppercase tracking-widest">
                Learning Time Goal
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTimeGoalInput(!showTimeGoalInput)}
                className="text-xs"
              >
                {showTimeGoalInput ? 'Cancel' : 'Set'}
              </Button>
            </div>
            {showTimeGoalInput ? (
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="480"
                  placeholder="Minutes"
                  value={inputTimeMinutes}
                  onChange={(e) => setInputTimeMinutes(e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-background border border-input text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button size="sm" onClick={handleSetTimeGoal} disabled={!inputTimeMinutes}>
                  Save
                </Button>
              </div>
            ) : (
              <p className="text-sm font-medium">{formatTimeGoal(timeGoal)}</p>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 w-full">
        {!isActive ? (
          <Button
            size="lg"
            className="w-full text-lg h-16 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            onClick={handleStart}
            disabled={!selectedGoal || isLoading}
          >
            <Play className="w-6 h-6 fill-current" />
            Start Session
          </Button>
        ) : (
          <Button
            size="lg"
            variant="destructive"
            className="w-full text-lg h-16 gap-2 shadow-lg shadow-destructive/20 hover:shadow-destructive/40 transition-all"
            onClick={stopTimer}
            disabled={isLoading}
          >
            <Square className="w-6 h-6 fill-current" />
            Stop Session
          </Button>
        )}
      </div>
    </Card>
  );
}
