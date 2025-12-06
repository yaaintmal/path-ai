import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { getApiUrl } from '../config/app.config';
import { useAuth } from '../contexts/useAuth';
import { useBookmarks } from '../contexts/useBookmarks';
import { StoreItemCard } from './store/StoreItemCard';
import { UserStatsCard } from './store/UserStatsCard';
import { BadgesSection } from './store/BadgesSection';
import { CategoryFilter } from './store/CategoryFilter';
import { MOCK_STORE_ITEMS } from './store/constants';
import type { StoreItem, UserStats } from './store/types';

// Helper functions for Streak Shield management
const readShieldsFromStorage = (): number => {
  const shields = localStorage.getItem('streak_shields');
  return shields ? parseInt(shields, 10) : 0;
};

const writeShieldsToStorage = (count: number): void => {
  localStorage.setItem('streak_shields', count.toString());
};

const readLastKnownActive = (): string | null => {
  return localStorage.getItem('last_known_active');
};

const writeLastKnownActive = (dateIso: string): void => {
  localStorage.setItem('last_known_active', dateIso);
};

const readLastKnownStreak = (): number => {
  const streak = localStorage.getItem('last_known_streak');
  return streak ? parseInt(streak, 10) : 0;
};

const writeLastKnownStreak = (n: number): void => {
  localStorage.setItem('last_known_streak', n.toString());
};

const consumeShieldAndUpdateState = (setter?: (n: number) => void): number => {
  const current = readShieldsFromStorage();
  if (current > 0) {
    const newCount = current - 1;
    writeShieldsToStorage(newCount);
    if (setter) setter(newCount);
    return newCount;
  }
  return current;
};

interface StorePageProps {
  onBack: () => void;
}

export function StorePage({ onBack }: StorePageProps) {
  const { user, refreshUserDetails } = useAuth();
  const { learnedTopics } = useBookmarks();
  const [items] = useState<StoreItem[]>(MOCK_STORE_ITEMS);
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    exp: 0,
    currentStreak: 0,
    basePoints: 0,
    streakBonus: 0,
    multiplier: 1,
    activeBoosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | StoreItem['category']>('all');
  const [streakShields, setStreakShields] = useState<number>(() => readShieldsFromStorage());

  useEffect(() => {
    fetchUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, learnedTopics]);

  const fetchUserStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      let activeBoostsFromApi: Array<{ source?: string; multiplier: number; expiresAt: string }> =
        [];
      // Read shield and streak history from local storage
      const shields = readShieldsFromStorage();
      const lastKnownActive = readLastKnownActive();
      const lastKnownStreak = readLastKnownStreak();

      // Fetch current user data including server balance and breakdown
      const meRes = await fetch(getApiUrl('/api/users/me'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      let serverBalance = 0;
      let serverBreakdown = {
        exp: 0,
        basePoints: 0,
        streakBonus: 0,
        multiplier: 1,
        currentStreak: 0,
      };
      if (meRes.ok) {
        const meData = await meRes.json();
        serverBalance = meData.user?.totalScore ?? meData.user?.wallet ?? 0;
        serverBreakdown = meData.user?.pointsBreakdown || serverBreakdown;
        // include active boosts variable
        activeBoostsFromApi = meData.user?.activeBoosts || [];
      }

      // Use server streak
      let streakToUse = serverBreakdown.currentStreak;

      // Compute today and yesterday dates for streak shield logic
      const todayIso = new Date().toISOString().slice(0, 10);
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayIso = yesterdayDate.toISOString().slice(0, 10);

      // Streak shield consumption logic
      if (streakToUse > 0) {
        // Server reports positive streak; record it
        writeLastKnownActive(todayIso);
        writeLastKnownStreak(streakToUse);
      } else if (
        streakToUse === 0 &&
        lastKnownActive === yesterdayIso &&
        lastKnownStreak > 0 &&
        shields > 0
      ) {
        // Missed yesterday detected and shield available; attempt server-side consume
        try {
          const consumeRes = await fetch(getApiUrl('/api/users/consume-shield'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              idempotencyKey: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
            }),
          });

          if (consumeRes.ok) {
            const data = await consumeRes.json();
            // Update local shield count from server inventory if available
            const inv = data.inventory || {};
            const newCount = inv['shield_basic'] ?? inv['6'] ?? Math.max(0, shields - 1);
            writeShieldsToStorage(newCount);
            setStreakShields(newCount);
            streakToUse = data.newStreakData?.currentStreak ?? lastKnownStreak;
            writeLastKnownActive(todayIso); // Mark that we've handled today
            setMessage({
              type: 'success',
              text: `Streak Shield verwendet — dein Streak bleibt bei ${streakToUse} Tagen!`,
            });
            setTimeout(() => setMessage(null), 3000);
          } else {
            // fallback to local consume
            consumeShieldAndUpdateState(setStreakShields);
            streakToUse = lastKnownStreak;
            writeLastKnownActive(todayIso);
          }
        } catch (err) {
          console.error('consume shield failed:', err);
          // fallback to local consume
          consumeShieldAndUpdateState(setStreakShields);
          streakToUse = lastKnownStreak;
          writeLastKnownActive(todayIso);
        }
      }

      // Use server breakdown data directly as source of truth
      setUserStats({
        points: serverBalance,
        exp: serverBreakdown.exp,
        currentStreak: serverBreakdown.currentStreak,
        basePoints: serverBreakdown.basePoints,
        streakBonus: serverBreakdown.streakBonus,
        multiplier: serverBreakdown.multiplier,
        activeBoosts: activeBoostsFromApi || [],
      });
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (item: StoreItem) => {
    if (userStats.points < item.cost) {
      setMessage({ type: 'error', text: 'Nicht genug Punkte!' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setPurchasing(item.id);
    const token = localStorage.getItem('authToken');

    if (!token || !user) {
      setPurchasing(null);
      return;
    }

    try {
      const idempotencyKey = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      const res = await fetch(getApiUrl('/api/store/purchase'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: item.id, idempotencyKey }),
      });

      if (res.ok) {
        const data = await res.json();
        // Prefer server inventory if provided
        const inv = data.inventory || {};
        const newCount =
          inv[item.id] ?? (item.id === '6' ? readShieldsFromStorage() + 1 : undefined);

        if (item.id === '6') {
          const finalCount = typeof newCount === 'number' ? newCount : readShieldsFromStorage() + 1;
          writeShieldsToStorage(finalCount);
          setStreakShields(finalCount);
          setMessage({
            type: 'success',
            text: `Streak Shield gekauft — du hast ${finalCount} Schilde.`,
          });
        } else {
          setMessage({ type: 'success', text: `${item.name} gekauft! 🎉` });
        }

        // Update points from server if provided, otherwise local optimistic
        if (typeof data.newBalance === 'number') {
          setUserStats((prev) => ({ ...prev, points: data.newBalance }));
        } else {
          setUserStats((prev) => ({ ...prev, points: prev.points - item.cost }));
        }
        // If a boost was applied, refresh stats to get active boosts and true new balance
        if (data.appliedBoost) {
          setMessage({
            type: 'success',
            text: `${item.name} aktiviert — ${data.appliedBoost.multiplier}x für ${new Date(data.appliedBoost.expiresAt).toLocaleString()}`,
          });
          await fetchUserStats();
          await refreshUserDetails?.();
        }
      } else {
        setMessage({ type: 'error', text: 'Fehler beim Kauf' });
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      // fallback optimistic behavior
      if (item.id === '6') {
        const newCount = readShieldsFromStorage() + 1;
        writeShieldsToStorage(newCount);
        setStreakShields(newCount);
        setMessage({
          type: 'success',
          text: `Streak Shield gekauft — du hast ${newCount} Schilde.`,
        });
      } else {
        setMessage({ type: 'success', text: `${item.name} gekauft! 🎉` });
      }
      setUserStats((prev) => ({ ...prev, points: prev.points - item.cost }));
    } finally {
      setPurchasing(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredItems =
    selectedCategory === 'all' ? items : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 border border-transparent hover:border-border"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          {/* Main Header Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Title and Description */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <ShoppingCart className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Store
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Exclusive items & power-ups
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Trade your hard-earned points for exclusive items and boosts to enhance your learning journey!
                </p>
              </div>

              {/* User Stats Card */}
              <div className="flex-shrink-0">
                <UserStatsCard userStats={userStats} streakShields={streakShields} />
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
            }`}
          >
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Badge Progress Section Component */}
        <BadgesSection currentExp={userStats.exp} />

        {/* Category Filter Component */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            Loading store items...
          </div>
        )}

        {/* Store Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const canAfford = userStats.points >= item.cost;
              return (
                <StoreItemCard
                  key={item.id}
                  item={item}
                  canAfford={canAfford}
                  isPurchasing={purchasing === item.id}
                  onPurchase={handlePurchase}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
