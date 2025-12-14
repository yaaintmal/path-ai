import { Schema, model, Document } from 'mongoose';

export interface ILearningSession extends Document {
  userId: Schema.Types.ObjectId;
  goal: string;
  learningPath?: string; // e.g., topic title
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  status: 'active' | 'completed';
}

const LearningSessionSchema = new Schema<ILearningSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, required: true },
    learningPath: { type: String },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  },
  { timestamps: true }
);

export const LearningSession = model<ILearningSession>('LearningSession', LearningSessionSchema);
