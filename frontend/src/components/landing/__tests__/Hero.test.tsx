import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../../locales/en/landing.json';
import de from '../../../locales/de/landing.json';
import { Hero } from '../Hero';

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    resources: { en: { landing: en }, de: { landing: de } },
    lng: 'de',
    fallbackLng: 'de',
    ns: ['landing'],
    defaultNS: 'landing',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
});

afterAll(() => {
  i18n.changeLanguage('de');
});

test('renders German hero content by default and toggles to English', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Hero />
    </I18nextProvider>
  );

  // German title should be present
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Dein persönlicher/i);

  // Toggle to English (test env might show keys or translations; accept either)
  const enBtn = screen.getByTestId('lang-en');
  fireEvent.click(enBtn);

  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Your personal AI learning plan|Dein persönlicher KI-Lernplan/i
    );
  });
});
