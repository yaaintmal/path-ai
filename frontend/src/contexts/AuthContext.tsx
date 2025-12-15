import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getApiUrl } from '../config/app.config';

// NOTE: Bookmark context moved to `src/contexts/BookmarkContext.tsx` to avoid fast-refresh issues.

interface User {
  id: string;
  email: string;
  name: string;
}

interface ActiveBoostDTO {
  source?: string;
  multiplier: number;
  expiresAt: string;
}

interface UserDetails {
  totalScore: number;
  wallet: number;
  pointsBreakdown?: {
    exp: number;
    basePoints: number;
    streakBonus: number;
    multiplier: number;
    currentStreak: number;
  };
  activeBoosts?: ActiveBoostDTO[];
  inventory?: Record<string, number>;
  onboardingData?: OnboardingData | null;
}

interface OnboardingData {
  role?: string;
  goals?: string[];
  subjects?: string[];
  gamification?: string;
  themeId?: string;
  themePrefs?: { showClassicBackground?: boolean };
  skillLevels?: Record<string, number> | Array<{ subject: string; level: number }>;
  nativeLanguage?: string;
  preferredLanguage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  userDetails?: UserDetails | null;
  refreshUserDetails?: (token?: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // Dispatch an auth change marker so other tabs can pick up the change via 'storage' event
  const dispatchAuthChanged = useCallback(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      // store a changing timestamp so the storage event fires even if same value was previously set
      window.localStorage.setItem('auth_event', JSON.stringify({ ts: Date.now() }));
      try {
        // notify same-tab listeners as well
        window.dispatchEvent(new Event('authChanged'));
      } catch (err) {
        console.debug('[AuthContext] dispatch authChanged event failed', err);
      }
    } catch (err) {
      // ignore failures (e.g., storage disabled)
      console.debug('[AuthContext] failed to write auth_event to localStorage', err);
    }
  }, []);

  // Listen for auth events from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let lastAuthEventTs = 0;

    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'auth_event') return;
      try {
        // Prevent reacting to duplicate events (sometimes emitted repeatedly by some browsers)
        const parsed = e.newValue ? JSON.parse(e.newValue) : undefined;
        const ts = parsed?.ts || 0;
        if (ts && ts <= lastAuthEventTs) return;
        lastAuthEventTs = ts;

        const stored = window.localStorage.getItem('authUser');
        const token = window.localStorage.getItem('authToken');
        if (stored) {
          setUser(JSON.parse(stored));
          // refresh details with explicit token to avoid races
          if (token) void refreshUserDetails?.(token);
        } else {
          setUser(null);
          setUserDetails(null);
        }
      } catch (err) {
        console.error('Error handling auth_event storage change:', err);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // Note: intentionally not including `refreshUserDetails` in deps to avoid TDZ during init;
    // the handler will call the latest `refreshUserDetails` at event time.
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem('authUser');
        if (stored) {
          setUser(JSON.parse(stored));
          // fetch user details on restore
          await refreshUserDetails?.();
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.debug('[AuthContext] Attempting login for:', email);
      console.debug('[AuthContext] Login URL:', getApiUrl('/api/users/login'));
      const response = await fetch(getApiUrl('/api/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        mode: 'cors',
      });

      console.debug('[AuthContext] Response status:', response.status);
      const data = await response.json();
      console.debug('[AuthContext] Response data:', data);

      if (!response.ok) {
        // Surface validation issues when provided by backend
        if (data?.issues && Array.isArray(data.issues)) {
          const details = (data.issues as Array<{ path?: string; message?: string }>)
            .map((i) => `${i.path || '<unknown>'}: ${i.message || '<no message>'}`)
            .join('; ');
          throw new Error(`${data.message || `Login failed (${response.status})`} — ${details}`);
        }
        throw new Error(data.message || `Login failed (${response.status})`);
      }

      console.debug('[AuthContext] Login successful:', {
        id: data.user.id,
        email: data.user.email,
      });

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.name || '',
      };

      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', data.token);
      // Refresh user details (pass token to avoid races)
      await refreshUserDetails?.(data.token);
      // notify other tabs
      dispatchAuthChanged();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[AuthContext] Login error:', message);
      throw new Error(
        message.includes('Failed to fetch')
          ? 'Network/CORS error while logging in. Ensure the backend is reachable and the origin is whitelisted.'
          : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/users/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.name || '',
      };

      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', data.token);
      await refreshUserDetails?.(data.token);
      dispatchAuthChanged();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear auth data from local storage
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    setUserDetails(null);
    dispatchAuthChanged();
  };

  const refreshUserDetails = async (tokenParam?: string | null) => {
    try {
      const token = tokenParam ?? localStorage.getItem('authToken');
      if (!token) {
        console.debug('[AuthContext] refreshUserDetails: no token available');
        return;
      }
      console.debug('[AuthContext] refreshUserDetails: using token length', token.length);
      // Helper to process /me response data and populate userDetails
      interface MeResponse {
        user?: {
          inventory?: Record<string, number>;
          totalScore?: number;
          wallet?: number;
          pointsBreakdown?: unknown;
          activeBoosts?: unknown[];
          onboardingData?: unknown;
        };
      }

      const applyUserData = async (data: unknown) => {
        const d = data as MeResponse;
        const inventory = d.user?.inventory || {};
        if (!inventory || Object.keys(inventory).length === 0) {
          try {
            const inventoryRes = await fetch(getApiUrl('/api/store/inventory'), {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (inventoryRes.ok) {
              const inventoryData = await inventoryRes.json();
              setUserDetails({
                totalScore: d.user?.totalScore ?? 0,
                wallet: d.user?.wallet ?? 0,
                pointsBreakdown: d.user?.pointsBreakdown as unknown as
                  | {
                      exp: number;
                      basePoints: number;
                      streakBonus: number;
                      multiplier: number;
                      currentStreak: number;
                    }
                  | undefined,
                activeBoosts: d.user?.activeBoosts as unknown as ActiveBoostDTO[] | [],
                inventory: inventoryData.inventory || {},
                onboardingData: d.user?.onboardingData as unknown as OnboardingData | null,
              });
              return;
            }
          } catch (err) {
            console.debug('[AuthContext] Failed to fetch inventory, falling back to empty', err);
          }
        }
        setUserDetails({
          totalScore: d.user?.totalScore ?? 0,
          wallet: d.user?.wallet ?? 0,
          pointsBreakdown: d.user?.pointsBreakdown as unknown as
            | {
                exp: number;
                basePoints: number;
                streakBonus: number;
                multiplier: number;
                currentStreak: number;
              }
            | undefined,
          activeBoosts: d.user?.activeBoosts as unknown as ActiveBoostDTO[] | [],
          inventory: inventory || {},
          onboardingData: d.user?.onboardingData as unknown as OnboardingData | null,
        });
      };

      // First attempt
      let res = await fetch(getApiUrl('/api/users/me'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.debug('[AuthContext] refreshUserDetails: /me status', res.status);
      if (res.status === 401) {
        // Try to refresh access token using refresh token cookie
        try {
          const refreshRes = await fetch(getApiUrl('/api/auth/refresh'), {
            method: 'POST',
            credentials: 'include',
          });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData?.token) {
              window.localStorage.setItem('authToken', refreshData.token);
              console.debug(
                '[AuthContext] refreshUserDetails: obtained new token via refresh endpoint'
              );
              // retry /me with new token
              res = await fetch(getApiUrl('/api/users/me'), {
                headers: { Authorization: `Bearer ${refreshData.token}` },
              });
            }
          }
        } catch (err) {
          console.error('[AuthContext] refresh token failed:', err);
        }
      }

      if (!res.ok) return;
      const data = await res.json();
      await applyUserData(data);
    } catch (err) {
      console.error('refreshUserDetails error:', err);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    userDetails,
    refreshUserDetails,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Bookmark Provider
// Bookmark provider moved to `src/contexts/BookmarkContext.tsx`.
