import { Button } from '../../ui/button';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  GraduationCap,
  Users,
} from 'lucide-react';
/* import { ImageWithFallback } from "./figma/ImageWithFallback";*/
import { useState, useEffect, useContext } from 'react';
import { Badge } from '../../ui/badge';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

interface HeroProps {
  setShowOnboarding?: (show: boolean) => void;
}

const featureSlides = [
  {
    badge: 'KI-Lernpfade',
    icon: Sparkles,
    title: 'Dein persönlicher Lernweg',
    description:
      'Unsere KI generiert individuelle Lernpfade für jedes Thema - basierend auf deinen Zielen und Vorkenntnissen.',
    color: 'from-blue-600 to-purple-600',
    preview: {
      question: 'Was möchtest du lernen?',
      answer: 'React und TypeScript',
      response:
        'Ich habe einen Lernpfad mit 12 Modulen für dich erstellt. Wir starten mit den Grundlagen und bauen darauf auf.',
    },
  },
  {
    badge: 'Store & Belohnungen',
    icon: Gamepad2,
    title: 'Lernen lohnt sich',
    description:
      'Sammle Punkte für jeden Fortschritt. Tausche sie im Store gegen XP-Boosts, Streak Shields und exklusive Profil-Frames.',
    color: 'from-yellow-600 to-orange-600',
    preview: {
      question: 'Store',
      answer: '💎 2500 Punkte verfügbar',
      response:
        'Du hast dir "Double XP Boost (24h)" gekauft! Deine nächsten Lektionen geben doppelte Punkte. 🚀',
    },
  },
  {
    badge: 'Templates',
    icon: GraduationCap,
    title: 'Bewährte Lernstrukturen',
    description:
      'Nutze vorgefertigte Templates für beliebte Themen wie "MERN Stack" oder "AWS Cloud Engineer" für den optimalen Start.',
    color: 'from-green-600 to-emerald-600',
    preview: {
      question: 'Template wählen',
      answer: 'MERN Full-Stack Developer',
      response:
        'Template geladen! Der Pfad umfasst 15 Themen von JavaScript Basics bis Deployment. Lass uns loslegen!',
    },
  },
  {
    badge: 'Fortschritt',
    icon: Users,
    title: 'Alles im Blick',
    description:
      'Verfolge deine Streaks, gesammelten Punkte und gemeisterten Themen in deinem persönlichen Dashboard.',
    color: 'from-pink-600 to-red-600',
    preview: {
      question: 'Statistik',
      answer: '🔥 7-Tage Streak',
      response:
        'Starke Leistung! Du hast diese Woche 5 Themen abgeschlossen und bist im Level aufgestiegen.',
    },
  },
];

export function Hero({ setShowOnboarding }: HeroProps) {
  const { t } = useTranslation('landing');
  const langCtx = useContext(LanguageContext);
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

  const slides = t('hero.slides', { returnObjects: true }) as Array<{
    badge?: string;
    title?: string;
    description?: string;
    preview?: { question?: string; answer?: string; response?: string };
  }>;
  const currentFeature = { ...featureSlides[currentSlide], ...(slides && slides[currentSlide]) };
  const IconComponent = currentFeature.icon;

  return (
    <section className="relative overflow-hidden py-20 md:py-32 min-h-screen bg-background">
      {/* Decorative antigravity background has been removed per request. Gradient retained for readability. */}

      {/* Gradient Overlay for readability */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: -5,
          background:
            'linear-gradient(to bottom, rgba(var(--background-rgb), 0.8), rgba(var(--background-rgb), 0.5), rgba(var(--background-rgb), 0.8))',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
                <Sparkles className="size-4" />
                <span className="text-sm">{t('hero.badge')}</span>
              </div>

              {/* Language Toggle */}
              <div className="inline-flex items-center gap-2 bg-card rounded-full p-1">
                <button
                  data-testid="lang-de"
                  onClick={() => langCtx?.setLanguage('de')}
                  className={`px-3 py-1 rounded-full ${langCtx?.language === 'de' ? 'bg-amber-500 text-white' : ''}`}
                >
                  DE
                </button>
                <button
                  data-testid="lang-en"
                  onClick={() => langCtx?.setLanguage('en')}
                  className={`px-3 py-1 rounded-full ${langCtx?.language === 'en' ? 'bg-amber-500 text-white' : ''}`}
                >
                  EN
                </button>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl text-foreground">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {t('hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">{t('hero.description')}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                {t('hero.cta.templates')} <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDashboardClick}
                className="dark:border-border dark:text-muted-foreground dark:hover:bg-accent/50"
              >
                {t('hero.cta.createCustom')}
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl text-foreground">{t('hero.metrics.activeUsers')}</div>
                <div className="text-sm text-muted-foreground">
                  {t('hero.metrics.activeUsersLabel')}
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-2xl text-foreground">{t('hero.metrics.rating')}</div>
                <div className="text-sm text-muted-foreground">{t('hero.metrics.ratingLabel')}</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-2xl text-foreground">{t('hero.metrics.topics')}</div>
                <div className="text-sm text-muted-foreground">{t('hero.metrics.topicsLabel')}</div>
              </div>
            </div>
          </div>

          {/* Feature Slider */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur-3xl opacity-20" />
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
                    className={`bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800`}
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
      </div>
    </section>
  );
}
