interface DashboardHeaderProps {
  mode: 'video-translation' | 'learning';
  onEdit: (e: React.MouseEvent) => void;
}

export function DashboardHeader({ mode }: DashboardHeaderProps) {
  // export function DashboardHeader({ mode, onEdit }: DashboardHeaderProps) {

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        {mode === 'video-translation' ? 'Studio AI Dashboard' : 'Path AI Dashboard'}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {mode === 'video-translation'
          ? 'Transcribe and translate your videos with AI assistance.'
          : 'Create and track your learning paths with AI guidance.'}
      </p>

      {/* refactored - removed as already in main header */}
      {/* <button
        onClick={onEdit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Dashboard anpassen
      </button> */}
    </div>
  );
}
