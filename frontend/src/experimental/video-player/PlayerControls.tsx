import React from 'react';

export function PlayerControls({ captionsEnabled = false }: { captionsEnabled?: boolean }) {
  return (
    <div className="bg-card p-2 rounded text-sm">
      <div>Experimental PlayerControls</div>
      <div className="text-xs text-muted-foreground">
        Captions: {captionsEnabled ? 'on' : 'off'}
      </div>
    </div>
  );
}

export default PlayerControls;
