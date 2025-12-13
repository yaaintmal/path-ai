import { Button } from '../../ui/button';
import { Moon, Sun } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Left Section: Logo & Branding */}
        <div className="flex items-center gap-4">
          <a href="/" onClick={handleLogoClick} className="flex flex-col group">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-purple-600 bg-clip-text text-transparent tracking-tight group-hover:opacity-80 transition-opacity">
              {config.app.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium group-hover:text-foreground transition-colors">
              Free Knowledge for Everybody
            </span>
          </a>
        </div>

        {/* Center Section: Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
          {['Languages', 'Gamification', 'Templates', 'Features'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
          <a
            href="#dashboard"
            onClick={handleDashboardClick}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors relative group"
          >
            Dein Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </a>
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full hover:bg-secondary/80"
          >
            {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Button variant="ghost" className="font-medium" onClick={handleRegistrationClick}>
            Anmelden
          </Button>
          <Button
            onClick={handleDashboardClick}
            className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hidden md:flex"
          >
            Dashboard erstellen
          </Button>
          <Button onClick={handleDashboardClick} className="rounded-full px-4 md:hidden">
            Start
          </Button>
        </div>
      </div>
    </header>
  );
}
