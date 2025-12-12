import type { ChangelogEntry } from '../../api/changelog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface LastChangelogEntryCardProps {
  entry: ChangelogEntry | null;
  isLoading?: boolean;
}

export function LastChangelogEntryCard({ entry, isLoading = false }: LastChangelogEntryCardProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <div className="h-8 bg-muted rounded-md w-32 mb-2" />
          <div className="h-4 bg-muted rounded-md w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-md" />
            <div className="h-4 bg-muted rounded-md w-5/6" />
            <div className="h-4 bg-muted rounded-md w-4/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!entry) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>No Changelog Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load changelog entries.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full bg-gradient-to-br from-background to-muted/50 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3">
              Latest Release
            </Badge>
            <CardTitle className="text-2xl">{entry.title}</CardTitle>
            <CardDescription className="mt-2">{entry.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{entry.version}</div>
            {entry.date && <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>}
          </div>
        </div>
      </CardHeader>
      {entry.details && entry.details.length > 0 && (
        <CardContent>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">What's New:</h4>
            <ul className="space-y-2">
              {entry.details.map((detail, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
