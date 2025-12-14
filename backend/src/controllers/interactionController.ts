import type { Request, Response, NextFunction } from 'express';
import { UserInteraction } from '../models/index.ts';
import { logUserInteraction, getUserStats, assessCheatingRisk } from '../utils/analytics.ts';
import { amberLog, success, critical } from '../utils/logger.ts';

/**
 * Track user interaction
 * POST /api/interactions/track
 */
export const trackInteraction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { actionType, context } = req.body;

    if (!actionType) {
      return res.status(400).json({ message: 'actionType is required' });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await logUserInteraction({
      actionType,
      userId: userIdStr,
      context,
      ipAddress,
      userAgent,
    });

    amberLog(
      `[Interactions] User ${userIdStr} action: ${actionType}${context?.topicTitle ? ` (${context.topicTitle})` : ''}`
    );

    res.status(200).json({ message: 'Interaction tracked' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user statistics
 * GET /api/interactions/stats?days=7
 */
export const getUserInteractionStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const days = parseInt(req.query.days as string) || 7;
    const stats = await getUserStats(userIdStr, days);

    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get cheating risk assessment
 * GET /api/interactions/risk-assessment
 */
export const getCheatingRiskAssessment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const assessment = await assessCheatingRisk(userIdStr);

    // If high risk, write critical log for manual review
    if (assessment.riskLevel === 'high') {
      critical(
        `[RISK:HIGH] user=${userIdStr} evidence=${JSON.stringify(assessment.evidence)} recommendation=${assessment.recommendation}`
      );
    }

    res.status(200).json(assessment);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all interactions for a user
 * GET /api/interactions/user/:userId?limit=50&skip=0
 */
export const getUserInteractionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // For now, users can only view their own history
    // In production, add admin role check
    const targetUserId = req.params.userId;
    if (targetUserId !== userIdStr) {
      return res.status(403).json({ message: 'Forbidden - can only view own history' });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
    const skip = parseInt(req.query.skip as string) || 0;

    const interactions = await (UserInteraction as any)
      .find({ userId: targetUserId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await (UserInteraction as any).countDocuments({ userId: targetUserId });

    res.status(200).json({
      interactions,
      total,
      limit,
      skip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get suspicious activity report
 * GET /api/interactions/suspicious?days=7
 */
export const getSuspiciousActivityReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // TODO: Add admin role verification
    // For now, only allow self-assessment

    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const suspiciousInteractions = await (UserInteraction as any)
      .find({
        'metadata.suspiciousFlags': { $exists: true, $not: { $size: 0 } },
        createdAt: { $gte: startDate },
      })
      .sort({ createdAt: -1 })
      .limit(100);

    // Group by user and flag type
    const report: Record<string, { flagCount: number; flags: string[] }> = {};

    suspiciousInteractions.forEach((interaction: any) => {
      if (!report[interaction.userId]) {
        report[interaction.userId] = { flagCount: 0, flags: [] };
      }
      report[interaction.userId]!.flagCount += 1;
      report[interaction.userId]!.flags.push(...(interaction.metadata?.suspiciousFlags || []));
    });

    // Deduplicate flags
    Object.keys(report).forEach((userId) => {
      report[userId]!.flags = [...new Set(report[userId]!.flags)];
    });

    res.status(200).json({
      totalSuspiciousInteractions: suspiciousInteractions.length,
      affectedUsers: Object.keys(report).length,
      report,
    });
  } catch (error) {
    next(error);
  }
};
