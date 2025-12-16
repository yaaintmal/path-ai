import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../../locales/en/landing.json';
import de from '../../../locales/de/landing.json';
import { Gamification } from '../Gamification';

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

test('renders Gamification headings in German', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Gamification />
    </I18nextProvider>
  );

  // Ensure the section renders the Gamification badge and subtitle (there may be multiple matches)
  expect(screen.getAllByText(/Gamification/i).length).toBeGreaterThan(0);
  // subtitle line (unique)
  expect(screen.getByText(/Bleib motiviert/i)).toBeInTheDocument();
});

test('renders at least one feature item', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <Gamification />
    </I18nextProvider>
  );

  // The features list should contain at least one of the default items or a translation key fallback
  expect(
    screen.getByText(
      /Small hint - 50 points|Kleiner Tipp - 50 Punkte|gamification.features.0.items/i
    )
  ).toBeInTheDocument();
});
