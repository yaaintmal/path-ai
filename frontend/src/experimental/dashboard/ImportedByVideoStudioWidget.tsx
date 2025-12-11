import React from 'react';
import { FileText } from 'lucide-react';

export function ImportedByVideoStudioWidget() {
  const importedItems = [
    { id: 1, title: 'Lesson 1 - Introduction', importedAt: 'Vor 2 Tagen' },
    { id: 2, title: 'Lesson 2 - Basics', importedAt: 'Vor 5 Tagen' },
  ];
  return (
    <div className="bg-card rounded p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Imported by Studio AI (experimental)</h2>
        <div className="w-10 h-10 rounded bg-blue-500 flex items-center justify-center text-white">
          <FileText className="w-4 h-4" />
        </div>
      </div>
      <div className="space-y-2">
        {importedItems.map((it) => (
          <div key={it.id} className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-12 h-8 bg-gray-200 rounded" />
            <div className="flex-1">
              <p className="text-sm font-medium">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.importedAt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImportedByVideoStudioWidget;
