import { Brain, Layout, BarChart3, ShoppingBag, Bookmark, Clock } from 'lucide-react';
import { Card } from '../../ui/card';

const features = [
  {
    icon: Brain,
    title: 'KI-Lernpfade',
    description: 'Generiere dynamische Lernpfade zu jedem Thema. Die KI erstellt strukturierte Unterthemen, die du Schritt für Schritt meistern kannst.',
    gradient: 'from-blue-600 to-cyan-500',
    bgHover: 'rgba(59, 130, 246, 0.1)',
    delay: 0.1
  },
  {
    icon: Layout,
    title: 'Templates & Karriere',
    description: 'Starte direkt mit kuratierten Pfaden für Rollen wie "Frontend Developer" oder "Data Scientist". Spare Zeit bei der Planung.',
    gradient: 'from-purple-600 to-pink-500',
    bgHover: 'rgba(147, 51, 234, 0.1)',
    delay: 0.2
  },
  {
    icon: BarChart3,
    title: 'Fortschritt & Statistiken',
    description: 'Verfolge deine Lernzeit, abgeschlossene Themen und deine Daily Streak. Visualisiere deinen Erfolg mit detaillierten Charts.',
    gradient: 'from-emerald-500 to-green-600',
    bgHover: 'rgba(5, 150, 105, 0.1)',
    delay: 0.3
  },
  {
    icon: ShoppingBag,
    title: 'Gamification Store',
    description: 'Sammle Punkte durch Lernen und löse sie gegen exklusive Themes, Badges und Profil-Upgrades ein.',
    gradient: 'from-orange-500 to-red-500',
    bgHover: 'rgba(249, 115, 22, 0.1)',
    delay: 0.4
  },
  {
    icon: Bookmark,
    title: 'Wissensmanagement',
    description: 'Behalte den Überblick über offene und abgeschlossene Themen. Speichere wichtige Inhalte als Lesezeichen für später.',
    gradient: 'from-indigo-500 to-violet-500',
    bgHover: 'rgba(99, 102, 241, 0.1)',
    delay: 0.5
  },
  {
    icon: Clock,
    title: 'Fokus-Modus',
    description: 'Lerne konzentriert mit integriertem Pomodoro-Timer und ablenkungsfreiem Interface für maximale Produktivität.',
    gradient: 'from-teal-500 to-cyan-600',
    bgHover: 'rgba(20, 184, 166, 0.1)',
    delay: 0.6
  }
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight animate-fade-in">
            Lernen, das sich{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              an dich anpasst
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delayed">
            Entdecke eine völlig neue Art zu lernen - individuell, flexibel und immer an deiner Seite.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{
                animationDelay: `${feature.delay}s`,
              }}
            >
              <Card 
                className="h-full p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm cursor-pointer group"
                style={{
                  backgroundColor: `color-mix(in srgb, rgb(17, 24, 39) 50%, white 50%, ${feature.bgHover})`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = feature.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `color-mix(in srgb, rgb(17, 24, 39) 50%, white 50%, ${feature.bgHover})`;
                }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`
                  }}
                >
                  <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
