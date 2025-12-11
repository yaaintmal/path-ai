import React from 'react';
import { Video } from 'lucide-react';

// Experimental backup of the video statistics widget
export function VideoTranslationStatsWidget() {
  // produce a simple placeholder similar to the original widget
  return (
    <div className="bg-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Video Statistics (experimental)</h2>
        <div className="w-10 h-10 rounded bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
          <Video className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        This is an archival copy of the original widget.
      </p>
    </div>
  );
}

export default VideoTranslationStatsWidget;
