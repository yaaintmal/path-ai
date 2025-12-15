import { AuthWizard } from '../components/landing/auth/AuthWizard';

interface RegistrationProps {
  onAuthSuccess?: () => void;
  allowRegister?: boolean;
}

export function Registration({ onAuthSuccess, allowRegister = true }: RegistrationProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <AuthWizard onAuthSuccess={onAuthSuccess} allowRegister={allowRegister} />
    </div>
  );
}
