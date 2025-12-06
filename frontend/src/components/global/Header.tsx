import { Button } from '../../ui/button';
import { Brain, Moon, Sun } from 'lucide-react';
import { UserDashButton } from './UserDashButton';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/useAuth';

interface HeaderProps {
  setShowOnboarding?: (show: boolean) => void;
  setShowRegistration?: (show: boolean) => void;
  setShowOnboardingEditor?: (show: boolean) => void;
  setShowDashboard?: (show: boolean) => void;
  setDashboardMode?: (mode: 'video-translation' | 'learning' | null) => void;
  hasOnboardingData?: boolean;
}

export function Header({
  setShowOnboarding,
  setShowRegistration,
  setShowOnboardingEditor,
  setShowDashboard,
  setDashboardMode,
  hasOnboardingData,
}: HeaderProps) {
  const { user, logout, userDetails } = useAuth();
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);
  const initialIsDark = (() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme === 'dark' || (!savedTheme && prefersDark);
    } catch {
      return false;
    }
  })();
  const [isDarkMode, setIsDarkMode] = useState(initialIsDark);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    if (setShowOnboarding) setShowOnboarding(false);
    if (setShowRegistration) setShowRegistration(false);
    if (setShowOnboardingEditor) setShowOnboardingEditor(false);
    if (setShowDashboard) setShowDashboard(true);
    if (setDashboardMode) setDashboardMode(null);
    window.scrollTo(0, 0);
  };

  const handleEditDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setShowOnboardingEditor) {
      setShowOnboardingEditor(true);
      if (setShowDashboard) setShowDashboard(false);
      if (setShowOnboarding) setShowOnboarding(false);
      if (setShowRegistration) setShowRegistration(false);
      window.scrollTo(0, 0);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setShowOnboarding) setShowOnboarding(false);
    if (setShowRegistration) setShowRegistration(false);
    if (setShowOnboardingEditor) setShowOnboardingEditor(false);
    if (setShowDashboard) setShowDashboard(false);
    window.scrollTo(0, 0);
  };

  const handleRegistrationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setShowRegistration) {
      setShowRegistration(true);
      window.scrollTo(0, 0);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    if (setShowOnboarding) setShowOnboarding(false);
    if (setShowRegistration) setShowRegistration(false);
    if (setShowOnboardingEditor) setShowOnboardingEditor(false);
    if (setShowDashboard) setShowDashboard(false);
    if (setDashboardMode) setDashboardMode(null);
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
          {!user && (
            <>
              <a
                href="#languages"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Languages
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
            </>
          )}
          {user && <UserDashButton onClick={handleDashboardClick} />}
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
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Hey, {user.name}
                </span>
                {/* Inventory: show streak shields */}
                {userDetails?.inventory && userDetails.inventory['6'] > 0 && (
                  <div className="text-xs bg-gray-100 dark:bg-gray-800/50 rounded-md px-2 py-0.5 flex items-center gap-1">
                    <span title="Streak Shields">🛡️</span>
                    <span>{userDetails.inventory['6']}</span>
                  </div>
                )}
                {userDetails?.inventory && userDetails.inventory['8'] > 0 && (
                  <div className="text-xs bg-gray-100 dark:bg-gray-800/50 rounded-md px-2 py-0.5 flex items-center gap-1">
                    <span title="Confetti">🎉</span>
                    <span>{userDetails.inventory['8']}</span>
                  </div>
                )}
                {/* Active boosts */}
                {userDetails?.activeBoosts && userDetails.activeBoosts.length > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    {userDetails.activeBoosts.map((b, i) => {
                      const expires = new Date(b.expiresAt);
                      const hours = Math.max(
                        0,
                        Math.ceil((expires.getTime() - now) / (1000 * 60 * 60))
                      );
                      return (
                        <div
                          key={i}
                          className="bg-yellow-50 dark:bg-yellow-900/10 rounded-md px-2 py-0.5 flex items-center gap-1"
                        >
                          <span>⚡</span>
                          <span>
                            {b.multiplier}x • {hours}h
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                className="dark:text-gray-300 dark:hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
              {/* compact dormancy: small-screen dash button */}
              <UserDashButton onClick={handleDashboardClick} compact className="md:hidden" />
            </>
          ) : (
            <Button
              variant="ghost"
              className="dark:text-gray-300 dark:hover:text-white"
              onClick={handleRegistrationClick}
            >
              Sign In
            </Button>
          )}
          {user && (
            <>
              <Button
                onClick={hasOnboardingData ? handleEditDashboardClick : handleDashboardClick}
                className="hidden md:flex"
              >
                {hasOnboardingData ? 'Dashboard anpassen' : 'Dashboard erstellen'}
              </Button>
              <Button
                onClick={hasOnboardingData ? handleEditDashboardClick : handleDashboardClick}
                className="md:hidden"
              >
                {hasOnboardingData ? 'Anpassen' : 'Start'}
              </Button>
            </>
          )}
          {!user && (
            <>
              <Button onClick={handleRegistrationClick} className="hidden md:flex">
                create dashboard
              </Button>
              <Button onClick={handleRegistrationClick} className="md:hidden">
                Start
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
