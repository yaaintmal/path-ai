import { Video } from 'lucide-react';

export function LastTranslatedVideosWidget() {
  // Placeholder data for future video translation implementation
  const translatedVideos = [
    { id: 1, title: 'Video Title 1', translatedAt: 'Vor 2 Tagen' },
    { id: 2, title: 'Video Title 2', translatedAt: 'Vor 5 Tagen' },
    { id: 3, title: 'Video Title 3', translatedAt: 'Vor 1 Woche' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          lastly translated videos
        </h2>
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Video className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-2">
        {translatedVideos.length > 0 ? (
          translatedVideos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0 flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-500 transition-colors">
                <Video className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {video.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{video.translatedAt}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            no videos translated yet
          </p>
        )}
      </div>
    </div>
  );
}
