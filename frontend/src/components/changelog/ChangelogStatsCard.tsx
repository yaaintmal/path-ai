import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

export function ChangelogStatsCard() {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Changelog</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">Total Versions</p>
          <p className="text-lg font-bold">9+</p>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">Track all version updates and improvements</p>
      </CardContent>
    </Card>
  );
}
