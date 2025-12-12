import type { ChangelogEntry } from '../../api/changelog';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface Recent3ChangesCardProps {
  entries: ChangelogEntry[];
  isLoading?: boolean;
}

export function Recent3ChangesCard({ entries, isLoading = false }: Recent3ChangesCardProps) {
  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <div className="h-4 bg-muted rounded-md w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-muted rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recent Releases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No releases found</p>
        </CardContent>
      </Card>
    );
  }

  const displayEntries = entries.slice(0, 3);

  return (
    <Card className="col-span-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Recent Releases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayEntries.map((entry, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{entry.title}</p>
                <p className="text-xs text-muted-foreground">{entry.date || 'N/A'}</p>
              </div>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {entry.version}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
