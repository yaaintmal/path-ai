import { createContext, useState, useEffect, type ReactNode } from 'react';
import { translations } from '../translations';
import i18n from '../i18n';

export type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string | string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved === 'de' || saved === 'en') return saved;
      // Default to browser language or German
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'en' ? 'en' : 'de';
    }
    return 'de';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // sync i18n when language context changes
    try {
      i18n.changeLanguage(language);
    } catch (e) {
      // ignore
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // also change i18n immediately
    try {
      i18n.changeLanguage(lang);
    } catch (e) {
      // ignore
    }
  };

  // Translation function with nested path support (e.g., 'nav.start')
  // Returns string or array depending on the translation value
  const t = (path: string): string | string[] => {
    const keys = path.split('.');
    let value: unknown = translations[language];

    for (const key of keys) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        value = (value as Record<string, unknown>)[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      // Fallback to German if translation not found
      value = translations.de;
      for (const fallbackKey of keys) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          value = undefined;
          break;
        }
      }
    }

    if (value === undefined || (typeof value === 'object' && !Array.isArray(value))) {
      return path;
    }

    return value as string | string[];
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export { LanguageContext };
