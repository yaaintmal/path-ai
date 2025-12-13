import { Button } from '../../ui/button';
import { Moon, Sun, Edit, LogOut, User, Shield, Sparkles, Zap } from 'lucide-react';
import { UserDashButton } from './UserDashButton';
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
  const { setTheme, resolvedTheme } = useTheme();
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Left Section: Logo & Branding */}
        <div className="flex items-center gap-4">
          <a href="/" onClick={handleLogoClick} className="flex flex-col group">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 bg-clip-text text-transparent tracking-tight group-hover:opacity-80 transition-opacity">
              {config.app.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium group-hover:text-foreground transition-colors">
              Free Knowledge for Everybody
            </span>
          </a>
        </div>

        {/* Center Section: Navigation (Desktop) */}
        {!user && (
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
          </nav>
        )}

        {/* Right Section: User Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Desktop Stats Pill */}
              <div className="hidden md:flex items-center gap-3 bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50 rounded-full pl-1 pr-4 py-1">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                  <User className="size-4 text-primary" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{user.name}</span>
                    {userDetails && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
                        Lvl {calculateLevel(userDetails.totalScore || 0).level}
                      </span>
                    )}
                  </div>
                  {/* Mini Progress Bar */}
                  {userDetails && (
                    <div className="w-24 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{
                          width: `${calculateLevel(userDetails.totalScore || 0).progressPercent}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Badges (Hidden on smaller desktop, visible on large) */}
                <div className="hidden xl:flex items-center gap-2 ml-2 border-l border-border/50 pl-2">
                  {/* Inventory Icons */}
                  {userDetails?.inventory && userDetails.inventory['6'] > 0 && (
                    <div
                      className="text-xs flex items-center gap-1 text-muted-foreground"
                      title="Shields"
                    >
                      <Shield className="size-3" /> {userDetails.inventory['6']}
                    </div>
                  )}
                  {userDetails?.inventory && userDetails.inventory['8'] > 0 && (
                    <div
                      className="text-xs flex items-center gap-1 text-muted-foreground"
                      title="Sparkles"
                    >
                      <Sparkles className="size-3" /> {userDetails.inventory['8']}
                    </div>
                  )}
                  {userDetails?.activeBoosts && userDetails.activeBoosts.length > 0 && (
                    <div
                      className="text-xs flex items-center gap-1 text-amber-500"
                      title="Active Boosts"
                    >
                      <Zap className="size-3" /> {userDetails.activeBoosts.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="rounded-full hover:bg-secondary/80"
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="size-5" />
                  ) : (
                    <Moon className="size-5" />
                  )}
                </Button>

                <UserDashButton compact onClick={handleDashboardClick} className="rounded-full" />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={hasOnboardingData ? handleEditDashboardClick : handleDashboardClick}
                  className="rounded-full hover:bg-secondary/80 hidden sm:flex"
                >
                  <Edit className="size-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={toggleDarkMode} size="icon" className="rounded-full">
                {resolvedTheme === 'dark' ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>
              <Button variant="ghost" onClick={handleRegistrationClick} className="font-medium">
                Anmelden
              </Button>
              <Button
                onClick={handleDashboardClick}
                className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Start Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
