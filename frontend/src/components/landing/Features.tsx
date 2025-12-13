import { Brain, Target, BarChart3, FileText, Zap } from 'lucide-react';
import { Card } from '../../ui/card';

const features = [
  {
    icon: Brain,
    title: 'KI-Lernpfade',
    description:
      'Gib ein Thema ein und unsere KI generiert sofort einen strukturierten Lernpfad mit relevanten Unterthemen.',
  },
  {
    icon: FileText,
    title: 'Templates & Vorlagen',
    description:
      'Starte sofort durch mit kuratierten Templates für Karrierepfade wie "Full-Stack Developer" oder "Cloud Engineer".',
  },
  {
    icon: Target,
    title: 'Zielgerichtetes Lernen',
    description:
      'Definiere deine Ziele im Onboarding und erhalte Inhalte, die genau auf dein Niveau und deine Zeitpläne abgestimmt sind.',
  },
  {
    icon: BarChart3,
    title: 'Detaillierte Statistiken',
    description:
      'Behalte den Überblick über deine Lernzeit, abgeschlossene Themen und deine aktuelle Streak.',
  },
  {
    icon: Zap,
    title: 'Gamification & Store',
    description:
      'Sammle Punkte für jeden Erfolg und löse sie im Store gegen Boosts, Badges und Profil-Upgrades ein.',
  },
  {
    icon: FileText,
    title: 'Interaktive Inhalte',
    description:
      'Lerne aktiv mit KI-generierten Erklärungen, Zusammenfassungen und Quiz-Fragen zu jedem Thema.',
  },
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-20 md:py-32">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl mb-4">
          Lernen, das sich{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            an dich anpasst
          </span>
        </h2>
        <p className="text-xl text-gray-600">
          Entdecke eine völlig neue Art zu lernen - individuell, flexibel und immer an deiner Seite.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-gray-200">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 size-12 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="size-6 text-white" />
            </div>
            <h3 className="text-xl mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
