import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../../locales/en/landing.json';
import de from '../../../locales/de/landing.json';
import { OnboardingWizard } from '../OnboardingWizard';

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

test('renders onboarding header and step 1 in German', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <OnboardingWizard />
    </I18nextProvider>
  );

  expect(screen.getByText(/Persönliches Setup|onboardingwizard.header.title/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Welche Rolle hast du\?|onboardingwizard.step1.title/i)
  ).toBeInTheDocument();
});
