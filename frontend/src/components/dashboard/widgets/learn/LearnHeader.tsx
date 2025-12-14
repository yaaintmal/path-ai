import { BookOpen, Zap } from 'lucide-react';
import IconButton from '../../../ui/IconButton';

interface LearnHeaderProps {
  onTemplatesClick?: () => void;
}

export function LearnHeader({ onTemplatesClick }: LearnHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Path AI</h2>
      <div className="flex items-center gap-3">
        <IconButton
          onClick={() => onTemplatesClick && onTemplatesClick()}
          ariaLabel="Open learning templates"
          title="Learning templates"
          className="bg-gradient-to-br from-orange-400 to-red-500 hover:shadow-lg"
        >
          <Zap className="w-6 h-6 text-white" />
        </IconButton>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
