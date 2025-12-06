export function FullWidthWidget() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          added by Video Studio
        </h2>
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Placeholder content for widget 6. This widget spans the full width.
      </p>
      <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-500">Content Area</span>
      </div>
    </div>
  );
}
