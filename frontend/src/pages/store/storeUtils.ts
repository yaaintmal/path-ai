import type { StoreItem, UserStats } from './types';
import { EXP_WEIGHTS, STREAK_CONFIG } from './constants';

//  * Calculate points based on EXP and streak.
//  *
//  * Formula:
//  * - Base: EXP earned (1:1 ratio)
//  * - Days 1-2: Additive bonus (+100 per day)
//  * - Days 3+: Multiplicative bonus (1.5x at day 3, +0.1x per additional day, max 3x)

export function calculatePoints(
  exp: number,
  currentStreak: number
): Omit<UserStats, 'points' | 'exp'> {
  const basePoints = exp;
  let streakBonus = 0;
  let multiplier = 1;
  let finalPoints = basePoints;

  if (currentStreak >= STREAK_CONFIG.ADDITIVE_THRESHOLD) {
    // Multiplicative bonus starting at day 3
    multiplier = Math.min(
      STREAK_CONFIG.MULTIPLICATIVE_BASE +
        (currentStreak - STREAK_CONFIG.ADDITIVE_THRESHOLD) * STREAK_CONFIG.MULTIPLICATIVE_INCREMENT,
      STREAK_CONFIG.MULTIPLICATIVE_MAX
    );
    finalPoints = Math.floor(basePoints * multiplier);
    streakBonus = finalPoints - basePoints;
  } else if (currentStreak > 0) {
    // Additive bonus for days 1-2
    streakBonus = currentStreak * STREAK_CONFIG.ADDITIVE_BONUS_PER_DAY;
    finalPoints = basePoints + streakBonus;
  }

  return {
    currentStreak,
    basePoints,
    streakBonus,
    multiplier,
  };
}

//  * Calculate total EXP from learned topics

export function calculateExp(learnedTopics: Array<{ type: 'topic' | 'subtopic' }>): number {
  const topicsCount = learnedTopics.filter((item) => item.type === 'topic').length;
  const subtopicsCount = learnedTopics.filter((item) => item.type === 'subtopic').length;
  return topicsCount * EXP_WEIGHTS.TOPIC + subtopicsCount * EXP_WEIGHTS.SUBTOPIC;
}

//  * Filter store items by category

export function filterItemsByCategory(
  items: StoreItem[],
  category: 'all' | StoreItem['category']
): StoreItem[] {
  if (category === 'all') {
    return items;
  }
  return items.filter((item) => item.category === category);
}
