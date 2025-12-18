import { useEffect, useState } from 'react';
import { getApiUrl } from '../../config/app.config';

interface Stats {
  userCount?: number;
  recentErrors?: number;
  activeSessions?: number;
}

export function AdminStatsWidget() {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // Try to fetch /api/admin/stats; include credentials so cookies are sent when needed
        const token =
          typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const url = getApiUrl('/api/admin/stats');
        const res = await fetch(url, { credentials: 'include', headers });
        if (!res.ok) {
          let msg = 'Stats not available';
          try {
            const body = await res.json();
            if (body && body.message) msg = body.message;
          } catch {
            if (res.status === 401) msg = 'Unauthorized';
            else if (res.status === 403) msg = 'Forbidden - admin only';
          }
          throw new Error(msg);
        }
        // Parse response safely — if the server returns non-JSON (HTML or proxy error), capture raw text for debugging
        let data:
          | { userCount?: number; recentErrors?: number; activeSessions?: number }
          | undefined;
        try {
          const text = await res.text();
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = JSON.parse(text);
          } else {
            // Try to JSON.parse anyway, but if it fails surface the raw text in the error
            try {
              data = JSON.parse(text);
            } catch {
              throw new Error(
                `Invalid JSON response (content-type: ${contentType}). First 500 chars: ${text.slice(0, 500)}`
              );
            }
          }
        } catch (err) {
          // Re-throw with clearer message
          const msg = err instanceof Error ? err.message : String(err);
          throw new Error(`Failed to parse stats response: ${msg}`);
        }

        if (!mounted) return;
        setStats({
          userCount: data?.userCount,
          recentErrors: data?.recentErrors,
          activeSessions: data?.activeSessions,
        });
      } catch (err) {
        // Not fatal - show fallback placeholders and informative message
        if (!mounted) return;
        const e = err as Error | { message?: string } | undefined;
        const msg = e?.message ?? 'Stats unavailable';
        setError(msg);
        setStats({ userCount: undefined, recentErrors: undefined, activeSessions: undefined });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-4 rounded-lg border border-input bg-card">
      <h3 className="text-lg font-semibold mb-4">System Stats</h3>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading stats…</p>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Users</span>
            <span className="font-medium">{stats.userCount ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Recent Errors</span>
            <span className="font-medium">{stats.recentErrors ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Sessions</span>
            <span className="font-medium">{stats.activeSessions ?? '—'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStatsWidget;
