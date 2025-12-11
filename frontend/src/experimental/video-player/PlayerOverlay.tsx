import React from 'react';

export function PlayerOverlay({
  isLoading,
  hasError,
}: {
  isLoading?: boolean;
  hasError?: boolean;
}) {
  return (
    <div className="bg-card p-3 rounded text-center text-sm">
      {isLoading
        ? 'Loading (experimental)…'
        : hasError
          ? 'Error loading (experimental)'
          : 'Idle (experimental)'}
    </div>
  );
}

export default PlayerOverlay;
