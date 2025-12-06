// import config from '../../config/app.config';
// import { Edit } from 'lucide-react';

// interface DashboardHeaderProps {
//   mode: 'video-translation' | 'learning';
//   onEdit?: (e: React.MouseEvent) => void;
// }

export function DashboardHeader() {
  // export function DashboardHeader({ mode, onEdit }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        {mode === 'video-translation' ? `${config.app.name} Studio Dashboard` : `${config.app.name} Dashboard`}
      </h1>
      <p className="text-muted-foreground">
        {mode === 'video-translation'
          ? 'Transcribe and translate your videos with AI assistance.'
          : 'Create and track your learning paths with AI guidance.'}
      </p> */}

      {/* If dashboard edit is triggered on the page, show a compact edit button that matches the header */}
      {/* {onEdit && (
        <button
          onClick={onEdit}
          className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="size-4" />
          Dashboard anpassen
        </button>
      )} */}
    </div>
  );
}
