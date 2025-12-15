import { useState } from 'react';
import { LoginForm } from './forms/LoginForm';
import { RegisterForm } from './forms/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

type AuthMode = 'login' | 'register';

interface AuthWizardProps {
  onAuthSuccess?: () => void;
  initialMode?: AuthMode;
  allowRegister?: boolean;
}

export function AuthWizard({ onAuthSuccess, initialMode, allowRegister = true }: AuthWizardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode || 'login');

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
                onSwitch={allowRegister ? () => setMode('register') : undefined}
                onLoginSuccess={onAuthSuccess || (() => {})}
              />
            ) : allowRegister ? (
              <RegisterForm
                onSwitch={() => setMode('login')}
                onRegisterSuccess={onAuthSuccess || (() => {})}
              />
            ) : (
              <LoginForm onLoginSuccess={onAuthSuccess || (() => {})} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
