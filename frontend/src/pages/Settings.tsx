import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { useAuth } from '../contexts/useAuth';
import { useState } from 'react';

export function Settings() {
  const { userDetails, refreshUserDetails } = useAuth();
  const [saving, setSaving] = useState(false);
  const current = userDetails?.onboardingData?.themePrefs?.showClassicBackground ?? false;

  const toggleClassic = async () => {
    setSaving(true);
    try {
      const token = window.localStorage.getItem('authToken');
      const od = {
        ...(userDetails?.onboardingData || {}),
        themePrefs: {
          ...(userDetails?.onboardingData?.themePrefs || {}),
          showClassicBackground: !current,
        },
      };
      const res = await fetch(
        (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/users/onboarding',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ onboardingData: od }),
        }
      );
      if (res.ok) {
        // update global shorthand for immediate reflection in ThemeContext
        (window as any).__themePrefShowClassic = !current;
        await refreshUserDetails?.();
      }
    } catch {}
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Appearance</h3>
          <div className="mb-4">
            <ThemeSwitcher />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={current}
                onChange={toggleClassic}
                disabled={saving}
                className="rounded"
              />
              <span className="text-sm">
                Use classic backgrounds (improves light/dark contrast)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
