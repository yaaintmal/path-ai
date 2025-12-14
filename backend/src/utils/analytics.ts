import { UserInteraction } from '../models/index.ts';
import { critical } from './logger.ts';

export interface InteractionData {
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
  userId: string;
  context?: {
    topicTitle?: string;
    subtopicTitle?: string;
    learningPath?: string;
    goal?: string;
    duration?: number;
    sessionId?: string;
    timestamp?: number;
  };
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Detects suspicious behavior patterns in user interactions
 * Returns array of suspicious flags if found
 */
export const detectSuspiciousBehavior = async (
  userId: string,
  actionType: string,
  timeWindowMs: number = 60000 // 1 minute default window
): Promise<string[]> => {
  const suspiciousFlags: string[] = [];

  // Get recent interactions for this user
  const recentInteractions = await (UserInteraction as any).find({
    userId,
    createdAt: { $gte: new Date(Date.now() - timeWindowMs) },
  });

  // Flag 1: Too many topic clicks in short time (possible clicking spam)
  const topicClicks = recentInteractions.filter((i: any) => i.actionType === 'topic_click');
  if (topicClicks.length > 15) {
    // More than 15 clicks per minute
    suspiciousFlags.push('RAPID_TOPIC_CLICKS');
  }

  // Flag 2: Topic completion without learning_start (direct completion)
  if (
    actionType === 'topic_complete' &&
    !recentInteractions.some((i: any) => i.actionType === 'learning_start')
  ) {
    suspiciousFlags.push('COMPLETION_WITHOUT_START');
  }

  // Flag 3: Multiple completions without actual learning time
  const completions = recentInteractions.filter((i: any) => i.actionType === 'topic_complete');
  if (completions.length > 5) {
    // Check if they all happened within seconds of each other
    const timeDiffs = completions
      .sort((a: any, b: any) => a.createdAt - b.createdAt)
      .slice(1)
      .map((c: any, i: number) => c.createdAt - completions[i].createdAt);

    const allRapid = timeDiffs.every((diff: number) => diff < 2000); // All within 2 seconds
    if (allRapid) {
      suspiciousFlags.push('RAPID_BATCH_COMPLETION');
    }
  }

  // Flag 4: Impossible timer session (unrealistic duration)
  if (actionType === 'timer_stop' && recentInteractions.length > 0) {
    const timerStart = recentInteractions.find((i: any) => i.actionType === 'timer_start');
    if (timerStart) {
      const duration = new Date().getTime() - new Date(timerStart.createdAt).getTime();
      // Sessions longer than 12 hours are suspicious
      if (duration > 12 * 60 * 60 * 1000) {
        suspiciousFlags.push('UNREALISTIC_SESSION_DURATION');
      }
    }
  }

  // Flag 5: Client timestamp drift (more than 5 minutes off)
  if (recentInteractions.length > 0) {
    const lastInteraction = recentInteractions[recentInteractions.length - 1];
    const serverTime = new Date().getTime();
    const clientTime = lastInteraction.context?.timestamp || serverTime;
    const drift = Math.abs(serverTime - clientTime);

    if (drift > 5 * 60 * 1000) {
      suspiciousFlags.push('TIMESTAMP_DRIFT');
    }
  }

  return suspiciousFlags;
};

/**
 * Logs a user interaction to the database
 */
export const logUserInteraction = async (data: InteractionData): Promise<void> => {
  try {
    const suspiciousFlags = await detectSuspiciousBehavior(data.userId, data.actionType);

    const interaction = new (UserInteraction as any)({
      userId: data.userId,
      actionType: data.actionType,
      context: data.context || {},
      metadata: {
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        suspiciousFlags: suspiciousFlags.length > 0 ? suspiciousFlags : undefined,
      },
    });

    await interaction.save();

    // If suspicious behavior detected, log it for review and write to critical log
    if (suspiciousFlags.length > 0) {
      const flagList = suspiciousFlags.join(',');
      critical(
        `[SUSPICIOUS] user=${data.userId} flags=${flagList} action=${data.actionType} context=${JSON.stringify(
          data.context || {}
        )}`
      );
    }
  } catch (error) {
    console.error('[Analytics] Failed to log interaction:', error);
    // Don't throw - tracking should not break the app
  }
};

/**
 * Gets user activity statistics for a time period
 */
export const getUserStats = async (
  userId: string,
  days: number = 7
): Promise<{
  totalInteractions: number;
  actionBreakdown: Record<string, number>;
  topicsCompleted: number;
  learningTime: number; // in minutes
  suspiciousCount: number;
}> => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const interactions = await (UserInteraction as any).find({
    userId,
    createdAt: { $gte: startDate },
  });

  const actionBreakdown: Record<string, number> = {};
  let totalLearningTime = 0;

  interactions.forEach((interaction: any) => {
    actionBreakdown[interaction.actionType] = (actionBreakdown[interaction.actionType] || 0) + 1;

    // Sum up learning durations
    if (interaction.context?.duration) {
      totalLearningTime += interaction.context.duration;
    }
  });

  const suspiciousCount = interactions.filter(
    (i: any) => i.metadata?.suspiciousFlags?.length > 0
  ).length;

  return {
    totalInteractions: interactions.length,
    actionBreakdown,
    topicsCompleted: actionBreakdown['topic_complete'] || 0,
    learningTime: Math.round(totalLearningTime / 60),
    suspiciousCount,
  };
};

/**
 * Detects if a user might be cheating based on interaction history
 */
export const assessCheatingRisk = async (
  userId: string
): Promise<{
  riskLevel: 'low' | 'medium' | 'high';
  evidence: string[];
  recommendation: string;
}> => {
  const stats = await getUserStats(userId, 7);
  const evidence: string[] = [];
  let riskScore = 0;

  // Check for suspicious completion patterns
  const completionRate = stats.actionBreakdown['topic_complete'] || 0;
  const learningTime = stats.learningTime;

  // More than 20 topics completed with less than 1 hour of actual learning time = suspicious
  if (completionRate > 20 && learningTime < 60) {
    evidence.push(
      `High topic completion rate (${completionRate}) with low learning time (${learningTime}m)`
    );
    riskScore += 3;
  }

  // Too many rapid topic clicks
  if ((stats.actionBreakdown['topic_click'] || 0) > 100) {
    evidence.push(`Excessive topic clicks (${stats.actionBreakdown['topic_click']})`);
    riskScore += 2;
  }

  // Multiple interactions with no learning sessions
  const learningStarts = stats.actionBreakdown['learning_start'] || 0;
  const totalActions = stats.totalInteractions;
  if (learningStarts === 0 && totalActions > 10) {
    evidence.push('Multiple interactions with no learning sessions');
    riskScore += 2;
  }

  // Suspicious activity flags
  if (stats.suspiciousCount > 5) {
    evidence.push(`Multiple suspicious interactions detected (${stats.suspiciousCount})`);
    riskScore += 2;
  }

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 6) {
    riskLevel = 'high';
  } else if (riskScore >= 3) {
    riskLevel = 'medium';
  }

  const recommendation =
    riskLevel === 'high'
      ? 'Manual review recommended. Consider point adjustment or account flag.'
      : riskLevel === 'medium'
        ? 'Monitor account. Pattern suggests possible gaming behavior.'
        : 'No concerns detected.';

  return {
    riskLevel,
    evidence,
    recommendation,
  };
};
