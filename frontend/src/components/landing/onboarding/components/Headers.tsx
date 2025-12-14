import { Sparkles } from 'lucide-react';

interface StepHeaderProps {
  title: string;
  description: string;
}

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-2xl mb-2 dark:text-white">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface PageHeaderProps {
  subtitle: string;
  title: string;
  highlight: string;
  description: string;
}

export function PageHeader({ subtitle, title, highlight, description }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-4">
        <Sparkles className="size-4" />
        <span className="text-sm">{subtitle}</span>
      </div>
      <h1 className="text-4xl md:text-5xl mb-3 dark:text-white">
        Let's{' '}
        <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
          {highlight}
        </span>{' '}
        your dashboard {title}
      </h1>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
}
