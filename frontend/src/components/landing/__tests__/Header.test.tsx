import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { Header } from '../Header';
import i18n from '../../../i18n';

test('header language toggle switches language via LanguageContext and i18n', async () => {
  render(
    <LanguageProvider>
      <Header />
    </LanguageProvider>
  );

  const enBtn = screen.getByTestId('header-lang-en');
  fireEvent.click(enBtn);

  await waitFor(() => expect(i18n.language).toBe('en'));

  const deBtn = screen.getByTestId('header-lang-de');
  fireEvent.click(deBtn);
  await waitFor(() => expect(i18n.language).toBe('de'));
});
