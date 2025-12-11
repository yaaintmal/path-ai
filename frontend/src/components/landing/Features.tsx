import { Brain, Youtube, Target, BarChart3, FileText, Zap } from 'lucide-react';
import { Card } from '../../ui/card';

const features = [
  {
    icon: Brain,
    title: 'KI-generierte Lernpläne',
    description:
      'Unsere KI erstellt einen personalisierten Lernplan basierend auf deinen Zielen, Vorkenntnissen und verfügbarer Zeit.',
  },
  {
    icon: FileText,
    title: 'Integration von Lerninhalten & Lokalisierung',
    description:
      'Zugriff auf die besten Lernressourcen - automatisch in über 100 Sprachen lokalisiert mit Untertiteln.',
  },
  {
    icon: Target,
    title: 'Für alle Altersgruppen',
    description:
      'Von Grundschülern bis zu Studenten - LearnAI und LearnBuddy passen sich an jedes Niveau an.',
  },
  {
    icon: BarChart3,
    title: 'Fortschritts-Tracking',
    description:
      'Verfolge deinen Lernfortschritt in Echtzeit und sehe welche Skills du bereits beherrschst.',
  },
  {
    icon: FileText,
    title: 'Lernmaterial-Management',
    description:
      'Lade Lernmaterialien herunter, bearbeite sie und organisiere alles an einem Ort - in jeder Sprache.',
  },
  {
    icon: Zap,
    title: 'Interaktives Lernen',
    description:
      'Die KI geht gemeinsam mit dir durch das Material und beantwortet deine Fragen in Echtzeit.',
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
