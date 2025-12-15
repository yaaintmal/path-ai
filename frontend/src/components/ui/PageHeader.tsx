interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, onBack }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      {onBack && (
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium transition-colors"
          aria-label="back"
        >
          Back to Dashboard
        </button>
      )}
    </div>
  );
}

export default PageHeader;
