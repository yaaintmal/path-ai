import { Button } from '../../ui/button';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  Gamepad2,
  GraduationCap,
  Users,
} from 'lucide-react';
/* import { ImageWithFallback } from "./figma/ImageWithFallback";*/
import { useState, useEffect } from 'react';
import { Badge } from '../../ui/badge';

interface HeroProps {
  setShowOnboarding?: (show: boolean) => void;
}

const featureSlides = [
  {
    badge: 'KI-Powered',
    icon: Sparkles,
    title: 'Personalisierte Lernpläne',
    description:
      'Unsere KI erstellt individuell auf dich zugeschnittene Lernpläne basierend auf deinen Zielen und deinem Lerntyp.',
    color: 'from-blue-600 to-purple-600',
    preview: {
      question: 'Was möchtest du lernen?',
      answer: 'React und TypeScript für Webentwicklung',
      response:
        'Perfekt! Ich erstelle dir einen 8-wöchigen Lernplan mit den besten YouTube-Tutorials und interaktiven Übungen.',
    },
  },
  {
    badge: '100+ Sprachen',
    icon: Globe,
    title: 'Inhalte automatisch lokalisiert',
    description:
      'Lerne in jeder Sprache! Lernressourcen werden automatisch lokalisiert - mit Untertiteln und synchronisierter Übersetzung.',
    color: 'from-green-600 to-emerald-600',
    preview: {
      question: 'Sprache wählen',
      answer: '🇩🇪 Deutsch → 🇯🇵 Japanisch',
      response: 'Inhalt wird übersetzt... Untertitel werden synchronisiert. Bereit zum Lernen!',
    },
  },
  {
    badge: 'Gamification',
    icon: Gamepad2,
    title: 'Punkte & Achievements',
    description:
      'Sammle Punkte, schalte Achievements frei und tausche Belohnungen ein. Lernen wird zum Abenteuer!',
    color: 'from-yellow-600 to-orange-600',
    preview: {
      question: 'Deine heutigen Erfolge',
      answer: '🏆 250 Punkte gesammelt • 3 Achievements',
      response: 'Fantastisch! Du kannst jetzt neue Avatare und Themes freischalten. Weiter so! 🎮',
    },
  },
  {
    badge: 'LearnBuddy',
    icon: GraduationCap,
    title: 'Für Schulkinder optimiert',
    description:
      'Kindgerechte Erklärungen, spielerisches Lernen und Entdeckung des eigenen Lerntyps - für bessere Noten!',
    color: 'from-pink-600 to-red-600',
    preview: {
      question: 'Mathe-Hausaufgaben',
      answer: 'Quadratische Gleichungen Klasse 9',
      response:
        'Cool! Ich zeige dir das Schritt für Schritt mit anschaulichen Beispielen. Du schaffst das! 🎯',
    },
  },
  {
    badge: 'Für Lehrkräfte',
    icon: Users,
    title: 'Klassenverwaltung & KI-Tools',
    description:
      'Verwalte deine Klassen, bereite Unterricht mit KI vor und erhalte individuelle Schüler-Insights.',
    color: 'from-indigo-600 to-purple-600',
    preview: {
      question: 'Klasse 8b - Status',
      answer: '24 Schüler • 6 brauchen Hilfe',
      response:
        'Individuelle Lernpläne wurden für 3 Schüler erstellt. Unterrichtseinheit ist vorbereitet. ✓',
    },
  },
];

export function Hero({ setShowOnboarding }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleDashboardClick = () => {
    if (setShowOnboarding) {
      setShowOnboarding(true);
      window.scrollTo(0, 0);
    }
  };

  const currentFeature = featureSlides[currentSlide];
  const IconComponent = currentFeature.icon;

  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <Sparkles className="size-4" />
            <span className="text-sm">KI-gestütztes Lernen</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-foreground">
            Dein persönlicher{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KI-Lernplan
            </span>{' '}
            in jeder Sprache
          </h1>
          <p className="text-xl text-muted-foreground">
            'Keine vorgefertigten Kurse. Wähle aus fertigen Templates für deinen Lerntyp oder
            erstelle einen komplett individuellen Lernplan mit unserer KI. Lerne mit vielfältigen
            Lernressourcen (automatisch lokalisiert!) oder interaktiv mit unserer KI.',
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2">
              Templates entdecken <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDashboardClick}
              className="dark:border-border dark:text-muted-foreground dark:hover:bg-accent/50"
            >
              Custom Lernplan erstellen
            </Button>
          </div>
          <div className="flex items-center gap-8 pt-4">
            <div>
              <div className="text-2xl text-foreground">10.000+</div>
              <div className="text-sm text-muted-foreground">Aktive Lernende</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-2xl text-foreground">4.8/5</div>
              <div className="text-sm text-muted-foreground">Bewertung</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-2xl text-foreground">50+</div>
              <div className="text-sm text-muted-foreground">Themengebiete</div>
            </div>
          </div>
        </div>

        {/* Feature Slider */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20" />
          <div className="relative bg-card rounded-3xl shadow-2xl p-8 space-y-4 border border-border">
            {/* Slide Content */}
            <div className="min-h-[400px]">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`size-12 bg-gradient-to-br ${currentFeature.color} rounded-full flex items-center justify-center text-white`}
                >
                  <IconComponent className="size-6" />
                </div>
                <div className="flex-1">
                  <Badge
                    className={`bg-gradient-to-r ${currentFeature.color} text-white border-0 mb-1`}
                  >
                    {currentFeature.badge}
                  </Badge>
                  <h3 className="text-lg text-foreground">{currentFeature.title}</h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">{currentFeature.description}</p>

              <div className="space-y-3">
                <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    {currentFeature.preview.question}
                  </div>
                  <div className="bg-card rounded-lg p-3 border-2 border-blue-600 dark:bg-card dark:text-foreground">
                    {currentFeature.preview.answer}
                  </div>
                </div>
                <div
                  className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`bg-gradient-to-br ${currentFeature.color} p-1.5 rounded-lg flex-shrink-0 mt-1`}
                    >
                      <IconComponent className="size-4 text-white" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentFeature.preview.response}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-5 text-muted-foreground" />
              </button>

              <div className="flex items-center gap-2">
                {featureSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'w-8 bg-gradient-to-r ' + currentFeature.color
                        : 'w-2 bg-muted/40 dark:bg-muted-foreground'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
