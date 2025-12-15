import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { fetchChangelog } from '../api/changelog';
import { LastChangelogEntryCard } from '../components/changelog/LastChangelogEntryCard';
import { VersionChangeCard } from '../components/changelog/VersionChangeCard';
import { Recent3ChangesCard } from '../components/changelog/Recent3ChangesCard';
import { ChangelogStatsCard } from '../components/changelog/ChangelogStatsCard';
import type { ChangelogEntry } from '../api/changelog';

interface ChangelogPageProps {
  onBack?: () => void;
}

export function ChangelogPage({ onBack }: ChangelogPageProps) {
  const [allEntries, setAllEntries] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChangelog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchChangelog();
        if (result.success && result.entries) {
          setAllEntries(result.entries);
        } else {
          setError('Failed to load changelog');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load changelog');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChangelog();
  }, []);

  const latestEntry = allEntries[0] || null;
  const recentEntries = allEntries.slice(1, 4);

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      {/* Header */}
      <PageHeader
        title="Changelog"
        subtitle="Track all updates, features, and improvements"
        onBack={onBack}
      />

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
          <p className="text-sm font-medium">Error loading changelog</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6">
        {/* Large main widget */}
        <LastChangelogEntryCard entry={latestEntry} isLoading={isLoading} />

        {/* Smaller widgets row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <VersionChangeCard entry={latestEntry} isLoading={isLoading} />
          <Recent3ChangesCard entries={recentEntries} isLoading={isLoading} />
          <ChangelogStatsCard />
        </div>

        {/* All Versions List */}
        {!isLoading && allEntries.length > 0 && (
          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-bold mb-6">All Versions</h2>
            <div className="grid gap-4">
              {allEntries.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-input bg-card hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {entry.title}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          v{entry.version}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
                      {entry.details && entry.details.length > 0 && (
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {entry.details.slice(0, 2).map((detail, didx) => (
                            <li key={didx} className="flex gap-2">
                              <span>•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                          {entry.details.length > 2 && (
                            <li className="text-primary text-xs">
                              +{entry.details.length - 2} more changes
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {entry.date && (
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {entry.date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
