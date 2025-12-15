import { GraduationCap, BookOpen, Users, Check } from 'lucide-react';
import type React from 'react';
import { RadioGroup, RadioGroupItem } from '../../../../ui/radio-group';
import { Label } from '../../../../ui/label';
import { StepHeader } from '../components/Headers';
import rolesData from '../config/roles-and-goals.json';
import type { OnboardingData } from '../types';
import { cn } from '../../../../lib/utils';

interface Step1RoleProps {
  data: Partial<OnboardingData>;
  updateData: (field: keyof OnboardingData, value: unknown) => void;
}

const ROLE_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  student: GraduationCap,
  pupil: BookOpen,
  teacher: Users,
};

export function Step1Role({ data, updateData }: Step1RoleProps) {
  const selectedRole = rolesData.roles.find((r) => r.id === data.role);

  return (
    <div className="space-y-8">
      <StepHeader
        title="What describes you best?"
        description="We will customize your learning experience based on your role"
      />

      <RadioGroup
        value={data.role || ''}
        onValueChange={(value) => updateData('role', value)}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {rolesData.roles.map((role) => {
          const Icon = (ROLE_ICONS[role.id] || Users) as React.ComponentType<
            React.SVGProps<SVGSVGElement>
          >;
          const isSelected = data.role === role.id;

          return (
            <div key={role.id} className="relative">
              <RadioGroupItem value={role.id} id={role.id} className="peer sr-only" />
              <Label
                htmlFor={role.id}
                className={cn(
                  'flex flex-col items-center justify-center p-6 h-full rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]',
                  'hover:border-primary/50 hover:shadow-md',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg ring-1 ring-primary'
                    : 'border-border bg-card'
                )}
              >
                <div
                  className={cn(
                    'p-4 rounded-full mb-4 transition-colors',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  )}
                >
                  <Icon className="w-8 h-8" />
                </div>

                <div className="text-center space-y-1">
                  <div className="font-bold text-lg">{role.label}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 text-primary">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      <div
        className={cn(
          'transition-all duration-500 ease-in-out overflow-hidden',
          selectedRole ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {selectedRole && (
          <div className="bg-card border border-border rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
            <Label className="text-sm font-medium mb-2 block">{selectedRole.levelLabel}</Label>
            <input
              type="text"
              placeholder={selectedRole.levelPlaceholder}
              value={data.level || ''}
              onChange={(e) => updateData('level', e.target.value)}
              className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
}
