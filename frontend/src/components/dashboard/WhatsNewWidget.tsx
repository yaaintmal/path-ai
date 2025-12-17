import { useEffect, useState } from 'react';
import { fetchChangelog, type ChangelogEntry } from '../../api/changelog'; // Import fetchChangelog
import { useAuth } from '../../contexts/useAuth';
import IconButton from '../ui/IconButton';
import { BookOpen } from 'lucide-react';
import { dispatchCustomEvent } from '../../utils/events';

export function WhatsNewWidget() {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const allChangelogEntries = await fetchChangelog(); // Fetch all entries
        if (mounted && allChangelogEntries) {
          // Sort by version (assuming version is comparable string like '0.7.8')
          // and then take the first 3
          const sortedEntries = allChangelogEntries.sort((a, b) =>
            b.version.localeCompare(a.version, undefined, { numeric: true, sensitivity: 'base' })
          );
          setEntries(sortedEntries.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load recent changelog:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (isAuthenticated) load();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">what's new</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatchCustomEvent('showChangelog')}
            className="text-xs text-muted-foreground hover:underline"
            title="View full changelog"
          >
            View all
          </button>
          <IconButton
            onClick={() => dispatchCustomEvent('showChangelog')}
            ariaLabel="View full changelog"
            title="View full changelog"
            className="w-8 h-8 p-0 bg-gradient-to-br from-amber-400 to-amber-600 hover:shadow-lg"
          >
            <BookOpen className="w-4 h-4 text-white" />
          </IconButton>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : entries.length > 0 ? (
        <ul className="space-y-2">
          {entries.map((e) => (
            <li key={e.version} className="text-sm">
              <button
                onClick={() => dispatchCustomEvent('showChangelog', { version: e.version })}
                className="text-left w-full hover:underline text-foreground"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{e.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">{e.version}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{e.description}</p>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No updates available</p>
      )}
    </div>
  );
}
