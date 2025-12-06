import { AuthWizard } from '../components/landing/auth/AuthWizard';

interface RegistrationProps {
  onAuthSuccess?: () => void;
}

export function Registration({ onAuthSuccess }: RegistrationProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <AuthWizard onAuthSuccess={onAuthSuccess} />
    </div>
  );
}
