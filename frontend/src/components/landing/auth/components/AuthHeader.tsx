import { Sparkles } from 'lucide-react';

interface AuthHeaderProps {
  subtitle: string;
  title: string;
  description: string;
}

export function AuthHeader({ subtitle, title, description }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-4">
        <Sparkles className="size-4" />
        <span className="text-sm">{subtitle}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-3 dark:text-white">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
