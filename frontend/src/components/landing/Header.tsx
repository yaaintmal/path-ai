import { Button } from '../../ui/button';
import { Brain, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  setShowOnboarding?: (show: boolean) => void;
  setShowRegistration?: (show: boolean) => void;
}

export function Header({ setShowOnboarding, setShowRegistration }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a preference saved
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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
    <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
            <Brain className="size-6 text-white" />
          </div>
          <span className="text-xl dark:text-white">PathStudio AI</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#languages"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Sprachen
          </a>
          <a
            href="#gamification"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Gamification
          </a>
          <a
            href="#templates"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Templates
          </a>
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#dashboard"
            onClick={handleDashboardClick}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
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
            {isDarkMode ? (
              <Sun className="size-5 text-gray-300" />
            ) : (
              <Moon className="size-5 text-gray-600" />
            )}
          </Button>
          <Button
            variant="ghost"
            className="dark:text-gray-300 dark:hover:text-white"
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
