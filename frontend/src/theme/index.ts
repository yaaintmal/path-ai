export type ThemeId = 'theme1' | 'theme2' | 'theme3';

export interface Theme {
  id: ThemeId;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  surfaces?: {
    card?: string;
    popover?: string;
    muted?: string;
    border?: string;
    inputBackground?: string;
  };
  icons: {
    brand: string; // emoji or icon id for now
    badge: string;
  };
  copy?: {
    welcome?: string;
  };
}

export const themes: Record<ThemeId, Theme> = {
  theme1: {
    id: 'theme1',
    name: 'Aktiv',
    colors: {
      primary: '#FFB020',
      secondary: '#7C3AED',
      background: '#fffaf0',
      text: '#1f2937',
      accent: '#ef4444',
    },
    surfaces: {
      card: '#fffaf0',
      popover: '#fffaf0',
      muted: '#fff7ed',
      border: '#fde68a',
      inputBackground: '#fff7ed',
      primaryForeground: '#000000',
      secondaryForeground: '#111827',
      mutedForeground: '#92400e',
      switchBackground: 'rgba(0,0,0,0.04)',
      ring: '#f59e0b',
      sidebar: '#fffaf0',
      sidebarForeground: '#111827',
    },
    icons: { brand: '🎮', badge: '🏅' },
    copy: { welcome: 'Voll aktiv!' },
  },
  theme2: {
    id: 'theme2',
    name: 'Leicht',
    colors: {
      primary: '#3B82F6',
      secondary: '#06B6D4',
      background: '#f8fafc',
      text: '#0f172a',
      accent: '#10B981',
    },
    surfaces: {
      card: '#ffffff',
      popover: '#ffffff',
      muted: '#f1f5f9',
      border: '#e6edf3',
      inputBackground: '#f3f6f9',
      primaryForeground: '#ffffff',
      secondaryForeground: '#0f172a',
      mutedForeground: '#6b7280',
      switchBackground: 'rgba(15, 23, 42, 0.06)',
      ring: '#60a5fa',
      sidebar: '#ffffff',
      sidebarForeground: '#0f172a',
    },
    icons: { brand: '📊', badge: '✨' },
    copy: { welcome: 'Leicht und zugänglich' },
  },
  theme3: {
    id: 'theme3',
    name: 'Klassisch',
    colors: {
      primary: '#111827',
      secondary: '#6B7280',
      background: '#ffffff',
      text: '#111827',
      accent: '#F97316',
    },
    surfaces: {
      card: '#ffffff',
      popover: '#ffffff',
      muted: '#f8fafc',
      border: '#e5e7eb',
      inputBackground: '#f3f4f6',
      primaryForeground: '#111827',
      secondaryForeground: '#374151',
      mutedForeground: '#6b7280',
      switchBackground: 'rgba(15,23,42,0.06)',
      ring: '#fb923c',
      sidebar: '#ffffff',
      sidebarForeground: '#111827',
    },
    icons: { brand: '📚', badge: '🎓' },
    copy: { welcome: 'Klassisch und ruhig' },
  },
};

export function getThemeForGamification(value?: string): Theme {
  switch (value) {
    case 'full':
      return themes.theme1;
    case 'light':
      return themes.theme2;
    case 'none':
    default:
      return themes.theme3;
  }
}
