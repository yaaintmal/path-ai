import { Schema, model, Document } from 'mongoose';

export interface IOnboardingData {
  role?: string;
  level?: string;
  goals?: string[];
  subjects?: string[];
  nativeLanguage?: string;
  preferredLanguage?: string; // language preferred for Path AI (used for LLM prompts)
  skillLevels?: Array<{ subject: string; level: number }>;
  learningType?: string[];
  weeklyHours?: number;
  schedule?: string;
  bestTime?: string[];
  gamification?: string;
  rewards?: string[];
  communicationStyle?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  type: 'topic' | 'subtopic';
  addedAt: Date;
}

export interface LearnedTopic {
  id: string;
  title: string;
  type: 'topic' | 'subtopic';
  completedAt: Date;
  score: number;
}

export interface IStreaks {
  current: number;
  best: number;
  lastActivityDate?: Date;
}

export interface ActiveBoost {
  source?: string; // e.g. "xp_boost_24h"
  multiplier: number;
  expiresAt: Date;
}

export interface IUser extends Document {
  // Profile fields
  name: string;
  email: string;
  password: string;
  roles: string[];
  tokenVersion: number;
  refreshToken?: string;

  // Learning/Gamification fields
  onboardingData?: IOnboardingData;
  bookmarks: Bookmark[];
  learnedTopics: LearnedTopic[];
  streaks: IStreaks;
  totalScore: number;
  wallet: number;
  activeBoosts?: ActiveBoost[];

  createdAt: Date;
  updatedAt: Date;
}

const OnboardingSchema = new Schema<IOnboardingData>(
  {
    role: { type: String },
    level: { type: String },
    goals: [{ type: String }],
    subjects: [{ type: String }],
    skillLevels: [
      {
        subject: { type: String },
        level: { type: Number },
        _id: false,
      },
    ],
    learningType: [{ type: String }],
    weeklyHours: { type: Number },
    schedule: { type: String },
    bestTime: [{ type: String }],
    nativeLanguage: { type: String },
    preferredLanguage: { type: String },
    gamification: { type: String },
    rewards: [{ type: String }],
    communicationStyle: { type: String },
  },
  { _id: false }
);

const BookmarkSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['topic', 'subtopic'], required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LearnedTopicSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['topic', 'subtopic'], required: true },
    completedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);

const StreaksSchema = new Schema<IStreaks>(
  {
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
  },
  { _id: false }
);

const ActiveBoostSchema = new Schema<ActiveBoost>(
  {
    source: { type: String },
    multiplier: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false }
);

export const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      trim: true,
      select: false,
    },
    roles: {
      type: [String],
      default: ['user'],
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    // Learning/Gamification fields
    onboardingData: { type: OnboardingSchema, default: {} },
    bookmarks: [BookmarkSchema],
    learnedTopics: [LearnedTopicSchema],
    streaks: { type: StreaksSchema, default: { current: 0, best: 0 } },
    totalScore: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 },
    activeBoosts: { type: [ActiveBoostSchema], default: [] },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
