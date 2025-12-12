import type { ChangelogEntry } from '../../api/changelog';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface VersionChangeCardProps {
  entry: ChangelogEntry | null;
  isLoading?: boolean;
}

export function VersionChangeCard({ entry, isLoading = false }: VersionChangeCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="h-4 bg-muted rounded-md w-24" />
        </CardHeader>
        <CardContent>
          <div className="h-6 bg-muted rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (!entry) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Current Version</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Current Version
          <Badge variant="outline" className="text-xs">
            {entry.version}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs font-medium text-foreground line-clamp-2">{entry.title}</p>
        {entry.date && <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>}
      </CardContent>
    </Card>
  );
}
