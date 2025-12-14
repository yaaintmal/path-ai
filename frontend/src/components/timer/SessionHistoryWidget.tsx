import { Card } from '../../ui/card';
import { History } from 'lucide-react';

interface Session {
  _id: string;
  duration: number;
  goal: string;
  learningPath?: string;
  startTime: string;
  endTime?: string;
}

interface SessionHistoryWidgetProps {
  sessions: Session[];
  isLoading: boolean;
}

export function SessionHistoryWidget({ sessions, isLoading }: SessionHistoryWidgetProps) {
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
    );
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm uppercase tracking-wider">Session History</h3>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No history available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-2 rounded-l-lg">Date</th>
                <th className="px-4 py-2">Goal</th>
                <th className="px-4 py-2">Path</th>
                <th className="px-4 py-2 rounded-r-lg">Duration</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session._id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs">{formatDate(session.startTime)}</td>
                  <td className="px-4 py-3 font-medium">{session.goal}</td>
                  <td className="px-4 py-3 text-muted-foreground">{session.learningPath || '-'}</td>
                  <td className="px-4 py-3 font-mono text-primary">
                    {formatDuration(session.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
