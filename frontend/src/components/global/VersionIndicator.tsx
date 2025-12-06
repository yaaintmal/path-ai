import { useState, useEffect } from 'react';
import { getVersionString, getVersionInfo } from '../../version';

export function VersionIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const versionInfo = getVersionInfo();

  useEffect(() => {
    // Show version indicator for 3 seconds on mount
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Subtle Version Badge in Footer */}
      <div
        className="fixed bottom-4 right-4 z-50 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <div className="flex items-center gap-2">
          <span className="opacity-60 group-hover:opacity-100 transition-opacity">
            {getVersionString()}
          </span>
          <div className="w-2 h-2 bg-muted-foreground group-hover:bg-green-500 dark:bg-muted-foreground rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Tooltip on Hover */}
        {isVisible && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-200 px-3 py-2 rounded-lg whitespace-nowrap text-xs shadow-lg pointer-events-none border border-gray-700 dark:border-gray-600">
            <div>Version: {versionInfo.version}</div>
            <div className="text-muted-foreground">Updated: {versionInfo.date}</div>
          </div>
        )}
      </div>
    </>
  );
}
