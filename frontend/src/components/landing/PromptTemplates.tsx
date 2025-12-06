import { useState } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Eye, Headphones, Hand, BookOpen, Zap, ArrowRight, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

const learningTypes = [
  {
    id: 'visual',
    icon: Eye,
    name: 'Visueller Lerntyp',
    description: 'Lerne am besten durch Bilder, Diagramme und Videos',
    color: 'from-blue-600 to-cyan-600',
    templates: [
      {
        title: 'Webentwicklung für visuelle Lerner',
        keywords: ['React', 'UI/UX Design', 'CSS Animationen', 'Responsive Design'],
        prompt:
          'Erstelle einen Lernplan mit vielen visuellen Tutorials, Code-Beispielen und Design-Patterns',
        duration: '8 Wochen',
        level: 'Anfänger',
      },
      {
        title: 'Data Science mit Visualisierungen',
        keywords: ['Python', 'Matplotlib', 'Datenvisualisierung', 'Pandas'],
        prompt: 'Fokus auf grafische Darstellungen, Diagramme und visuelle Datenanalyse',
        duration: '10 Wochen',
        level: 'Mittel',
      },
      {
        title: 'Grafikdesign & Illustration',
        keywords: ['Figma', 'Adobe', 'Design Principles', 'Farbtheorie'],
        prompt: 'Lerne durch Design-Tutorials, visuelle Beispiele und praktische Projekte',
        duration: '6 Wochen',
        level: 'Anfänger',
      },
    ],
  },
  {
    id: 'auditory',
    icon: Headphones,
    name: 'Auditiver Lerntyp',
    description: 'Lerne am besten durch Zuhören und Diskussionen',
    color: 'from-purple-600 to-pink-600',
    templates: [
      {
        title: 'Programmierung durch Podcasts & Talks',
        keywords: ['JavaScript', 'Tech Talks', 'Code Reviews', 'Pair Programming'],
        prompt: 'Erstelle einen Lernplan mit Podcasts, Audio-Tutorials und erklärenden Videos',
        duration: '8 Wochen',
        level: 'Anfänger',
      },
      {
        title: 'Sprachen lernen mit Audio',
        keywords: ['Englisch', 'Aussprache', 'Konversation', 'Listening'],
        prompt: 'Fokus auf Hörverstehen, Podcasts und gesprochene Dialoge',
        duration: '12 Wochen',
        level: 'Alle Level',
      },
      {
        title: 'Marketing & Kommunikation',
        keywords: ['Content Marketing', 'Storytelling', 'Präsentation', 'Rhetorik'],
        prompt: 'Lerne durch Vorträge, Diskussionen und Audio-Beispiele',
        duration: '6 Wochen',
        level: 'Mittel',
      },
    ],
  },
  {
    id: 'kinesthetic',
    icon: Hand,
    name: 'Kinästhetischer Lerntyp',
    description: 'Lerne am besten durch praktisches Tun und Experimentieren',
    color: 'from-orange-600 to-red-600',
    templates: [
      {
        title: 'Hands-on Programmierung',
        keywords: ['Coding Challenges', 'Live Coding', 'Projekte', 'Debugging'],
        prompt: 'Erstelle einen praxisorientierten Plan mit vielen Übungen und Mini-Projekten',
        duration: '10 Wochen',
        level: 'Anfänger',
      },
      {
        title: 'IoT & Hardware',
        keywords: ['Arduino', 'Raspberry Pi', 'Sensoren', 'Prototyping'],
        prompt: 'Fokus auf praktische Experimente und Hardware-Projekte',
        duration: '8 Wochen',
        level: 'Mittel',
      },
      {
        title: 'Gamedev mit Unity',
        keywords: ['Unity', 'C#', '3D Modeling', 'Game Mechanics'],
        prompt: 'Lerne durch eigene Spiele-Prototypen und interaktive Projekte',
        duration: '12 Wochen',
        level: 'Mittel',
      },
    ],
  },
  {
    id: 'reading',
    icon: BookOpen,
    name: 'Lese-/Schreib-Lerntyp',
    description: 'Lerne am besten durch Lesen und schriftliche Zusammenfassungen',
    color: 'from-green-600 to-emerald-600',
    templates: [
      {
        title: 'Dokumentations-basiertes Lernen',
        keywords: ['Technische Docs', 'Tutorials', 'Coding Guides', 'Best Practices'],
        prompt: 'Erstelle einen Lernplan mit ausführlichen Texten, Dokumentationen und Notizen',
        duration: '8 Wochen',
        level: 'Alle Level',
      },
      {
        title: 'Wissenschaftliches Arbeiten',
        keywords: ['Research', 'Literaturrecherche', 'Wissenschaft', 'Methodik'],
        prompt: 'Fokus auf Fachliteratur, Papers und schriftliche Ausarbeitungen',
        duration: '10 Wochen',
        level: 'Fortgeschritten',
      },
      {
        title: 'Content Writing & Blogging',
        keywords: ['SEO', 'Copywriting', 'Storytelling', 'Redaktion'],
        prompt: 'Lerne durch Lesen von Beispielen und eigenes Schreiben',
        duration: '6 Wochen',
        level: 'Anfänger',
      },
    ],
  },
];

const quickStartTemplates = [
  {
    title: 'KI & Machine Learning Schnellstart',
    keywords: ['Python', 'TensorFlow', 'Neural Networks', 'AI Basics'],
    description: 'Perfekt für den Einstieg in künstliche Intelligenz',
    difficulty: 'Mittel',
    time: '12 Wochen',
  },
  {
    title: 'Full-Stack Web Developer',
    keywords: ['React', 'Node.js', 'MongoDB', 'API Design'],
    description: 'Vom Frontend bis zum Backend - alles was du brauchst',
    difficulty: 'Anfänger',
    time: '16 Wochen',
  },
  {
    title: 'Mobile App Development',
    keywords: ['React Native', 'iOS', 'Android', 'UX Design'],
    description: 'Erstelle native Apps für iOS und Android',
    difficulty: 'Mittel',
    time: '10 Wochen',
  },
  {
    title: 'Cloud & DevOps Engineer',
    keywords: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    description: 'Werde zum Cloud-Experten',
    difficulty: 'Fortgeschritten',
    time: '14 Wochen',
  },
];

export function PromptTemplates() {
  const [selectedType, setSelectedType] = useState('visual');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <section className="container mx-auto px-4 py-20 md:py-32 bg-white">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl mb-4">
          Vorgefertigte{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lernplan-Templates
          </span>
        </h2>
        <p className="text-xl text-gray-600">
          Wähle deinen Lerntyp und starte mit einem optimierten Lernplan, der perfekt auf deine
          Bedürfnisse zugeschnitten ist
        </p>
      </div>

      {/* Quick Start Templates */}
      <div className="mb-20">
        <h3 className="text-2xl mb-6 text-center">Beliebte Karrierepfade</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStartTemplates.map((template, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-600"
            >
              <div className="mb-3">
                <Badge variant="secondary" className="mb-2">
                  {template.difficulty}
                </Badge>
                <h4 className="text-lg mb-2">{template.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {template.keywords.slice(0, 3).map((keyword, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-gray-500 mb-3">⏱️ {template.time}</div>
              <Button size="sm" className="w-full gap-2">
                Plan erstellen <ArrowRight className="size-3" />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Type Templates */}
      <div>
        <h3 className="text-2xl mb-6 text-center">Nach Lerntyp</h3>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 mb-8 bg-transparent">
            {learningTypes.map((type) => (
              <TabsTrigger
                key={type.id}
                value={type.id}
                className="flex-col h-auto py-4 data-[state=active]:bg-white data-[state=active]:shadow-md"
              >
                <div className={`bg-gradient-to-br ${type.color} p-3 rounded-lg mb-2`}>
                  <type.icon className="size-6 text-white" />
                </div>
                <div className="text-sm">{type.name}</div>
              </TabsTrigger>
            ))}
          </TabsList>

          {learningTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="mt-0">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-8 border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`bg-gradient-to-br ${type.color} p-4 rounded-xl`}>
                    <type.icon className="size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl mb-2">{type.name}</h3>
                    <p className="text-gray-600">{type.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {type.templates.map((template, index) => (
                    <Card
                      key={index}
                      className={`p-6 cursor-pointer transition-all ${
                        selectedTemplate === `${type.id}-${index}`
                          ? 'border-2 border-blue-600 shadow-lg'
                          : 'border-2 border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(`${type.id}-${index}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`bg-gradient-to-r ${type.color} text-white border-0`}>
                          {template.level}
                        </Badge>
                        {selectedTemplate === `${type.id}-${index}` && (
                          <div className="bg-blue-600 rounded-full p-1">
                            <Check className="size-3 text-white" />
                          </div>
                        )}
                      </div>

                      <h4 className="text-lg mb-3">{template.title}</h4>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.keywords.map((keyword, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 mb-4 italic">"{template.prompt}"</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>⏱️ {template.duration}</span>
                        <Zap className="size-4 text-yellow-600" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${type.color} text-white border-0 gap-2`}
                >
                  Mit diesem Template starten <ArrowRight className="size-4" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Custom Prompt Builder Preview */}
      <div className="mt-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="size-12 text-blue-600" />
            <span className="text-4xl">🎮</span>
          </div>
          <h3 className="text-2xl mb-3">Eigenen Lernplan erstellen</h3>
          <p className="text-gray-600 mb-6">
            Oder erstelle deinen komplett individuellen Lernplan mit unserem KI-Assistenten.
            Kombiniere verschiedene Lernstile und Themen nach deinen Wünschen - inklusive
            Gamification mit Achievements und Belohnungen!
          </p>
          <Button size="lg" variant="outline" className="gap-2">
            Custom Lernplan erstellen <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
