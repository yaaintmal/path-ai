# StatisticsOverview Refactoring Quick Reference

## Overview

Refactor `StatisticsOverview.tsx` into reusable, composable components for better maintainability and code reuse.

## Current Component Structure

- **StatisticsOverview** (main component)
  - Uses inline `StatCard` component
  - Monolithic ~350 line component
  - Tight coupling of data fetching and presentation logic

## Proposed Component Breakdown

### 1. **StatCard** (Reusable)

- **Location:** `src/components/ui/StatCard.tsx`
- **Props:**
  - `icon: LucideIcon`
  - `label: string`
  - `value: string | number`
  - `color: string` (e.g., "text-blue-600")
  - `bgColor: string` (e.g., "bg-blue-50")
  - `subtitle?: string`
- **Usage:** Display individual metric cards with icon, label, and value

### 2. **StreakSection** (Reusable)

- **Location:** `src/components/dashboard/StreakSection.tsx`
- **Props:**
  - `currentStreak: number`
  - `bestStreak: number`
  - `getFlame: (days: number) => string` (helper function)
- **Responsibility:** Render current and best streak cards

### 3. **LearningProgressSection** (Reusable)

- **Location:** `src/components/dashboard/LearningProgressSection.tsx`
- **Props:**
  - `topicsLearned: number`
  - `totalLessonsCompleted: number`
  - `weeklyLearningRate: number`
  - `averageDailyEngagement: number`
- **Responsibility:** Display learning metrics grid

### 4. **MetricsSection** (Reusable)

- **Location:** `src/components/dashboard/MetricsSection.tsx`
- **Props:**
  - `topicsSearched: number`
  - `totalScore: number`
  - `topicsLearned: number`
- **Responsibility:** Render total metrics and success rate

### 5. **AdvancedMetricsSection** (Reusable)

- **Location:** `src/components/dashboard/AdvancedMetricsSection.tsx`
- **Props:**
  - `learnedTopicsPerDay: number`
  - `learnedTopicsPerWeek: number`
  - `avgTimePerBookmark: number`
  - `avgCompletionTime: number`
- **Responsibility:** Display advanced statistics

### 6. **ActivityOverviewSection** (Reusable)

- **Location:** `src/components/dashboard/ActivityOverviewSection.tsx`
- **Props:**
  - `totalDaysActive: number`
  - `currentStreak: number`
- **Responsibility:** Show activity summary and consistency rating

### 7. **MotivationalBanner** (Reusable)

- **Location:** `src/components/dashboard/MotivationalBanner.tsx`
- **Props:**
  - `topicsLearned: number`
- **Responsibility:** Display motivational message based on progress

### 8. **StatisticsOverview** (Refactored Main)

- **Location:** `src/pages/dashboard/StatisticsOverview.tsx`
- **Responsibility:**
  - Data fetching logic
  - State management
  - Layout and orchestration
  - Compose child sections

## Helper Functions to Extract

### Utility Functions File: `src/utils/statisticsHelpers.ts`

```typescript
export const getFlame = (days: number): string => { ... }
export const getMotivationalMessage = (topicsLearned: number): string => { ... }
```

## Data Flow

```
StatisticsOverview (fetch data, manage state)
├── MotivationalBanner (props: topicsLearned)
├── StreakSection (props: currentStreak, bestStreak)
├── LearningProgressSection (props: learning metrics)
├── MetricsSection (props: total metrics)
├── AdvancedMetricsSection (props: advanced metrics)
├── ActivityOverviewSection (props: activity metrics)
└── CallToAction (props: onBack callback)
```

## Implementation Order

1. Create `StatCard.tsx` in `src/components/ui/`
2. Create `statisticsHelpers.ts` in `src/utils/`
3. Create `MotivationalBanner.tsx`
4. Create `StreakSection.tsx`
5. Create `LearningProgressSection.tsx`
6. Create `MetricsSection.tsx`
7. Create `AdvancedMetricsSection.tsx`
8. Create `ActivityOverviewSection.tsx`
9. Refactor `StatisticsOverview.tsx` to use all components

## Benefits

- ✅ Reusable components across different pages
- ✅ Easier testing and maintenance
- ✅ Better separation of concerns
- ✅ Cleaner, more readable code
- ✅ Easy to add/remove metrics sections
- ✅ Shared styling and patterns
