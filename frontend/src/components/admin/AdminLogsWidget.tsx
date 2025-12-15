import { useState } from 'react';
import { Download } from 'lucide-react';

export function AdminLogsWidget() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<'admin' | 'critical' | null>(null);

  const downloadLogs = async (type: 'admin' | 'critical') => {
    setError(null);
    setLoading(true);
    setLoadingType(type);
    try {
      const url = `/api/admin/logs?type=${type}&date=${date}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch logs');
      const blob = await res.blob();
      const filename = `path-ai-${type}-${date}.log`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="p-4 rounded-lg border border-input bg-card">
      <h3 className="text-lg font-semibold mb-2">Admin Logs</h3>
      <div className="flex items-center gap-2">
        <input
          type="date"
          className="p-2 rounded border"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={() => downloadLogs('admin')}
          className="flex items-center gap-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
          aria-label={`Download admin logs for ${date}`}
          title={`Download admin logs for ${date}`}
        >
          {loading && loadingType === 'admin' ? (
            'Downloading…'
          ) : (
            <>
              <Download className="size-4" />
              <span>Download admin</span>
            </>
          )}
        </button>
        <button
          onClick={() => downloadLogs('critical')}
          className="flex items-center gap-2 px-3 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
          disabled={loading}
          aria-label={`Download critical logs for ${date}`}
          title={`Download critical logs for ${date}`}
        >
          {loading && loadingType === 'critical' ? (
            'Downloading…'
          ) : (
            <>
              <Download className="size-4" />
              <span>Download critical</span>
            </>
          )}
        </button>
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}

export default AdminLogsWidget;
