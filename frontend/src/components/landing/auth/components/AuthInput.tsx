import { Input } from '../../../../ui/input';
import { Label } from '../../../../ui/label';
import { Mail, Lock, User } from 'lucide-react';
import type { AuthField } from '../types';

interface AuthInputProps {
  field: AuthField;
  value: string;
  onChange: (value: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  Lock,
  User,
};

export function AuthInput({ field, value, onChange }: AuthInputProps) {
  const Icon = field.icon ? iconMap[field.icon] : null;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className="dark:text-white">
        {field.label}
      </Label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <Icon className="size-4" />
          </div>
        )}
        <Input
          id={field.id}
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${Icon ? 'pl-10' : ''} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
          required={field.required}
        />
      </div>
    </div>
  );
}
