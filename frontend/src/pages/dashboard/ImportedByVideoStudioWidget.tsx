import { FileText } from 'lucide-react';

export function ImportedByVideoStudioWidget() {
  // Placeholder data for videos imported from video studio
  const importedItems = [
    { id: 1, title: 'Lesson 1 - Introduction', importedAt: 'Vor 2 Tagen' },
    { id: 2, title: 'Lesson 2 - Basics', importedAt: 'Vor 5 Tagen' },
    { id: 3, title: 'Lesson 3 - Advanced', importedAt: 'Vor 1 Woche' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          imported by Studio AI
        </h2>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-2">
        {importedItems.length > 0 ? (
          importedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0 flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-gray-500 transition-colors">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.importedAt}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            no content imported yet
          </p>
        )}
      </div>
    </div>
  );
}
