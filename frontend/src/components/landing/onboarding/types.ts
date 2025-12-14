export interface OnboardingData {
  role: string;
  level: string;
  goals: string[];
  subjects: string[];
  skillLevels: Array<{ subject: string; level: number }>;
  learningType: string[];
  weeklyHours: number;
  schedule: string;
  bestTime: string[];
  nativeLanguage?: string;
  preferredLanguage?: string;
  gamification: string;
  rewards: string[];
  communicationStyle: string;
}

export interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Role {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ScheduleType {
  id: string;
  label: string;
  description: string;
}

export interface GamificationLevel {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface RewardType {
  id: string;
  label: string;
  icon: string;
}

export interface LearningType {
  id: string;
  label: string;
  icon: string;
}

export interface CommunicationStyle {
  id: string;
  label: string;
  icon: string;
  example: string;
}
