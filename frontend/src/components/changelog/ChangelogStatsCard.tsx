import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { useEffect, useState } from 'react';
import { fetchChangelog, type ChangelogEntry } from '../../api/changelog';

function topWordsFromTitles(entries: ChangelogEntry[], top = 1) {
  const stopwords = new Set([
    'the',
    'and',
    'to',
    'of',
    'in',
    'for',
    'with',
    'a',
    'an',
    'on',
    'added',
    'updated',
  ]);
  const counts: Record<string, number> = {};
  entries.forEach((e) => {
    const words = (e.title || '')
      .toLowerCase()
      .replace(/[\W_]+/g, ' ')
      .split(/\s+/)
      .filter((w) => w && !stopwords.has(w));
    words.forEach((w) => (counts[w] = (counts[w] || 0) + 1));
  });
  return Object.keys(counts)
    .map((k) => ({ k, v: counts[k] }))
    .sort((a, b) => b.v - a.v)
    .slice(0, top)
    .map((x) => x.k);
}

export function ChangelogStatsCard() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchChangelog()
      .then((res) => {
        if (!mounted) return;
        setEntries(res.entries || []);
      })
      .catch((err) => {
        console.error('Failed to load changelog for stats:', err);
        if (mounted) setError('Could not load stats');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Changelog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Loading stats…</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Changelog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <Card className="hover:border-primary/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Changelog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No changelog entries found.</p>
        </CardContent>
      </Card>
    );
  }

  const totalVersions = entries.length;
  const totalDetails = entries.reduce((acc, e) => acc + (e.details?.length || 0), 0);
  // assume entries sorted newest first
  const newest = entries[0];
  const oldest = entries[entries.length - 1];
  const newestDate = newest.date ? new Date(newest.date) : null;
  const oldestDate = oldest.date ? new Date(oldest.date) : null;
  const daysSpan =
    oldestDate && newestDate
      ? Math.max(1, Math.round((+newestDate - +oldestDate) / (1000 * 60 * 60 * 24)))
      : 0;
  const avgDaysBetween = totalVersions > 1 ? +(daysSpan / (totalVersions - 1)).toFixed(1) : 0;
  const releasesPerMonth =
    daysSpan > 0 ? +(totalVersions / (daysSpan / 30.44)).toFixed(1) : totalVersions;
  const topWord = topWordsFromTitles(entries, 1)[0] || '—';
  const fixes = entries.filter((e) => /fix/i.test(e.title)).length;
  const features = entries.filter((e) => /feature/i.test(e.title)).length;

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Changelog</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Total versions</p>
            <p className="text-lg font-bold">{totalVersions}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total details</p>
            <p className="text-lg font-bold">{totalDetails}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg days between</p>
            <p className="text-lg font-bold">{avgDaysBetween} days</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Releases / month</p>
            <p className="text-lg font-bold">{releasesPerMonth}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-t-border">
          <p className="text-xs text-muted-foreground">Fun facts</p>
          <div className="mt-1 text-sm">
            <div>
              ✨ Most used title word: <strong>{topWord}</strong>
            </div>
            <div>
              🔧 Fixes: <strong>{fixes}</strong> • 🧩 Features: <strong>{features}</strong>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Newest: <strong>{newest.version}</strong>
              {newest.date ? ` (${newest.date})` : ''}
            </div>
            {oldest.date && (
              <div className="text-xs text-muted-foreground">
                Since: <strong>{oldest.date}</strong> ({daysSpan} days)
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
