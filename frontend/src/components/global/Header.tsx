import { Button } from '../../ui/button';
import {
  Moon,
  Sun,
  Edit,
  LogOut,
  User,
  Trophy,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { UserDashButton } from './UserDashButton';
import Antigravity from '../Antigravity';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '../../contexts/useAuth';
import config from '../../config/app.config';

interface HeaderProps {
  setShowOnboarding?: (show: boolean) => void;
  setShowRegistration?: (show: boolean) => void;
  setShowOnboardingEditor?: (show: boolean) => void;
  setShowDashboard?: (show: boolean) => void;
  setDashboardMode?: (mode: 'learning' | 'statistics' | null) => void;
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
  const { setTheme, resolvedTheme } = useTheme();
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);
  // useTheme manages theme with next-themes; use `resolvedTheme` for UI

  // Helper function to calculate level and progress
  const calculateLevel = (exp: number) => {
    const baseExp = 100;
    const level = Math.floor(exp / baseExp) + 1;
    const currentLevelExp = exp % baseExp;
    const progressPercent = (currentLevelExp / baseExp) * 100;
    const nextLevelExp = baseExp - currentLevelExp;
    return { level, progressPercent, nextLevelExp, currentLevelExp };
  };

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Debug flag not needed anymore
  // const debugHyperspeed = typeof window !== 'undefined' && window.location.search.includes('debugHyperspeed=1');

  // Removed Hyperspeed options (we now use Antigravity background)

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
    <header className="relative border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      {/* Antigravity background fills the entire header behind the content */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <Antigravity
          count={160}
          magnetRadius={6}
          ringRadius={5}
          waveSpeed={0.35}
          waveAmplitude={0.8}
          particleSize={1}
          lerpSpeed={0.04}
          color={
            resolvedTheme === 'dark'
              ? ['#FFEB99', '#FFD54F', '#FFC107', '#FFB300']
              : ['#FFEE99', '#FFD54F', '#FFC107', '#FFB300']
          }
          autoAnimate={true}
          particleVariance={0.6}
        />
      </div>
      <div className="w-full px-4 py-6 relative z-10 min-h-[76px] flex items-center justify-center gap-4">
        {/* Left - Logo on small/medium screens */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer group lg:hidden"
        >
          <div className="hidden sm:block">
            <span className="text-xl font-bold bg-gradient-to-r from-red-300 via-red-500 to-purple-600 bg-clip-text text-transparent">{config.app.name}</span>
            <p className="text-xs text-muted-foreground -mt-1">Free Knowledge for Everybody</p>
            {user && (
              <p className="text-sm text-muted-foreground mt-1">Hey, {user.name}</p>
            )}
          </div>
        </a>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {!user && (
            <>
              <a
                href="#languages"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Languages
              </a>
              <a
                href="#gamification"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Gamification
              </a>
              <a
                href="#templates"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Templates
              </a>
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Features
              </a>
            </>
          )}
        </nav>

        {/* Centered User Panel and Actions */}
        <div className="flex items-center justify-center gap-3 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">

            {user ? (
              <div className="flex items-center gap-3">
                {/* Desktop User Panel */}
                <div className="hidden md:flex items-center gap-4 bg-card border border-border rounded-2xl px-4 py-2 shadow-sm">
                  {/* App Title & Greeting */}
                  <div className="flex flex-col items-start pr-4 border-r border-border">
                    <span className="text-lg font-bold bg-gradient-to-r from-red-300 via-red-500 to-purple-600 bg-clip-text text-transparent">{config.app.name}</span>
                    <p className="text-xs text-muted-foreground -mt-1">Free Knowledge for Everybody</p>
                    <p className="text-sm text-muted-foreground mt-1">Hey, {user.name}</p>
                  </div>

                  {/* User Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="size-4 text-primary" />
                    </div>
                    <div>
                      {userDetails && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Trophy className="size-3" />
                          <span>Level {calculateLevel(userDetails.totalScore || 0).level}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Experience Progress Bar */}
                  {userDetails && (
                    <div className="flex-1 min-w-24">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">EXP</span>
                        <span className="text-xs font-medium text-foreground">
                          {calculateLevel(userDetails.totalScore || 0).currentLevelExp}/100
                        </span>
                      </div>
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${calculateLevel(userDetails.totalScore || 0).progressPercent}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Inventory & Boosts */}
                  <div className="flex items-center gap-2">
                    {userDetails?.inventory && userDetails.inventory['6'] > 0 && (
                      <div className="flex items-center gap-1 text-xs bg-card-foreground/5 dark:bg-card-foreground/30 rounded-lg px-2 py-1">
                        <Shield className="size-3" />
                        <span>{userDetails.inventory['6']}</span>
                      </div>
                    )}
                    {userDetails?.inventory && userDetails.inventory['8'] > 0 && (
                      <div className="flex items-center gap-1 text-xs bg-card-foreground/5 dark:bg-card-foreground/30 rounded-lg px-2 py-1">
                        <Sparkles className="size-3" />
                        <span>{userDetails.inventory['8']}</span>
                      </div>
                    )}
                    {userDetails?.activeBoosts && userDetails.activeBoosts.length > 0 && (
                      <div className="flex items-center gap-1">
                        {userDetails.activeBoosts.map((b, i) => {
                          const expires = new Date(b.expiresAt);
                          const hours = Math.max(
                            0,
                            Math.ceil((expires.getTime() - now) / (1000 * 60 * 60))
                          );
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-1 text-xs bg-yellow-50 dark:bg-yellow-900/10 rounded-lg px-2 py-1"
                            >
                              <Zap className="size-3" />
                              <span>
                                {b.multiplier}x • {hours}h
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                    <UserDashButton
                      compact
                      className="!px-2 !py-1"
                      onClick={handleDashboardClick}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={hasOnboardingData ? handleEditDashboardClick : handleDashboardClick}
                      className="gap-1.5"
                    >
                      <Edit className="size-3.5" />
                      <span className="hidden xl:inline">
                        {hasOnboardingData ? 'Anpassen' : 'Erstellen'}
                      </span>
                    </Button>
                    {/* Add theme toggle adjacent to action buttons for quick access */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleDarkMode}
                      className="rounded-full"
                      aria-label="Toggle Dark Mode"
                    >
                      {resolvedTheme === 'dark' ? (
                        <Sun className="size-4 text-muted-foreground" />
                      ) : (
                        <Moon className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                      <LogOut className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* Mobile User Controls */}
                <div className="flex md:hidden items-center gap-2">
                  {/* Mobile App Title */}
                  <div className="flex flex-col items-start mr-2 pr-2 border-r border-border">
                    <span className="text-sm font-bold bg-gradient-to-r from-red-300 via-red-500 to-purple-600 bg-clip-text text-transparent">{config.app.name}</span>
                    <p className="text-xs text-muted-foreground -mt-1">Hey, {user.name}</p>
                  </div>

                  <UserDashButton compact onClick={handleDashboardClick} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={hasOnboardingData ? handleEditDashboardClick : handleDashboardClick}
                    aria-label={hasOnboardingData ? 'Anpassen' : 'Start'}
                  >
                    <Edit className="size-4" />
                  </Button>
                  {/* Theme toggle for mobile user controls */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="rounded-full"
                    aria-label="Toggle Dark Mode"
                  >
                    {resolvedTheme === 'dark' ? (
                      <Sun className="size-4 text-muted-foreground" />
                    ) : (
                      <Moon className="size-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleRegistrationClick}
                >
                  Anmelden
                </Button>
                <Button onClick={handleDashboardClick} className="hidden sm:flex">
                  Dashboard erstellen
                </Button>
                <Button onClick={handleDashboardClick} className="sm:hidden">
                  Start
                </Button>
              </div>
            )}
          </div>
      </div>
    </header>
  );
}
