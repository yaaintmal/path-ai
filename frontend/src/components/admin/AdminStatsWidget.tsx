import { useEffect, useState } from 'react';

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
        // Try to fetch /api/admin/stats if available; otherwise show placeholders
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('stats not available');
        const data = await res.json();
        if (!mounted) return;
        setStats({
          userCount: data.userCount,
          recentErrors: data.recentErrors,
          activeSessions: data.activeSessions,
        });
      } catch (err) {
        // Not fatal - show fallback placeholders
        if (!mounted) return;
        setError('Stats unavailable');
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
