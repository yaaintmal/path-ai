# StorePage System Quick Reference

## 📊 Points & EXP Calculation System

### Points Calculation Formula

```
Base Points = EXP earned (1:1 ratio)

If Streak >= 3 days:
  Multiplicative Bonus:
  - Multiplier = min(1.5 + (streak - 3) × 0.1, 3.0)
  - Final Points = floor(Base Points × Multiplier)
  - Streak Bonus = Final Points - Base Points

Else if Streak 1-2 days:
  Additive Bonus:
  - Streak Bonus = streak × 100
  - Final Points = Base Points + Streak Bonus

Else (no streak):
  Final Points = Base Points
```

**Example with 1,300 EXP:**
| Streak | Formula | Total Points | Breakdown |
|--------|---------|--------------|-----------|
| 0 days | 1,300 | **1,300** | Base only |
| 1 day | 1,300 + 100 | **1,400** | +100 additive |
| 2 days | 1,300 + 200 | **1,500** | +200 additive |
| 3 days | 1,300 × 1.5 | **1,950** | ×1.5 multiplier 🔥 |
| 5 days | 1,300 × 1.7 | **2,210** | ×1.7 multiplier |
| 10 days | 1,300 × 2.2 | **2,860** | ×2.2 multiplier |
| 20+ days | 1,300 × 3.0 | **3,900** | ×3.0 max multiplier |

**Motivation Design:**

- Days 1-2: Small additive bonus encourages initial streaks
- Day 3+: Multiplicative bonus grows exponentially to reward consistency
- Max 3x multiplier at 18+ days creates mid-term goal

### EXP Calculation Formula

```
EXP = (learned_topics × 100) + (learned_subtopics × 30)

Where:
- learned_topics = count of topics marked as learned
- learned_subtopics = count of subtopics marked as learned
- TOPIC_WEIGHT = 100 points per topic
- SUBTOPIC_WEIGHT = 30 points per subtopic
```

**Example:**

- User has learned 10 topics + 8 subtopics
- EXP = (10 × 100) + (8 × 30) = 1,000 + 240 = **1,240 EXP**

---

## 🏗️ Architecture Overview

```
StorePage.tsx (207 lines)
│
├─ Data Layer
│  ├─ useAuth() → user info
│  ├─ useBookmarks() → learnedTopics[]
│  └─ fetch(/api/users/streaks) → currentStreak
│
├─ Computation Layer
│  ├─ calculateExp(learnedTopics) → expTotal
│  └─ calculatePoints(exp, streak) → {points, basePoints, streakBonus, multiplier}
│
└─ UI Layer
   ├─ <UserStatsCard /> → Display points breakdown
   ├─ <BadgesSection /> → Display all badges
   ├─ <CategoryFilter /> → Filter items by category
   └─ <StoreItemCard /> × N → Display purchasable items
```

---

## 🔧 Developer Reference

### File Structure

```
/src/pages/
├── StorePage.tsx           # Main component (207 lines)
└── store/
    ├── types.ts            # TypeScript interfaces
    ├── constants.ts        # All config & constants
    ├── storeUtils.ts       # Pure utility functions
    ├── StoreItemCard.tsx   # Item display component
    ├── UserStatsCard.tsx   # Stats display component
    ├── BadgesSection.tsx   # Badges display component
    └── CategoryFilter.tsx  # Category filter component
```

### Core Functions

#### 1. `calculateExp(learnedTopics: LearnedItem[]): number`

**File:** `/src/pages/store/storeUtils.ts`

**Purpose:** Calculate total EXP from learned topics

**Implementation:**

```typescript
export function calculateExp(learnedTopics: Array<{ type: 'topic' | 'subtopic' }>): number {
  const topicsCount = learnedTopics.filter((item) => item.type === 'topic').length;
  const subtopicsCount = learnedTopics.filter((item) => item.type === 'subtopic').length;
  return topicsCount * EXP_WEIGHTS.TOPIC + subtopicsCount * EXP_WEIGHTS.SUBTOPIC;
}
```

**Parameters:**

- `learnedTopics`: Array from `useBookmarks()` context
  - Each item: `{ type: 'topic' | 'subtopic', ...other fields }`

**Returns:**

- Total EXP as number

**Usage in StorePage:**

```typescript
const calculatedExp = calculateExp(learnedTopics);
// Result: 1,300 (example: 10 topics + 8 subtopics)
```

---

#### 2. `calculatePoints(exp: number, currentStreak: number): StreakData`

**File:** `/src/pages/store/storeUtils.ts`

**Purpose:** Calculate points with motivating streak bonuses

**Implementation:**

```typescript
export function calculatePoints(
  exp: number,
  currentStreak: number
): Omit<UserStats, 'points' | 'exp'> {
  const basePoints = exp;
  let streakBonus = 0;
  let multiplier = 1;
  let finalPoints = basePoints;

  if (currentStreak >= STREAK_CONFIG.ADDITIVE_THRESHOLD) {
    // Multiplicative bonus (3+ days)
    multiplier = Math.min(
      STREAK_CONFIG.MULTIPLICATIVE_BASE +
        (currentStreak - STREAK_CONFIG.ADDITIVE_THRESHOLD) * STREAK_CONFIG.MULTIPLICATIVE_INCREMENT,
      STREAK_CONFIG.MULTIPLICATIVE_MAX
    );
    finalPoints = Math.floor(basePoints * multiplier);
    streakBonus = finalPoints - basePoints;
  } else if (currentStreak > 0) {
    // Additive bonus (1-2 days)
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
```

**Parameters:**

- `exp`: Result from `calculateExp()` (e.g., 1,300)
- `currentStreak`: From API `/api/users/streaks` response (e.g., 5)

**Returns:**

```typescript
{
  currentStreak: 5,
  basePoints: 1300,
  streakBonus: 260,          // (1300 × 1.7) - 1300
  multiplier: 1.7            // 1.5 + (5-3) × 0.1
}
```

**Note:** `finalPoints` is computed in StorePage, not returned by this function:

```typescript
const finalPoints =
  streakData.multiplier === 1
    ? streakData.basePoints + streakData.streakBonus
    : Math.floor(streakData.basePoints * streakData.multiplier);
```

---

#### 3. `fetchUserStats()` (StorePage method)

**File:** `/src/pages/StorePage.tsx` (lines 41-77)

**Purpose:** Fetch user data and compute final stats

**Flow:**

1. Fetch current streak from `/api/users/streaks?userId=${user.id}`
2. Calculate EXP from `learnedTopics` (from AuthContext)
3. Calculate points using both values
4. Update state with computed stats

**State Updated:**

```typescript
setUserStats({
  points: finalPoints, // 1,560 (computed final value)
  exp: calculatedExp, // 1,300 (from calculateExp)
  currentStreak: 5, // From API
  basePoints: 1300, // Same as exp
  streakBonus: 260, // Calculated from streak
  multiplier: 1.7, // Calculated from streak
});
```

---

### Constants Configuration

**File:** `/src/pages/store/constants.ts`

**Adjustable Values:**

```typescript
// EXP Calculation Weights
export const EXP_WEIGHTS = {
  TOPIC: 100, // Points per topic learned
  SUBTOPIC: 30, // Points per subtopic learned
} as const;

// Streak Points Thresholds
export const STREAK_CONFIG = {
  ADDITIVE_THRESHOLD: 3, // Days before multiplicative kicks in
  ADDITIVE_BONUS_PER_DAY: 100, // Bonus per day (days 1-2)
  MULTIPLICATIVE_BASE: 1.5, // Base multiplier at day 3
  MULTIPLICATIVE_INCREMENT: 0.1, // Additional per day (3+)
  MULTIPLICATIVE_MAX: 3, // Maximum multiplier cap
} as const;
```

**How to Adjust:**

**Make topics worth more:**

```typescript
TOPIC: 150,  // Was 100, now topics give 50% more EXP
```

**Encourage longer streaks (delay 3x):**

```typescript
MULTIPLICATIVE_THRESHOLD: 5,  // Start multiplier at day 5 instead of 3
```

**More aggressive multiplier growth:**

```typescript
MULTIPLICATIVE_INCREMENT: 0.15,  // Was 0.1, grows 15% per day
```

---

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    StorePage.tsx                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  useEffect(() => {                                          │
│    fetchUserStats()  ─────────────────────────────┐         │
│  }, [user, learnedTopics])                        │         │
│                                                   │         │
│  ┌─────────────────────────────────────────────┐  │         │
│  │ fetchUserStats()                            │  │         │
│  ├─────────────────────────────────────────────┤  │         │
│  │ 1. Fetch from API                           │  │         │
│  │    GET /api/users/streaks?userId=...        │  │         │
│  │    ↓                                        │  │         │
│  │    { currentStreak: 5 }                     │  │         │
│  │                                             │  │         │
│  │ 2. Calculate EXP (local)                    │  │         │
│  │    calculateExp(learnedTopics)              │  │         │
│  │    ↓                                        │  │         │
│  │    1,300 EXP                                │  │         │
│  │                                             │  │         │
│  │ 3. Calculate Points (local)                 │  │         │
│  │    calculatePoints(1300, 5)                 │  │         │
│  │    ↓                                        │  │         │
│  │    { basePoints: 1300, multiplier: 1.7 }    │  │         │
│  │                                             │  │         │
│  │ 4. Final Points                             │  │         │
│  │    floor(1300 × 1.7) = 1,560                │  │         │
│  │                                             │  │         │
│  │ 5. Update State                             │  │         │
│  │    setUserStats({ points: 1560, ... })      │  │         │
│  └─────────────────────────────────────────────┘  │         │
│                                                   │         │
│  Render:                                          │         │
│  <UserStatsCard userStats={userStats} /> ◄───────┘          │
│  └─ Shows: 1,560 points = 1,300 base + 260 bonus            │
│                                                             │
│  <BadgesSection currentExp={1300} />                        │
│  └─ Shows: Badges unlocked at EXP thresholds                │
│                                                             │
│  <StoreItemCard ... />                                      │
│  └─ User can spend 1,560 points on items                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 User Experience Flow

**Day 1: User starts learning**

```
Learning Topics: 5 topics
EXP: 500
Streak: 1 day
Points: 500 + (1 × 100) = 600 ✓
Message: "💡 Noch 2 Tag(e) bis zum Multiplikator-Bonus!"
```

**Day 2: Consistent learning**

```
Learning Topics: 10 topics
EXP: 1,000
Streak: 2 days
Points: 1,000 + (2 × 100) = 1,200 ✓
Message: "💡 Noch 1 Tag bis zum Multiplikator-Bonus!"
```

**Day 3: Breakthrough! 🔥**

```
Learning Topics: 15 topics
EXP: 1,500
Streak: 3 days
Multiplier: 1.5x
Points: floor(1,500 × 1.5) = 2,250 ✓✓✓
Message: "🚀 Weiter so! Max. 3x bei 20 Tagen Streak"
Bonus Jump: +150 points from previous day (same EXP)
```

**Day 10: Established habit**

```
Learning Topics: 30 topics
EXP: 3,000
Streak: 10 days
Multiplier: 1.5 + (10-3) × 0.1 = 2.2x
Points: floor(3,000 × 2.2) = 6,600 ✓✓✓✓✓
Message: "🚀 Weiter so! Max. 3x bei 20 Tagen Streak"
```

---

## 🐛 Debugging Tips

### Check Points Calculation

Add this to browser console:

```javascript
// In StorePage useEffect after setUserStats
console.log('EXP:', userStats.exp);
console.log('Base Points:', userStats.basePoints);
console.log('Streak:', userStats.currentStreak);
console.log('Multiplier:', userStats.multiplier);
console.log('Streak Bonus:', userStats.streakBonus);
console.log('Final Points:', userStats.points);
```

### Verify API Response

```javascript
const token = localStorage.getItem('authToken');
const res = await fetch('http://localhost:5000/api/users/streaks?userId=YOUR_ID', {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
console.log('Streak Data:', data);
// Should return: { currentStreak: N, bestStreak: N, totalScore: N, ... }
```

### Test calculateExp Function

```javascript
// In browser console
const testTopics = [{ type: 'topic' }, { type: 'topic' }, { type: 'subtopic' }];
// Manually calculate: (2 × 100) + (1 × 30) = 230
```

---

## 📝 Adding New Features

### Change Points Formula

1. Edit `/src/pages/store/constants.ts`
2. Modify `STREAK_CONFIG` values
3. Changes apply immediately to all users

Example - Make day 3 multiplicative bonus 2x instead of 1.5x:

```typescript
MULTIPLICATIVE_BASE: 2.0,  // Was 1.5
```

### Add New Store Item Category

1. Edit `StoreItem` type in `/src/pages/store/types.ts`:

```typescript
category: 'badge' | 'theme' | 'boost' | 'cosmetic' | 'new_category';
```

2. Add to `CategoryFilter.tsx`:

```typescript
{(['cosmetic', 'badge', 'theme', 'boost', 'new_category'] as const).map(...)}
```

3. Add colors to `/src/pages/store/constants.ts`:

```typescript
export const RARITY_COLORS: Record<StoreItem['rarity'], string> = {
  // ... existing
};
```

### Adjust Item Purchase Cost

Edit `MOCK_STORE_ITEMS` in `/src/pages/store/constants.ts`:

```typescript
{ id: '1', cost: 500, ... }  // Was 500, now 750
```

---

## 🚀 Performance Notes

- **EXP Calculation**: O(n) where n = learned topics count (~100 items max)
- **Points Calculation**: O(1) constant time math
- **Re-renders**: Only when `user` or `learnedTopics` change (dependency array)
- **API Calls**: Once per user/topics change, cached in state
- **Components**: Each independently memoizable if needed

---

## 📚 Related Files

- **Badge System**: `/src/utils/BadgeSystem.ts` (10 tiers, exp thresholds)
- **Auth Context**: `/src/contexts/AuthContext.tsx` (learnedTopics provider)
- **Dashboard**: `/src/pages/Dashboard.tsx` (mode routing to StorePage)
- **ProgressWidget**: `/src/pages/dashboard/ProgressWidget.tsx` (uses same calculateExp logic)
