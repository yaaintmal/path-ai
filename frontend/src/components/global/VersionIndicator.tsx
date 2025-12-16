import { useState, useEffect } from 'react';
import { getVersionInfo } from '../../version';
import { getApiUrl } from '../../config/app.config';

interface VersionIndicatorProps {
  onClick?: () => void;
}

export function VersionIndicator({ onClick }: VersionIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [versionInfo, setVersionInfo] = useState(getVersionInfo());
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'up' | 'down'>('unknown');
  const [llmModel, setLlmModel] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<number | null>(null);

  // Perform a lightweight backend health check. Throttled by `lastChecked`.
  const checkBackend = async () => {
    try {
      const now = Date.now();
      if (lastChecked && now - lastChecked < 10000) return;
      setLastChecked(now);
      const res = await fetch(getApiUrl('/api/changelog/latest'));
      setBackendStatus(res.ok ? 'up' : 'down');

      // Fetch LLM model info if backend is up
      if (res.ok) {
        try {
          const configRes = await fetch(getApiUrl('/api/admin/llm-config'), {
            credentials: 'include',
          });
          if (configRes.ok) {
            const configData = await configRes.json();
            setLlmModel(configData.model || null);
          }
        } catch {
          // Silently fail if LLM config fetch fails
        }
      }
    } catch {
      setBackendStatus('down');
    }
  };

  useEffect(() => {
    // Show version indicator for 3 seconds on mount
    const timer = setTimeout(() => setIsVisible(false), 3000);

    // Fetch latest version from backend
    const fetchVersion = async () => {
      try {
        const response = await fetch(getApiUrl('/api/changelog/latest'));
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.entry) {
            setVersionInfo({
              version: data.entry.version,
              date: data.entry.date || '',
              timestamp: new Date(data.entry.date || '').getTime(),
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch version info:', error);
      }
    };

    fetchVersion();

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Subtle Version Badge in Footer */}
      <div
        className="fixed bottom-4 right-4 z-50 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        onMouseEnter={() => {
          setIsVisible(true);
          void checkBackend();
        }}
        onMouseLeave={() => setIsVisible(false)}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.();
          }
        }}
      >
        <div className="flex items-center gap-2">
          <span className="opacity-60 group-hover:opacity-100 transition-opacity">
            v{versionInfo.version}
          </span>
          <div
            className={`w-2 h-2 ${
              backendStatus === 'up'
                ? 'bg-green-500'
                : backendStatus === 'down'
                  ? 'bg-red-500'
                  : 'bg-muted-foreground'
            } rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}
          ></div>
        </div>

        {/* Tooltip on Hover */}
        {isVisible && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200 px-3 py-2 rounded-lg whitespace-nowrap text-xs shadow-lg pointer-events-none border border-gray-700 dark:border-gray-600">
            <div>Version: {versionInfo.version}</div>
            <div className="text-muted-foreground">Updated: {versionInfo.date}</div>
            <div className="text-muted-foreground">
              Backend:{' '}
              <span
                className={
                  backendStatus === 'up'
                    ? 'text-green-400'
                    : backendStatus === 'down'
                      ? 'text-red-400'
                      : 'text-yellow-300'
                }
              >
                {backendStatus}
              </span>
            </div>
            {llmModel && (
              <div className="text-muted-foreground">
                LLM: <span className="text-blue-400">{llmModel}</span>
              </div>
            )}
            {onClick && <div className="text-primary text-xs mt-1">Click to view changelog</div>}
          </div>
        )}
      </div>
    </>
  );
}
