import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { CheckCircle2, Circle, PlayCircle, FileText, TrendingUp } from 'lucide-react';

export function DashboardPreview() {
  return (
    <section id="dashboard" className="container mx-auto px-4 py-20 md:py-32">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl mb-4">
          Dein persönliches{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lern-Dashboard
          </span>
        </h2>
        <p className="text-xl text-gray-600">
          Behalte den Überblick über deinen Fortschritt und deine Ziele
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white/95">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">Gesamtfortschritt</div>
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div className="text-3xl mb-2">68%</div>
              <Progress value={68} className="h-2" />
            </Card>

            <Card className="p-6 bg-white/95">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">Skills erlernt</div>
                <CheckCircle2 className="size-5 text-blue-600" />
              </div>
              <div className="text-3xl mb-2">12/18</div>
              <div className="text-sm text-gray-600">6 Skills verbleibend</div>
            </Card>

            <Card className="p-6 bg-white/95">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">Lernzeit</div>
                <PlayCircle className="size-5 text-purple-600" />
              </div>
              <div className="text-3xl mb-2">42h</div>
              <div className="text-sm text-gray-600">Diese Woche: 8h</div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/95">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Aktueller Lernplan</h3>
                <Badge>In Bearbeitung</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm mb-1">React Grundlagen</div>
                    <div className="text-xs text-gray-600">5 Videos abgeschlossen</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <PlayCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm mb-1">TypeScript Basics</div>
                    <div className="text-xs text-gray-600">3/7 Videos</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Circle className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm mb-1">Hooks & State Management</div>
                    <div className="text-xs text-gray-600">Noch nicht gestartet</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/95">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Fehlende Skills</h3>
                <Badge variant="secondary">6 Skills</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">API Integration</div>
                  <Badge variant="outline">Mittel</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">Testing mit Jest</div>
                  <Badge variant="outline">Fortgeschritten</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">Performance Optimization</div>
                  <Badge variant="outline">Fortgeschritten</Badge>
                </div>
              </div>
              <button className="w-full mt-4 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                Lernplan aktualisieren
              </button>
            </Card>
          </div>

          <Card className="p-6 bg-white/95 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="size-5 text-gray-600" />
              <h3 className="text-lg">Lernmaterialien</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200 hover:border-blue-600 transition-colors cursor-pointer">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-xs">Cheatsheet.pdf</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200 hover:border-blue-600 transition-colors cursor-pointer">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-xs">Präsentation.pptx</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200 hover:border-blue-600 transition-colors cursor-pointer">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-xs">Notizen.docx</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200 hover:border-blue-600 transition-colors cursor-pointer">
                <div className="text-2xl mb-1">💾</div>
                <div className="text-xs">Code-Beispiele.zip</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
