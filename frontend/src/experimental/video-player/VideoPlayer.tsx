import React, { useState } from 'react';

type VideoPlayerProps = {
  videoSrc?: string | undefined;
  subtitleText?: string | undefined;
};

export function VideoPlayer({ videoSrc, subtitleText }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="bg-black/50 p-4 rounded">
      <div className="text-white font-semibold">Experimental Video Player</div>
      <div className="mt-2">
        <div className="bg-black aspect-video rounded mb-2 flex items-center justify-center text-white">
          {videoSrc || 'No video'}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsPlaying(!isPlaying)} className="btn btn-primary">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div className="text-xs text-muted-foreground">
            Subtitles: {subtitleText ? 'Loaded' : 'None'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
