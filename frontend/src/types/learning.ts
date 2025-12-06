// Learning Path Types
export interface LearningPathItem {
  title: string;
  titleNormalized: string;
  type: 'starting_point' | 'subtopic';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  addedAt: string;
  firstStartedAt?: string;
  timesStarted: number;
  completedAt?: string;
  totalCompletions: number;
  lastActivityAt: string;
}

export interface CurrentGoal {
  title: string;
  type: 'starting_point' | 'subtopic';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  setAt: string;
}

export interface PathStats {
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  totalStartEvents: number;
  totalCompletionEvents: number;
  avgCompletionTimeMs?: number;
  lastActivityAt?: string;
}

export interface LearningPath {
  id: string;
  baseTopic: string;
  items: LearningPathItem[];
  currentGoal?: CurrentGoal;
  stats: PathStats;
  createdAt: string;
  updatedAt: string;
}

export interface LearningStats {
  path: {
    baseTopic: string;
    totalItems: number;
    completedItems: number;
    inProgressItems: number;
    avgCompletionTimeMs?: number;
  };
  activity: {
    totalClicks: number;
    totalStarts: number;
    totalCompletions: number;
    currentStreak: number;
    longestStreak: number;
  };
  funStats: {
    midnightSessions: number;
    totalEvents: number;
    mostActiveDay?: string;
    firstActivity?: string;
    lastActivity?: string;
  };
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PathsResponse {
  success: boolean;
  paths: LearningPath[];
}

export interface PathResponse {
  success: boolean;
  path: LearningPath;
  message?: string;
}

export interface StatsResponse {
  success: boolean;
  stats: LearningStats;
}
