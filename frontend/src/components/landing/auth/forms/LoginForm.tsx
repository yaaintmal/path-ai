import { useState } from 'react';
import { Button } from '../../../../ui/button';
import { AuthInput } from '../components/AuthInput';
import { AuthHeader } from '../components/AuthHeader';
import { SocialButtons } from '../components/SocialButtons';
import authConfig from '../config/auth-config.json';
import { useAuth } from '../../../../contexts/useAuth';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  onSwitch: () => void;
  onLoginSuccess: () => void;
}

export function LoginForm({ onSwitch, onLoginSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const config = authConfig.login;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = formData['email'] || '';
      const password = formData['password'] || '';

      if (!email || !password) {
        throw new Error('Email und Passwort sind erforderlich');
      }

      await login(email, password);

      toast.success('Login erfolgreich!', { duration: 2500 });

      // Sync onboarding data if exists
      const savedOnboardingData = localStorage.getItem('onboarddata');
      const token = localStorage.getItem('authToken');
      if (savedOnboardingData && token) {
        try {
          const syncResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/onboarding`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ onboardingData: JSON.parse(savedOnboardingData) }),
            }
          );
          if (syncResponse.ok) {
            localStorage.removeItem('onboarddata');
          }
        } catch (err) {
          console.error('Failed to sync onboarding data', err);
        }
      }

      setTimeout(() => {
        onLoginSuccess();
      }, 2500);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AuthHeader
        subtitle={config.subtitle}
        title={config.title}
        description={config.description}
      />

      <SocialButtons />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
            Oder mit E-Mail
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.fields.map((field) => (
          <AuthInput
            key={field.id}
            field={field}
            value={formData[field.id] || ''}
            onChange={(value) => handleChange(field.id, value)}
          />
        ))}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-gray-600 dark:text-gray-400">Angemeldet bleiben</span>
          </label>
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Passwort vergessen?
          </a>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 h-11"
        >
          {isLoading ? 'Wird angemeldet...' : config.buttonText}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {config.footerText}{' '}
        <button
          onClick={onSwitch}
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          {config.footerLinkText}
        </button>
      </div>
    </div>
  );
}
