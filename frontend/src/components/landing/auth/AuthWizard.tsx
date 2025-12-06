import { useState } from 'react';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

type AuthMode = 'login' | 'register';

interface AuthWizardProps {
  onAuthSuccess?: () => void;
}

export function AuthWizard({ onAuthSuccess }: AuthWizardProps) {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-[600px] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'register' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'register' ? -20 : 20 }}
            transition={{ duration: 0.3 }}
          >
            {mode === 'login' ? (
              <LoginForm
                onSwitch={() => setMode('register')}
                onLoginSuccess={onAuthSuccess || (() => {})}
              />
            ) : (
              <RegisterForm
                onSwitch={() => setMode('login')}
                onRegisterSuccess={onAuthSuccess || (() => {})}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
