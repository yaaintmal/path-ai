import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../../locales/en/landing.json';
import de from '../../../locales/de/landing.json';
import { Features } from '../Features';

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    resources: { en: { landing: en }, de: { landing: de } },
    lng: 'en',
    fallbackLng: 'en',
    ns: ['landing'],
    defaultNS: 'landing',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
});

test('renders features title and items in English', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Features />
    </I18nextProvider>
  );

  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
    /Learning that adapts to you/i
  );
  // Check one feature item exists
  expect(screen.getByText(/AI learning paths/i)).toBeInTheDocument();
});
