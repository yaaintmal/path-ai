import { Button } from '../../ui/button';
import { BookOpen, Moon, Sun } from 'lucide-react';
import Hyperspeed from '../Hyperspeed';
import config from '../../config/app.config';
import { useTheme } from 'next-themes';

interface HeaderProps {
  setShowOnboarding?: (show: boolean) => void;
  setShowRegistration?: (show: boolean) => void;
}

export function Header({ setShowOnboarding, setShowRegistration }: HeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const debugHyperspeed =
    typeof window !== 'undefined' && window.location.search.includes('debugHyperspeed=1');

  const hyperspeedEffectOptions =
    resolvedTheme === 'dark'
      ? {
          distortion: 'turbulentDistortion',
          length: 170,
          roadWidth: 8,
          isHyper: true,
          colors: {
            roadColor: 0x000000,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            leftCars: [0xff00ff, 0xff8800],
            rightCars: [0x00ffff, 0x0ed4ff],
            sticks: 0x00ffff,
          },
        }
      : {
          distortion: 'turbulentDistortion',
          length: 120,
          roadWidth: 10,
          isHyper: true,
          colors: {
            roadColor: 0xf8fafc,
            islandColor: 0xf8fafc,
            background: 0xffffff,
            leftCars: [0x0ea5a0, 0x2563eb],
            rightCars: [0x06b6d4, 0x0ea5a0],
            sticks: 0x93c5fd,
          },
        };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setShowOnboarding) {
      setShowOnboarding(true);
      window.scrollTo(0, 0);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setShowOnboarding && setShowRegistration) {
      setShowOnboarding(false);
      setShowRegistration(false);
      window.scrollTo(0, 0);
    }
  };

  const handleRegistrationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setShowRegistration) {
      setShowRegistration(true);
      window.scrollTo(0, 0);
    }
  };

  return (
    <header className="border-b bg-background/80 dark:bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5 flex items-center justify-between">
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
              <Hyperspeed containerId="lights-landing" effectOptions={hyperspeedEffectOptions} />
            </div>
            <div
              className={`relative z-10 flex items-center justify-center w-full h-full p-2 rounded-lg ${
                debugHyperspeed
                  ? 'bg-transparent'
                  : 'bg-gradient-to-br from-blue-600/20 to-purple-600/20'
              }`}
              aria-hidden={debugHyperspeed}
            >
              <BookOpen
                className={`size-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-foreground'}`}
              />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {/* reserved space for general info */}
            <div className="min-w-[140px] text-sm text-muted-foreground hidden md:block truncate" />
          </div>
          <span className="text-xl dark:text-white">{config.app.name}</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#languages"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sprachen
          </a>
          <a
            href="#gamification"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Gamification
          </a>
          <a
            href="#templates"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Templates
          </a>
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#dashboard"
            onClick={handleDashboardClick}
            className="text-primary hover:text-primary-foreground transition-colors"
          >
            Dein Dashboard
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
            aria-label="Toggle Dark Mode"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="size-5 text-muted-foreground" />
            ) : (
              <Moon className="size-5 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleRegistrationClick}
          >
            Anmelden
          </Button>
          <Button onClick={handleDashboardClick} className="hidden md:flex">
            Dashboard erstellen
          </Button>
          <Button onClick={handleDashboardClick} className="md:hidden">
            Start
          </Button>
        </div>
      </div>
    </header>
  );
}
