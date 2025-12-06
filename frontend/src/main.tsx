import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from './ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { LearningProvider } from './contexts/LearningContext';
import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <BookmarkProvider>
          <LearningProvider>
            <App />
            <Toaster />
          </LearningProvider>
        </BookmarkProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>
);
