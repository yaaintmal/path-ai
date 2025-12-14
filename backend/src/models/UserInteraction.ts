import { Schema, model, Document } from 'mongoose';

export interface IUserInteraction extends Document {
  userId: string;
  actionType:
    | 'learning_start'
    | 'learning_complete'
    | 'bookmark_add'
    | 'bookmark_remove'
    | 'topic_complete'
    | 'theme_generate'
    | 'timer_start'
    | 'timer_stop'
    | 'topic_click';
  context: {
    topicTitle?: string;
    subtopicTitle?: string;
    learningPath?: string;
    goal?: string;
    duration?: number; // in seconds
    sessionId?: string; // timer session ID
    timestamp?: number; // client-side timestamp for drift detection
  };
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    suspiciousFlags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserInteractionSchema = new Schema<IUserInteraction>(
  {
    userId: { type: String, required: true, index: true },
    actionType: {
      type: String,
      enum: [
        'learning_start',
        'learning_complete',
        'bookmark_add',
        'bookmark_remove',
        'topic_complete',
        'theme_generate',
        'timer_start',
        'timer_stop',
        'topic_click',
      ],
      required: true,
      index: true,
    },
    context: {
      topicTitle: { type: String },
      subtopicTitle: { type: String },
      learningPath: { type: String },
      goal: { type: String },
      duration: { type: Number }, // seconds
      sessionId: { type: String },
      timestamp: { type: Number }, // client timestamp in ms
    },
    metadata: {
      ipAddress: { type: String },
      userAgent: { type: String },
      suspiciousFlags: [{ type: String }],
    },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'user_interactions',
  }
);

// Compound index for efficient querying of user activities
UserInteractionSchema.index({ userId: 1, createdAt: -1 });
UserInteractionSchema.index({ userId: 1, actionType: 1 });

export default model<IUserInteraction>('UserInteraction', UserInteractionSchema);
