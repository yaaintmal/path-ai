import { Button } from '../../ui/button';
import { BookOpen, Moon, Sun } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
            <BookOpen className="size-6 text-white" />
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
