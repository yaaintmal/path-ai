import type { Request, Response, NextFunction } from 'express';
import { LearningSession } from '../models/index.ts';
import { amberLog } from '../utils/logger.ts';
import mongoose from 'mongoose';

export const startSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdStr = req.userId;
    const { goal, learningPath } = req.body;

    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Input validation is handled by TimerStartSessionSchema middleware
    // Schema ensures: goal is string, max 200 chars, no HTML tags
    // Schema trims whitespace and validates learningPath if provided

    // Check if there is already an active session for this user
    const activeSession = await (LearningSession as any).findOne({
      userId: userIdStr,
      status: 'active',
    });
    if (activeSession) {
      return res.status(400).json({ message: 'Session already active', session: activeSession });
    }

    const session = await (LearningSession as any).create({
      userId: userIdStr,
      goal,
      learningPath,
      startTime: new Date(),
      status: 'active',
    });

    const pathInfo = learningPath ? ` | Learning Path: "${learningPath}"` : '';
    amberLog(`[Timer] User ${userIdStr} started learning session | Goal: "${goal}"${pathInfo}`);

    res.status(201).json({ message: 'Session started', session });
  } catch (error) {
    next(error);
  }
};

export const stopSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdStr = req.userId;

    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = await (LearningSession as any).findOne({ userId: userIdStr, status: 'active' });

    if (!session) {
      return res.status(404).json({ message: 'No active session found' });
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000); // seconds

    session.endTime = endTime;
    session.duration = duration;
    session.status = 'completed';
    await session.save();

    const pathInfo = session.learningPath ? ` | Learning Path: "${session.learningPath}"` : '';
    amberLog(
      `[Timer] User ${userIdStr} stopped learning session | Goal: "${session.goal}"${pathInfo} | Duration: ${duration}s`
    );

    res.status(200).json({ message: 'Session stopped', session });
  } catch (error) {
    next(error);
  }
};

export const getActiveSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = await (LearningSession as any).findOne({ userId: userIdStr, status: 'active' });
    res.status(200).json({ session });
  } catch (error) {
    next(error);
  }
};

export const getSessionHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const sessions = await (LearningSession as any)
      .find({ userId: userIdStr, status: 'completed' })
      .sort({ endTime: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await (LearningSession as any).countDocuments({
      userId: userIdStr,
      status: 'completed',
    });

    res.status(200).json({ sessions, total, limit, skip });
  } catch (error) {
    next(error);
  }
};

export const getSessionStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sessions = await (LearningSession as any).find({
      userId: userIdStr,
      status: 'completed',
    });

    const totalSessions = sessions.length;
    const totalMinutes =
      sessions.reduce((sum: number, session: any) => sum + (session.duration || 0), 0) / 60;
    const averageMinutes = totalSessions > 0 ? totalMinutes / totalSessions : 0;

    // Group by goal
    const goalStats: { [key: string]: { count: number; totalMinutes: number } } = {};
    sessions.forEach((session: any) => {
      const goal = session.goal;
      if (!goalStats[goal]) {
        goalStats[goal] = { count: 0, totalMinutes: 0 };
      }
      goalStats[goal]!.count += 1;
      goalStats[goal]!.totalMinutes += (session.duration || 0) / 60;
    });

    // Group by learning path
    const pathStats: { [key: string]: { count: number; totalMinutes: number } } = {};
    sessions.forEach((session: any) => {
      if (session.learningPath) {
        const path = session.learningPath;
        if (!pathStats[path]) {
          pathStats[path] = { count: 0, totalMinutes: 0 };
        }
        pathStats[path]!.count += 1;
        pathStats[path]!.totalMinutes += (session.duration || 0) / 60;
      }
    });

    res.status(200).json({
      totalSessions,
      totalMinutes: Math.round(totalMinutes * 100) / 100,
      averageMinutes: Math.round(averageMinutes * 100) / 100,
      goalStats,
      pathStats,
    });
  } catch (error) {
    next(error);
  }
};
