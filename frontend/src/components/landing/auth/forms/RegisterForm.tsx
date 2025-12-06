import { useState } from 'react';
import { Button } from '../../../../ui/button';
import { AuthInput } from '../components/AuthInput';
import { AuthHeader } from '../components/AuthHeader';
import { SocialButtons } from '../components/SocialButtons';
import authConfig from '../config/auth-config.json';
import { useAuth } from '../../../../contexts/useAuth';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSwitch: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterForm({ onSwitch, onRegisterSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const config = authConfig.register;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = formData['email'] || '';
      const password = formData['password'] || '';
      const name = formData['name'] || '';

      if (!email || !password || !name) {
        throw new Error('Alle Felder sind erforderlich');
      }

      if (formData['password'] !== formData['confirmPassword']) {
        throw new Error('Passwörter stimmen nicht überein');
      }

      await register(email, password, name);

      toast.success('Registrierung erfolgreich!', { duration: 2500 });

      setTimeout(() => {
        onRegisterSuccess();
      }, 2500);
    } catch (error: any) {
      console.error('Register error:', error);
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

      <SocialButtons googleText={authConfig.social.google} githubText={authConfig.social.github} />

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

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Mit der Registrierung stimmst du unseren{' '}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Nutzungsbedingungen
          </a>{' '}
          und der{' '}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Datenschutzerklärung
          </a>{' '}
          zu.
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 h-11"
        >
          {isLoading ? 'Wird registriert...' : config.buttonText}
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
