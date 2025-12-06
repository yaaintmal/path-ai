import type { Request, Response } from 'express';
import { User } from '#models';

export async function getStreak(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize streaks if not exists
    if (!user.streaks) {
      user.streaks = { current: 0, best: 0 };
    }

    // Check if streak should be reset (no activity today and yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (user.streaks.lastActivityDate) {
      const lastActivityDate = new Date(user.streaks.lastActivityDate);
      lastActivityDate.setHours(0, 0, 0, 0);

      // If last activity was more than 1 day ago, reset streak
      if (lastActivityDate.getTime() < yesterday.getTime()) {
        user.streaks.current = 0;
        await user.save();
      }
    }

    // Calculate actual stats from user data
    const topicsLearned = user.learnedTopics?.length || 0;
    const bookmarksCount = user.bookmarks?.length || 0;

    // Calculate weekly learning rate (lessons in last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyLearningRate =
      user.learnedTopics?.filter((topic: any) => new Date(topic.completedAt) >= oneWeekAgo)
        .length || 0;

    // Calculate total days active (days since account creation with at least some activity)
    const accountCreatedAt = user.createdAt ? new Date(user.createdAt) : new Date();
    const daysSinceCreation = Math.max(
      1,
      Math.ceil((Date.now() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24))
    );
    const totalDaysActive = Math.min(daysSinceCreation, user.streaks.best || 1);

    // Calculate average daily engagement (score per active day)
    const averageDailyEngagement =
      totalDaysActive > 0 ? Math.round((user.totalScore || 0) / totalDaysActive) : 0;

    const response = {
      currentStreak: user.streaks.current || 0,
      bestStreak: user.streaks.best || 0,
      totalScore: user.totalScore || 0,
      topicsLearned,
      topicsSearched: bookmarksCount, // Using bookmarks as "searched" topics
      weeklyLearningRate,
      totalLessonsCompleted: topicsLearned,
      totalDaysActive,
      averageDailyEngagement,
      avgTimePerBookmark: 0, // Would need time tracking to calculate
      avgCompletionTime: 0, // Would need time tracking to calculate
    };

    console.log(`Returning streak data for user ${userId}:`, response);
    return res.json(response);
  } catch (error) {
    console.error('Error getting streak:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function recordActivity(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize streaks if not exists
    if (!user.streaks) {
      user.streaks = { current: 0, best: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastActivityDate = user.streaks.lastActivityDate
      ? new Date(user.streaks.lastActivityDate)
      : null;
    lastActivityDate?.setHours(0, 0, 0, 0);

    // If last activity was today, don't increment streak - just return current values
    if (lastActivityDate && lastActivityDate.getTime() === today.getTime()) {
      return res.json({
        currentStreak: user.streaks.current || 0,
        bestStreak: user.streaks.best || 0,
        totalScore: user.totalScore || 0,
        dailyBonusAwarded: 0,
      });
    }

    // Calculate new streak
    let newStreak = user.streaks.current || 0;

    if (!lastActivityDate) {
      // First activity ever - start with streak of 1
      newStreak = 1;
    } else if (lastActivityDate.getTime() === yesterday.getTime()) {
      // Activity on consecutive day - increment streak
      newStreak = newStreak + 1;
    } else {
      // Gap in activity (more than 1 day) - reset to 1
      newStreak = 1;
    }

    user.streaks.current = newStreak;

    // Update best streak
    if (newStreak > (user.streaks.best || 0)) {
      user.streaks.best = newStreak;
    }

    user.streaks.lastActivityDate = new Date();

    // Award daily streak bonus for days 1-2 (flat +100 per day)
    // For days 3+, the multiplier is applied per-topic in awardPointsForLearning
    if (newStreak > 0 && newStreak < 3) {
      // Award the daily streak bonus (+100)
      user.totalScore = (user.totalScore || 0) + 100;
      console.log(`[recordActivity] Awarded daily streak bonus: +100 for day ${newStreak}`);
    }

    await user.save();

    return res.json({
      currentStreak: user.streaks.current,
      bestStreak: user.streaks.best,
      totalScore: user.totalScore,
      dailyBonusAwarded: newStreak > 0 && newStreak < 3 ? 100 : 0,
    });
  } catch (error) {
    console.error('Error recording activity:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
