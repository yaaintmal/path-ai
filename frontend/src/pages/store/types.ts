export interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'badge' | 'theme' | 'boost' | 'cosmetic';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface UserStats {
  points: number;
  exp: number;
  currentStreak: number;
  basePoints: number;
  streakBonus: number;
  multiplier: number;
  activeBoosts?: Array<{ source?: string; multiplier: number; expiresAt: string }>;
}
