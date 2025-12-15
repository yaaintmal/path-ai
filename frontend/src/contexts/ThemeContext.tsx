import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { themes, getThemeForGamification } from '../theme';
import type { Theme, ThemeId } from '../theme';
import { useAuth } from './useAuth';

interface ThemeContextType {
  theme: Theme;
  setThemeById: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { userDetails } = useAuth();
  // default to theme2 as requested
  const defaultTheme = themes.theme2;
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // when userDetails changes, update theme from onboarding preferences if available
  useEffect(() => {
    // Prefer explicit themeId if present; fallback to gamification mapping for older entries
    const themeId = (userDetails?.onboardingData as any)?.themeId as string | undefined;
    if (themeId) {
      const t = (themes as any)[themeId] ?? defaultTheme;
      setTheme(t);
      return;
    }
    const gam = userDetails?.onboardingData?.gamification as string | undefined;
    if (gam) {
      const t = getThemeForGamification(gam);
      setTheme(t);
    }
  }, [userDetails]);

  // Apply theme colors as CSS variables on :root
  useEffect(() => {
    const root = document.documentElement;
    // Set both themed names and the generic names expected by Tailwind
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    // Only override the global background/foreground when NOT in dark mode so we don't
    // accidentally overwrite the user's chosen dark palette.
    const isDark = root.classList.contains('dark');
    root.style.setProperty('--theme-background', theme.colors.background);
    if (!isDark) {
      root.style.setProperty('--background', theme.colors.background);
      root.style.setProperty('--theme-text', theme.colors.text);
      root.style.setProperty('--foreground', theme.colors.text);
    }
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--accent', theme.colors.accent);
    // brand icon and some copy text (as plain strings) for easy use in components
    root.style.setProperty('--brand-icon', theme.icons.brand);
    root.style.setProperty('--theme-welcome', theme.copy?.welcome || '');
    // surface tokens (card, popover, muted, border, input-bg)
    if ((theme as any).surfaces) {
      const s = (theme as any).surfaces as Record<string, string>;
      if (s.card) root.style.setProperty('--card', s.card);
      if (s.popover) root.style.setProperty('--popover', s.popover);
      if (s.muted) root.style.setProperty('--muted', s.muted);
      if (s.border) root.style.setProperty('--border', s.border);
      if (s.inputBackground) root.style.setProperty('--input-background', s.inputBackground);
      if (s.primaryForeground) root.style.setProperty('--primary-foreground', s.primaryForeground);
      if (s.secondaryForeground)
        root.style.setProperty('--secondary-foreground', s.secondaryForeground);
      if (s.mutedForeground) root.style.setProperty('--muted-foreground', s.mutedForeground);
      if (s.switchBackground) root.style.setProperty('--switch-background', s.switchBackground);
      if (s.ring) root.style.setProperty('--ring', s.ring);
      if (s.sidebar) root.style.setProperty('--sidebar', s.sidebar);
      if (s.sidebarForeground) root.style.setProperty('--sidebar-foreground', s.sidebarForeground);
    }
    // Expose dataset flags for conditional rendering in components
    root.dataset.theme = theme.id;
    // If the user preference specifies classic background, components can set dataset.showClassic
    const showClassic = (window as any).__themePrefShowClassic;
    if (showClassic) {
      root.dataset.showClassic = 'true';
    } else {
      delete root.dataset.showClassic;
    }
  }, [theme]);

  const setThemeById = (id: ThemeId) => {
    const t = themes[id] ?? defaultTheme;
    setTheme(t);
  };

  const value = useMemo(() => ({ theme, setThemeById }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
