import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Zap } from 'lucide-react';

interface PomodoroTemplate {
  name: string;
  description: string;
  sessions: number;
  sessionDuration: number; // in minutes
  breakDuration: number; // in minutes
  totalMinutes: number;
}

interface PomodoroTemplatesWidgetProps {
  onSelectTemplate: (totalMinutes: number) => void;
  isDisabled?: boolean;
}

export function PomodoroTemplatesWidget({
  onSelectTemplate,
  isDisabled,
}: PomodoroTemplatesWidgetProps) {
  const templates: PomodoroTemplate[] = [
    {
      name: 'Quick Focus',
      description: '1 session to get into the zone',
      sessions: 1,
      sessionDuration: 25,
      breakDuration: 5,
      totalMinutes: 30, // 25 + 5
    },
    {
      name: 'Deep Work',
      description: '3 sessions with power breaks',
      sessions: 3,
      sessionDuration: 25,
      breakDuration: 5,
      totalMinutes: 90, // (25 * 3) + (5 * 2)
    },
    {
      name: 'Marathon Session',
      description: '5 intense sessions, fully committed',
      sessions: 5,
      sessionDuration: 25,
      breakDuration: 5,
      totalMinutes: 145, // (25 * 5) + (5 * 4)
    },
  ];

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Pomodoro Templates</h3>
      </div>

      <div className="space-y-3">
        {templates.map((template, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all"
            onClick={() => onSelectTemplate(template.totalMinutes)}
            disabled={isDisabled}
          >
            <div className="w-full flex items-center justify-between">
              <div className="font-semibold text-foreground">{template.name}</div>
              <div className="text-sm font-mono font-bold text-primary">
                {template.totalMinutes}m
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-left">{template.description}</div>
            <div className="text-xs text-muted-foreground/70 text-left">
              {template.sessions}× {template.sessionDuration}m sessions + {template.breakDuration}m
              breaks
            </div>
          </Button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 p-3 bg-background/50 rounded border border-border">
        💡 Select a template to auto-set your learning time goal. Start your timer after selecting!
      </p>
    </Card>
  );
}
