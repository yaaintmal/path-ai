export function FullWidthWidget() {
  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">added by Video Studio</h2>
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg"></div>
      </div>
      <p className="text-muted-foreground mb-4">
        Placeholder content for widget 6. This widget spans the full width.
      </p>
      <div className="h-40 bg-card-foreground/5 dark:bg-card-foreground/30 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Content Area</span>
      </div>
    </div>
  );
}
