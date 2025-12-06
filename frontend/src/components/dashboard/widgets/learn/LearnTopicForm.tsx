import { BookOpen } from 'lucide-react';

interface LearnTopicFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export function LearnTopicForm({
  value,
  onChange,
  onSubmit,
  isLoading,
  error,
}: LearnTopicFormProps) {
  return (
    <div>
      <form onSubmit={onSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. 'english grammar' or 'Python programming basics'"
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}
            {isLoading ? 'loading...' : 'starting'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
