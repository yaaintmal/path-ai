import { getApiUrl } from '../config/app.config';

export type InteractionActionType =
  | 'learning_start'
  | 'learning_complete'
  | 'bookmark_add'
  | 'bookmark_remove'
  | 'topic_complete'
  | 'theme_generate'
  | 'timer_start'
  | 'timer_stop'
  | 'topic_click';

export interface TrackingContext {
  topicTitle?: string;
  subtopicTitle?: string;
  learningPath?: string;
  goal?: string;
  duration?: number; // in seconds
  sessionId?: string;
  timestamp?: number; // client-side timestamp
}

class AnalyticsTracker {
  private enabled = true;
  private queue: Array<{
    actionType: InteractionActionType;
    context?: TrackingContext;
  }> = [];
  private isProcessing = false;
  private batchInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Batch send interactions every 30 seconds
    this.batchInterval = setInterval(() => {
      this.flushQueue();
    }, 30000);

    // Also flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushQueue();
      });
    }
  }

  /**
   * Track a user interaction
   */
  public track(actionType: InteractionActionType, context?: TrackingContext): void {
    if (!this.enabled) {
      return;
    }

    const enrichedContext: TrackingContext = {
      ...context,
      timestamp: context?.timestamp || Date.now(),
    };

    this.queue.push({
      actionType,
      context: enrichedContext,
    });

    // Flush if queue gets too large (batch of 50)
    if (this.queue.length >= 50) {
      this.flushQueue();
    }
  }

  /**
   * Send queued interactions to backend
   */
  private async flushQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // No auth token, clear queue to avoid memory leak
        this.queue = [];
        this.isProcessing = false;
        return;
      }

      // Send each interaction individually (could be batched in future)
      const requests = this.queue.map((item) =>
        fetch(getApiUrl('/api/interactions/track'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        })
          .then((res) => {
            if (!res.ok) {
              console.warn('[Analytics] Failed to track interaction:', res.status);
            }
          })
          .catch((err) => {
            console.warn('[Analytics] Error tracking interaction:', err);
          })
      );

      await Promise.allSettled(requests);

      // Clear queue after sending
      this.queue = [];
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Force flush all queued interactions
   */
  public flush(): Promise<void> {
    return this.flushQueue();
  }

  /**
   * Disable tracking (for testing or privacy)
   */
  public disable(): void {
    this.enabled = false;
  }

  /**
   * Enable tracking
   */
  public enable(): void {
    this.enabled = true;
  }

  /**
   * Cleanup on app unload
   */
  public destroy(): void {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }
    this.flushQueue();
  }
}

// Global singleton instance
export const tracker = new AnalyticsTracker();

/**
 * Helper: Track learning completion
 */
export const trackTopicCompletion = (
  topicTitle: string,
  learningPath?: string,
  duration?: number
): void => {
  tracker.track('topic_complete', {
    topicTitle,
    learningPath,
    duration,
  });
};

/**
 * Helper: Track bookmark action
 */
export const trackBookmarkAction = (
  actionType: 'bookmark_add' | 'bookmark_remove',
  topicTitle: string
): void => {
  tracker.track(actionType, {
    topicTitle,
  });
};

/**
 * Helper: Track theme/topic click
 */
export const trackTopicClick = (topicTitle: string, learningPath?: string): void => {
  tracker.track('topic_click', {
    topicTitle,
    learningPath,
  });
};

/**
 * Helper: Track learning session start
 */
export const trackLearningStart = (
  topicTitle: string,
  goal?: string,
  learningPath?: string
): void => {
  tracker.track('learning_start', {
    topicTitle,
    goal,
    learningPath,
  });
};

/**
 * Helper: Track learning session complete
 */
export const trackLearningComplete = (
  topicTitle: string,
  duration: number,
  learningPath?: string
): void => {
  tracker.track('learning_complete', {
    topicTitle,
    duration,
    learningPath,
  });
};

/**
 * Helper: Track theme generation
 */
export const trackThemeGeneration = (topicTitle?: string): void => {
  tracker.track('theme_generate', {
    topicTitle,
  });
};

/**
 * Helper: Track timer session
 */
export const trackTimerAction = (
  actionType: 'timer_start' | 'timer_stop',
  goal?: string,
  duration?: number,
  sessionId?: string
): void => {
  tracker.track(actionType, {
    goal,
    duration,
    sessionId,
  });
};
