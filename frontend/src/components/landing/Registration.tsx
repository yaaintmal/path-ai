import { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RegistrationProps {
  setShowOnboarding?: (show: boolean) => void;
}

export function Registration({ setShowOnboarding }: RegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bitte gib deinen Namen ein';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Bitte gib deine E-Mail-Adresse ein';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein';
    }

    if (!formData.password) {
      newErrors.password = 'Bitte wähle ein Passwort';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Das Passwort muss mindestens 8 Zeichen lang sein';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Die Passwörter stimmen nicht überein';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Bitte akzeptiere die Nutzungsbedingungen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Here you would normally send data to your backend
      console.log('Registration data:', formData);

      // Navigate to onboarding
      if (setShowOnboarding) {
        setShowOnboarding(true);
      }
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Schwach', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Mittel', color: 'bg-yellow-500' };
    return { strength, label: 'Stark', color: 'bg-green-500' };
  };

  const strength = passwordStrength();

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-4">
              <Sparkles className="size-4" />
              <span className="text-sm">Kostenlos starten</span>
            </div>
            <h1 className="text-4xl md:text-5xl mb-3 dark:text-white">
              Erstelle dein{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                kostenloses Konto
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Starte jetzt deine personalisierte Lernreise
            </p>
          </div>

          {/* Registration Card */}
          <Card className="p-8 dark:bg-gray-800 dark:border-gray-700 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-white">
                  Vollständiger Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Max Mustermann"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-white">
                  E-Mail-Adresse
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="max@beispiel.de"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-white">
                  Passwort
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mindestens 8 Zeichen"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Passwortstärke:</span>
                      <span
                        className={`font-medium ${
                          strength.label === 'Schwach'
                            ? 'text-red-500'
                            : strength.label === 'Mittel'
                              ? 'text-yellow-500'
                              : 'text-green-500'
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full ${
                            level <= strength.strength
                              ? strength.color
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="dark:text-white">
                  Passwort bestätigen
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Passwort wiederholen"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="size-4" />
                    <span>Passwörter stimmen überein</span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => updateField('agreeToTerms', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer dark:text-gray-300">
                    Ich akzeptiere die{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Nutzungsbedingungen
                    </a>{' '}
                    und{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Datenschutzrichtlinien
                    </a>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 py-6 text-lg gap-2"
              >
                Kostenloses Konto erstellen
                <ArrowRight className="size-5" />
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background dark:bg-card text-muted-foreground">
                    Oder
                  </span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <svg className="size-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Mit Google fortfahren
                </Button>
              </div>
            </form>
          </Card>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Du hast bereits ein Konto?{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Jetzt anmelden
              </a>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <div className="text-2xl mb-2">✨</div>
              <div className="text-sm text-muted-foreground">KI-Powered</div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-sm text-muted-foreground">100+ Sprachen</div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <div className="text-2xl mb-2">🎮</div>
              <div className="text-sm text-muted-foreground">Gamification</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
