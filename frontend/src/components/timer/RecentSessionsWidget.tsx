import { Card } from '../../ui/card';
import { Clock } from 'lucide-react';

interface Session {
  _id: string;
  duration: number;
  goal: string;
  learningPath?: string;
  startTime: string;
}

interface RecentSessionsWidgetProps {
  sessions: Session[];
  isLoading: boolean;
}

export function RecentSessionsWidget({ sessions, isLoading }: RecentSessionsWidgetProps) {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return `${m} min`;
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm uppercase tracking-wider">Recent Sessions</h3>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent sessions</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{session.goal}</span>
                {session.learningPath && (
                  <span className="text-xs text-muted-foreground">{session.learningPath}</span>
                )}
              </div>
              <span className="font-mono text-primary">{formatDuration(session.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
