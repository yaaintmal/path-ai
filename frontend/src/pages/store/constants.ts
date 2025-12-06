import type { StoreItem } from './types';
import storeItems from './store-items.json';

export const MOCK_STORE_ITEMS: StoreItem[] = storeItems as StoreItem[];

export const RARITY_COLORS: Record<StoreItem['rarity'], string> = {
  common: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30',
  uncommon: 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20',
  rare: 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20',
  epic: 'border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20',
  legendary:
    'border-yellow-400 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
};

export const RARITY_LABELS: Record<StoreItem['rarity'], string> = {
  common: 'common',
  uncommon: 'uncommon',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary',
};

export const RARITY_BADGE_COLORS: Record<StoreItem['rarity'], string> = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-gradient-to-r from-yellow-400 to-orange-400',
};

// EXP calculation weights
export const EXP_WEIGHTS = {
  TOPIC: 100,
  SUBTOPIC: 30,
} as const;

// Streak points calculation thresholds
export const STREAK_CONFIG = {
  ADDITIVE_THRESHOLD: 3,
  ADDITIVE_BONUS_PER_DAY: 100,
  MULTIPLICATIVE_BASE: 1.5,
  MULTIPLICATIVE_INCREMENT: 0.1,
  MULTIPLICATIVE_MAX: 3,
} as const;
