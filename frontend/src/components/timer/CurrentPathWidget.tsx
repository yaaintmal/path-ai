import { Card } from '../../ui/card';
import { Target } from 'lucide-react';

interface CurrentPathWidgetProps {
  title: string;
  type: string;
}

export function CurrentPathWidget({ title, type }: CurrentPathWidgetProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 h-fit">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">Current Learning Path</h3>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-primary">{title}</p>
          <p className="text-xs text-muted-foreground uppercase">{type}</p>
        </div>
      </div>
    </Card>
  );
}
