import { useState } from 'react';
import { themes } from '../theme';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/useAuth';
import { getApiUrl } from '../config/app.config';
import { toast } from 'sonner';

export function ThemeSwitcher() {
  const { theme, setThemeById } = useThemeContext();
  const { userDetails, refreshUserDetails } = useAuth();
  const [isSaving, setSaving] = useState(false);

  const handleSelect = async (id: keyof typeof themes) => {
    setThemeById(id as any);
    // persist as explicit themeId and keep gamification mapping for compatibility
    const gamification = id === 'theme1' ? 'full' : id === 'theme2' ? 'light' : 'none';
    setSaving(true);
    try {
      const token = window.localStorage.getItem('authToken');
      const onboardingData = { ...(userDetails?.onboardingData || {}), gamification, themeId: id };
      const res = await fetch(getApiUrl('/api/users/onboarding'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ onboardingData }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(`Failed to save theme: ${data?.message || res.status}`);
        return;
      }
      // refresh user details so ThemeProvider picks up persisted value
      await refreshUserDetails?.();
      toast.success('Theme saved');
    } catch (err) {
      toast.error('Error saving theme');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800">
      <h4 className="font-semibold mb-2">Theme</h4>
      <div className="flex gap-2">
        {Object.values(themes).map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              theme.id === t.id ? 'border-primary bg-primary/10' : 'border-muted'
            }`}
            disabled={isSaving}
          >
            <div className="text-2xl">{t.icons.brand}</div>
            <div className="text-sm mt-1">{t.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
