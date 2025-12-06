import { createContext, useState, useEffect } from 'react';
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
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  userDetails?: UserDetails | null;
  refreshUserDetails?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

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
      console.log('[AuthContext] Attempting login for:', email);
      const response = await fetch(getApiUrl('/api/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('[AuthContext] Response status:', response.status);
      const data = await response.json();
      console.log('[AuthContext] Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Login failed (${response.status})`);
      }

      console.log('[AuthContext] Login successful:', { id: data.user.id, email: data.user.email });

      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.name || '',
      };

      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', data.token);
      // Refresh user details
      await refreshUserDetails?.();
    } catch (err) {
      console.error('[AuthContext] Login error:', err instanceof Error ? err.message : String(err));
      throw err;
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
      await refreshUserDetails?.();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear auth data from local storage
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    // Clear video-related local history
    localStorage.removeItem('video-studio:last-video');
    localStorage.removeItem('video-studio:recent-videos');
    setUserDetails(null);
  };

  const refreshUserDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const res = await fetch(getApiUrl('/api/users/me'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      // Prefer inventory included with `/api/users/me` response, otherwise fall back to /api/store/inventory
      const inventory = data.user?.inventory || {};
      if (!inventory || Object.keys(inventory).length === 0) {
        try {
          const inventoryRes = await fetch(getApiUrl('/api/store/inventory'), {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (inventoryRes.ok) {
            const inventoryData = await inventoryRes.json();
            setUserDetails({
              totalScore: data.user?.totalScore ?? 0,
              wallet: data.user?.wallet ?? 0,
              pointsBreakdown: data.user?.pointsBreakdown,
              activeBoosts: data.user?.activeBoosts || [],
              inventory: inventoryData.inventory || {},
            });
            return;
          }
        } catch {
          // ignore and fallback to empty inventory
        }
      }
      setUserDetails({
        totalScore: data.user?.totalScore ?? 0,
        wallet: data.user?.wallet ?? 0,
        pointsBreakdown: data.user?.pointsBreakdown,
        activeBoosts: data.user?.activeBoosts || [],
        inventory: inventory || {},
      });
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
