import { useEffect, useState } from 'react';
import { AlertTriangle, LogIn, Eye, RefreshCw } from 'lucide-react';

interface ErrorEntry {
  timestamp: string;
  type: 'login_failure' | 'error' | 'other';
  message: string;
  count: number;
}

export function ErrorPollerWidget() {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchErrors = async () => {
    try {
      // Parse critical log for recent login failures and errors
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch(`/api/admin/logs?type=critical&date=${today}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch logs');
      const text = await res.text();

      // Parse log lines and extract errors/login failures
      const errorMap = new Map<string, ErrorEntry>();
      const lines = text.split(/\r?\n/).filter(Boolean);

      for (const line of lines) {
        let type: 'login_failure' | 'error' | 'other' = 'other';
        let message = line;

        // Check for LOGIN:FAIL pattern (new format)
        if (/\[LOGIN:FAIL\]/.test(line)) {
          type = 'login_failure';
          // Extract user and reason from pattern like: [LOGIN:FAIL] user=xxx reason=yyy
          const userMatch = line.match(/user=([^\s]+)/);
          const reasonMatch = line.match(/reason=([^\s]+)/);
          const user = userMatch ? userMatch[1] : 'unknown';
          const reason = reasonMatch ? reasonMatch[1] : 'unknown';
          message = `${user} (${reason})`;
        }
        // Check for legacy patterns or other errors
        else if (/login.*failed|failed.*login|401|unauthorized/i.test(line)) {
          type = 'login_failure';
          message = 'Login failed';
        } else if (/\[ERROR\]|error|exception/i.test(line)) {
          type = 'error';
          // Extract brief error message
          const match = line.match(/\[(\w+)\]\s+(.*?)(?:\s+\[|$)/);
          message = match ? match[2].trim() : 'Unknown error';
        }

        if (type !== 'other') {
          const key = `${type}-${message}`;
          const existing = errorMap.get(key);
          errorMap.set(key, {
            timestamp: line.split(' ')[0] || new Date().toISOString(),
            type,
            message,
            count: (existing?.count ?? 0) + 1,
          });
        }
      }

      const sorted = Array.from(errorMap.values())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      setErrors(sorted);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch errors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchErrors();
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      void fetchErrors();
    }, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'login_failure':
        return <LogIn className="size-4 text-destructive" />;
      case 'error':
        return <AlertTriangle className="size-4 text-amber-500" />;
      default:
        return <Eye className="size-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-4 rounded-lg border border-input bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Error Monitor</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void fetchErrors()}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Refresh errors"
            aria-label="Refresh error log"
          >
            <RefreshCw className="size-4" />
          </button>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span>Auto (30s)</span>
          </label>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : errors.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent errors</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded bg-muted/50 text-sm">
              <div className="flex-shrink-0 mt-0.5">{getIcon(err.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">{err.message}</div>
                <div className="text-xs text-muted-foreground">
                  {err.timestamp} {err.count > 1 && `(×${err.count})`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdate}</div>
    </div>
  );
}

export default ErrorPollerWidget;
