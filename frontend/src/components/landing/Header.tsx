import { Button } from '../../ui/button';
import { Moon, Sun } from 'lucide-react';
import Antigravity from '../Antigravity';
import config from '../../config/app.config';
import { useTheme } from 'next-themes';
import { useAuth } from '../../contexts/useAuth';

interface HeaderProps {
  setShowOnboarding?: (show: boolean) => void;
  setShowRegistration?: (show: boolean) => void;
}

export function Header({ setShowOnboarding, setShowRegistration }: HeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // debugHyperspeed not used anymore as Hyperspeed removed
  // const debugHyperspeed = typeof window !== 'undefined' && window.location.search.includes('debugHyperspeed=1');
  

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
    <header className="relative border-b bg-background/80 dark:bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      {/* Full header background */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <Antigravity
          count={400}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color={
            resolvedTheme === 'dark'
              ? ['#FFEB99', '#FFD54F', '#FFC107', '#FFB300']
              : ['#FFEE99', '#FFD54F', '#FFC107', '#FFB300']
          }
          autoAnimate={true}
          particleVariance={0.8}
        />
      </div>
      <div className="w-full py-7 flex items-center justify-center gap-4 relative z-10 min-h-[84px]">
        {/* Left - Logo on small/medium screens */}
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer lg:hidden">
          <div className="lg:hidden">
            <span className="text-xl bg-gradient-to-r from-red-300 via-red-500 to-purple-600 bg-clip-text text-transparent">{config.app.name}</span>
            {user && <p className="text-sm text-muted-foreground mt-1">Hey, {user.name}</p>}
          </div>
        </a>

        {/* Centered Title and Navigation */}
        <div className="hidden lg:flex flex-col items-center text-center">
          <a href="/" onClick={handleLogoClick}>
            <span className="text-xl font-bold bg-gradient-to-r from-red-300 via-red-500 to-purple-600 bg-clip-text text-transparent">{config.app.name}</span>
            <p className="text-xs text-muted-foreground -mt-1">Free Knowledge for Everybody</p>
            {user && <p className="text-sm text-muted-foreground mt-1">Hey, {user.name}</p>}
          </a>
        </div>
        
        {/* Navigation on md+ */}
        <nav className="hidden md:flex justify-center items-center gap-8">
          <a href="#languages" className="text-muted-foreground hover:text-foreground transition-colors">Sprachen</a>
          <a href="#gamification" className="text-muted-foreground hover:text-foreground transition-colors">Gamification</a>
          <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">Templates</a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#dashboard" onClick={handleDashboardClick} className="text-primary hover:text-primary-foreground transition-colors">Dein Dashboard</a>
        </nav>

        {/* Centered Actions */}
        <div className="flex items-center justify-center gap-3 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
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
