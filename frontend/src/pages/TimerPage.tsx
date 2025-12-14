import { useState, useEffect } from 'react';
import { useTimer } from '../contexts/useTimer';
import { useAuth } from '../contexts/useAuth';
import { useLearning } from '../contexts/useLearning';
import { PageHeader } from '../components/landing/onboarding/components/Headers';
import { TimerWidget } from '../components/timer/TimerWidget';
import { CurrentPathWidget } from '../components/timer/CurrentPathWidget';
import { RecentSessionsWidget } from '../components/timer/RecentSessionsWidget';
import { SessionHistoryWidget } from '../components/timer/SessionHistoryWidget';
import { PomodoroTemplatesWidget } from '../components/timer/PomodoroTemplatesWidget';
import { getApiUrl } from '../config/app.config';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface Session {
  _id: string;
  duration: number;
  goal: string;
  learningPath?: string;
  startTime: string;
  endTime?: string;
}

interface TimerPageProps {
  onBack?: () => void;
}

export function TimerPage({ onBack }: TimerPageProps) {
  const { isActive, setTimeGoal } = useTimer();
  const { userDetails } = useAuth();
  const { currentLearningPath } = useLearning();
  const [history, setHistory] = useState<Session[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const handlePomodoroTemplate = (totalMinutes: number) => {
    setTimeGoal(totalMinutes * 60); // Convert minutes to seconds
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch(getApiUrl('/api/timer/history?limit=50'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.sessions);
        }
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setHistoryLoading(false);
      }
    };

    // Fetch on mount and when timer stops (isActive becomes false)
    fetchHistory();
  }, [isActive]);

  return (
    <div className="container mx-auto px-4 py-8">
      {onBack && (
        <Button
          variant="ghost"
          className="mb-4 gap-2 pl-0 hover:bg-transparent hover:text-primary"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      )}
      <PageHeader
        subtitle="Focus Mode"
        title="Session"
        highlight="Learning"
        description="Track your learning progress and stay focused on your goals"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Left Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          {currentLearningPath && (
            <CurrentPathWidget title={currentLearningPath.title} type={currentLearningPath.type} />
          )}
          <PomodoroTemplatesWidget
            onSelectTemplate={handlePomodoroTemplate}
            isDisabled={isActive}
          />
          <RecentSessionsWidget sessions={history.slice(0, 3)} isLoading={historyLoading} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <TimerWidget
            goals={userDetails?.onboardingData?.goals}
            subjects={userDetails?.onboardingData?.subjects}
            currentLearningPathTitle={currentLearningPath?.title}
          />

          <SessionHistoryWidget sessions={history} isLoading={historyLoading} />
        </div>
      </div>
    </div>
  );
}
