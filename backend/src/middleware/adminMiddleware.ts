import type { RequestHandler } from 'express';
import { User } from '#models';

export const adminMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findById(userId).select('roles');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!Array.isArray(user.roles) || !user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }
    next();
  } catch (err) {
    console.error('[AdminMiddleware] Error checking admin role:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default adminMiddleware;
