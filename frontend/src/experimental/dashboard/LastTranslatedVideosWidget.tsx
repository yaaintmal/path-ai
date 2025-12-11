import React from 'react';
import { Video } from 'lucide-react';

export function LastTranslatedVideosWidget() {
  const translatedVideos = [
    { id: 1, title: 'Video Title 1', translatedAt: 'Vor 2 Tagen' },
    { id: 2, title: 'Video Title 2', translatedAt: 'Vor 5 Tagen' },
  ];
  return (
    <div className="bg-card rounded p-4">
      <h2 className="font-semibold">Last Translated Videos (experimental)</h2>
      <div className="mt-2 space-y-2">
        {translatedVideos.map((v) => (
          <div key={v.id} className="flex items-center gap-3">
            <div className="w-10 h-8 bg-gray-200 rounded flex items-center justify-center">
              <Video className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{v.title}</p>
              <p className="text-xs text-muted-foreground">{v.translatedAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LastTranslatedVideosWidget;
