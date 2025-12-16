import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import locale files directly
import enLanding from './locales/en/landing.json';
import deLanding from './locales/de/landing.json';
import enCommon from './locales/en/common.json';
import deCommon from './locales/de/common.json';

const resources: Record<string, Record<string, unknown>> = {
  en: {
    landing: enLanding,
    common: enCommon,
  },
  de: {
    landing: deLanding,
    common: deCommon,
  },
};

// Debug: log what we're loading
if (typeof window !== 'undefined') {
  console.log(
    '[i18n] Loading resources - keys in deLanding:',
    Object.keys(deLanding || {}).slice(0, 10)
  );
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: resources as unknown as Resource,
    fallbackLng: 'de',
    lng: 'de', // explicitly set initial language to German
    debug: true, // enable debug logging
    interpolation: { escapeValue: false },
    ns: ['landing', 'common'],
    defaultNS: 'landing',
    detection: {
      order: ['localStorage', 'htmlTag', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
