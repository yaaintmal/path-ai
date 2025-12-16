import { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Target,
  FileText,
  UserPlus,
  Lightbulb,
  Award,
  ClipboardList,
  Eye,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const audiences = [
  {
    id: 'students',
    icon: GraduationCap,
    title: 'Studenten & Weiterbildung',
    subtitle: 'Für lebenslanges Lernen',
    color: 'from-blue-600 to-cyan-600',
    features: [
      { icon: Target, text: 'Strukturierte Lernpfade für komplexe Themen' },
      { icon: TrendingUp, text: 'Fortschritts-Tracking für alle Module' },
      { icon: Award, text: 'Gamification: Punkte, Achievements & Belohnungen' },
      { icon: Users, text: 'Templates für Karrierepfade (z.B. MERN Stack)' },
    ],
    benefits: 'Perfekt für Universitätsstudium, Zertifizierungen und berufliche Weiterbildung',
  },
  {
    id: 'kids',
    icon: BookOpen,
    title: 'Schüler & Entdecker',
    subtitle: 'Bessere Noten, mehr Spaß beim Lernen',
    color: 'from-orange-600 to-pink-600',
    features: [
      { icon: Lightbulb, text: 'Entdecke deinen persönlichen Lerntyp' },
      { icon: TrendingUp, text: 'Verbessere deine Noten in allen Fächern' },
      { icon: Award, text: 'Spielerisch lernen mit Achievements & Punkten' },
      { icon: Target, text: 'Einfache Erklärungen für schwierige Themen' },
    ],
    benefits: 'Ideal für Schule und Hobby - in allen Fächern und Sprachen',
  },
  {
    id: 'teachers',
    icon: Users,
    title: 'Lehrer & Mentoren',
    subtitle: 'Wissen strukturieren und teilen',
    color: 'from-green-600 to-emerald-600',
    features: [
      { icon: ClipboardList, text: 'Erstelle eigene Lernpfad-Templates' },
      { icon: Eye, text: 'Strukturiere Wissen für deine Schüler' },
      { icon: FileText, text: 'KI-unterstützte Erstellung von Inhalten' },
      { icon: UserPlus, text: 'Teile deine Expertise mit der Community' },
    ],
    benefits: 'Erstelle perfekte Lernstrukturen und inspiriere andere',
  },
];

export function TargetAudiences() {
  const [selectedAudience, setSelectedAudience] = useState('students');
  const current = audiences.find((a) => a.id === selectedAudience);

  return (
    <section className="container mx-auto px-4 py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight animate-fade-in">
            Für{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              jeden Lernenden
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delayed">
            Von der Grundschule bis zur Universität - Path AI passt sich an deine Bedürfnisse an
          </p>
        </div>

        {/* Audience Selector */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {audiences.map((audience, index) => (
            <div
              key={audience.id}
              className="animate-slide-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <Card
                className={`h-full p-6 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                  selectedAudience === audience.id
                    ? 'border-amber-600 shadow-xl scale-105 bg-white/80 dark:bg-gray-900/80'
                    : 'border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:border-amber-300 hover:shadow-lg'
                }`}
                onClick={() => setSelectedAudience(audience.id)}
              >
                <div
                  className={`bg-gradient-to-br ${audience.color} size-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                >
                  <audience.icon className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1">{audience.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{audience.subtitle}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* Selected Audience Details */}
        {current && (
          <div className="animate-fade-in bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div
                  className={`bg-gradient-to-br ${current.color} size-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <current.icon className="size-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-3">{current.title}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{current.benefits}</p>

                <div className="space-y-4">
                  {current.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div
                        className={`bg-gradient-to-br ${current.color} p-2 rounded-lg flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon className="size-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-200 font-medium">
                          {feature.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className={`mt-8 gap-2 bg-gradient-to-r ${current.color} text-white border-0 hover:opacity-90 transition-opacity shadow-lg`}
                >
                  Mehr erfahren <ArrowRight className="size-4" />
                </Button>
              </div>

              <div className="relative">
                {/* Decorative blob behind preview */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br ${current.color} opacity-10 blur-3xl rounded-full`}
                />
                <div className="relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                  {current.id === 'students' && <StudentPreview />}
                  {current.id === 'kids' && <KidsPreview />}
                  {current.id === 'teachers' && <TeacherPreview />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StudentPreview() {
  return (
    <Card className="p-6 bg-white dark:bg-gray-950 shadow-2xl border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <span className="text-xl">👨‍🎓</span>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Student</div>
          <div className="font-medium">Max Mustermann</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Web Development</span>
            <Badge className="bg-blue-600 hover:bg-blue-700">Aktiv</Badge>
          </div>
          <div className="text-xs text-muted-foreground mb-2">Fortschritt: 68%</div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 w-[68%]" />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Data Science</span>
            <Badge variant="outline">Geplant</Badge>
          </div>
          <div className="text-xs text-muted-foreground">Start: Nächste Woche</div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <Calendar className="size-4" />
          <span>Nächste Session: Heute, 18:00 Uhr</span>
        </div>
      </div>
    </Card>
  );
}

function KidsPreview() {
  return (
    <Card className="p-6 bg-white dark:bg-gray-950 shadow-2xl border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
          <span className="text-xl">👧</span>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Path AI</div>
          <div className="font-medium">Anna, 5. Klasse</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="text-sm font-medium">Dein Lerntyp</div>
              <Badge className="bg-orange-600 text-white border-0 mt-1 hover:bg-orange-700">
                Visuell
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Du lernst am besten mit Bildern und anschaulichen Beispielen!
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span>📐</span>
              <span className="text-sm font-medium">Mathematik</span>
            </div>
            <span className="text-green-600 font-bold">Note: 2+</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-[85%]" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span>🇬🇧</span>
              <span className="text-sm font-medium">Englisch</span>
            </div>
            <span className="text-blue-600 font-bold">Note: 1-</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-[95%]" />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
          <Award className="size-5 text-yellow-600 dark:text-yellow-500" />
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            5 Lernabzeichen diese Woche! 🎉
          </span>
        </div>
      </div>
    </Card>
  );
}

function TeacherPreview() {
  return (
    <Card className="p-6 bg-white dark:bg-gray-950 shadow-2xl border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <span className="text-xl">👨‍🏫</span>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Lehrerdashboard</div>
          <div className="font-medium">Klasse 8b - Mathematik</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Klassenübersicht</span>
            <Badge className="bg-green-600 text-white border-0 hover:bg-green-700">
              24 Schüler
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold">18</div>
              <div className="text-xs text-muted-foreground">Aktiv</div>
            </div>
            <div>
              <div className="text-2xl font-bold">6</div>
              <div className="text-xs text-muted-foreground">Brauchen Hilfe</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2.3</div>
              <div className="text-xs text-muted-foreground">Ø Note</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
          <div className="text-sm font-medium mb-2">Nächstes Thema vorbereiten</div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Quadratische Gleichungen</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Mit KI vorbereiten <ArrowRight className="size-3" />
          </Button>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 text-sm">
            <Lightbulb className="size-4 text-yellow-600 dark:text-yellow-500" />
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              3 Schüler haben Schwierigkeiten
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
