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
      { icon: Target, text: 'Individuelle Lernpläne für dein Studium' },
      { icon: TrendingUp, text: 'Fortschritts-Tracking für alle Module' },
      { icon: Award, text: 'Gamification: Punkte, Achievements & Belohnungen' },
      { icon: Users, text: 'Lerngruppen und Community' },
    ],
    benefits: 'Perfekt für Universitätsstudium, Zertifizierungen und berufliche Weiterbildung',
  },
  {
    id: 'kids',
    icon: BookOpen,
    title: 'LearnBuddy für Schulkinder',
    subtitle: 'Bessere Noten, mehr Spaß beim Lernen',
    color: 'from-orange-600 to-pink-600',
    features: [
      { icon: Lightbulb, text: 'Entdecke deinen persönlichen Lerntyp' },
      { icon: TrendingUp, text: 'Verbessere deine Noten in allen Fächern' },
      { icon: Award, text: 'Spielerisch lernen mit Achievements & Punkten' },
      { icon: Target, text: 'Kindgerechte Erklärungen und Lern-Spiele' },
    ],
    benefits: 'Ideal für Grundschule bis Abitur - in allen Fächern und Sprachen',
  },
  {
    id: 'teachers',
    icon: Users,
    title: 'Für Lehrer & Pädagogen',
    subtitle: 'KI-gestützte Unterrichtsvorbereitung',
    color: 'from-green-600 to-emerald-600',
    features: [
      { icon: ClipboardList, text: 'Klassenverwaltung und Schülerübersicht' },
      { icon: Eye, text: 'Leistungen und Fortschritte einsehen' },
      { icon: FileText, text: 'KI-unterstützte Lernabschnitte vorbereiten' },
      { icon: UserPlus, text: 'Gezielt auf einzelne Schüler eingehen' },
    ],
    benefits: 'Spare Zeit bei der Vorbereitung und fördere jeden Schüler individuell',
  },
];

export function TargetAudiences() {
  const [selectedAudience, setSelectedAudience] = useState('students');
  const current = audiences.find((a) => a.id === selectedAudience);

  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl mb-4">
          Für{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            jeden Lernenden
          </span>
        </h2>
        <p className="text-xl text-muted-foreground">
          Von der Grundschule bis zur Universität - LearnAI passt sich an deine Bedürfnisse an
        </p>
      </div>

      {/* Audience Selector */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {audiences.map((audience) => (
          <Card
            key={audience.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedAudience === audience.id
                ? 'border-2 border-blue-600 shadow-xl scale-105'
                : 'border-2 border-transparent hover:border-border'
            }`}
            onClick={() => setSelectedAudience(audience.id)}
          >
            <div
              className={`bg-gradient-to-br ${audience.color} size-14 rounded-xl flex items-center justify-center mb-4`}
            >
              <audience.icon className="size-7 text-white" />
            </div>
            <h3 className="text-xl mb-1">{audience.title}</h3>
            <p className="text-sm text-muted-foreground">{audience.subtitle}</p>
          </Card>
        ))}
      </div>

      {/* Selected Audience Details */}
      {current && (
            <div className="bg-gradient-to-br from-card-foreground/5 to-card rounded-3xl p-8 md:p-12 border border-border">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className={`bg-gradient-to-br ${current.color} size-20 rounded-2xl flex items-center justify-center mb-6`}
              >
                <current.icon className="size-10 text-white" />
              </div>
              <h3 className="text-3xl mb-3">{current.title}</h3>
              <p className="text-lg text-muted-foreground mb-8">{current.benefits}</p>

              <div className="space-y-4">
                {current.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`bg-gradient-to-br ${current.color} p-2 rounded-lg flex-shrink-0`}
                    >
                      <feature.icon className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="text-foreground">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className={`mt-8 gap-2 bg-gradient-to-r ${current.color} text-white border-0`}
              >
                Mehr erfahren <ArrowRight className="size-4" />
              </Button>
            </div>

            <div>
              {current.id === 'students' && <StudentPreview />}
              {current.id === 'kids' && <KidsPreview />}
              {current.id === 'teachers' && <TeacherPreview />}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StudentPreview() {
  return (
    <Card className="p-6 bg-card shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-xl">👨‍🎓</span>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Student</div>
          <div>Max Mustermann</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Web Development</span>
            <Badge>Aktiv</Badge>
          </div>
          <div className="text-xs text-muted-foreground mb-2">Fortschritt: 68%</div>
          <div className="h-2 bg-card-foreground/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 w-[68%]" />
          </div>
        </div>
        <div className="bg-card-foreground/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Data Science</span>
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
    <Card className="p-6 bg-card shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-xl">👧</span>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">LearnBuddy</div>
          <div>Anna, 5. Klasse</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="text-sm">Dein Lerntyp</div>
              <Badge className="bg-orange-600 text-white border-0 mt-1">Visuell</Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Du lernst am besten mit Bildern und Videos!</p>
        </div>

        <div className="bg-card-foreground/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span>📐</span>
              <span className="text-sm">Mathematik</span>
            </div>
            <span className="text-green-600">Note: 2+</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-[85%]" />
          </div>
        </div>

        <div className="bg-card-foreground/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span>🇬🇧</span>
              <span className="text-sm">Englisch</span>
            </div>
            <span className="text-blue-600">Note: 1-</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-[95%]" />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <Award className="size-5 text-yellow-600" />
          <span className="text-sm">5 Lernabzeichen diese Woche! 🎉</span>
        </div>
      </div>
    </Card>
  );
}

function TeacherPreview() {
  return (
    <Card className="p-6 bg-card shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-12 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-xl">👨‍🏫</span>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Lehrerdashboard</div>
          <div>Klasse 8b - Mathematik</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Klassenübersicht</span>
            <Badge className="bg-green-600 text-white border-0">24 Schüler</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl">18</div>
              <div className="text-xs text-muted-foreground">Aktiv</div>
            </div>
            <div>
              <div className="text-2xl">6</div>
              <div className="text-xs text-muted-foreground">Brauchen Hilfe</div>
            </div>
            <div>
              <div className="text-2xl">2.3</div>
              <div className="text-xs text-muted-foreground">Ø Note</div>
            </div>
          </div>
        </div>

        <div className="bg-card-foreground/5 rounded-lg p-4">
          <div className="text-sm mb-2">Nächstes Thema vorbereiten</div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Quadratische Gleichungen</span>
          </div>
          <Button size="sm" variant="outline" className="w-full gap-2">
            Mit KI vorbereiten <ArrowRight className="size-3" />
          </Button>
        </div>

        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <div className="flex items-center gap-2 text-sm">
            <Lightbulb className="size-4 text-yellow-600" />
            <span>3 Schüler haben Schwierigkeiten - individuelle Lernpläne empfohlen</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
