import type { RequestHandler } from 'express';
import { User } from '#models';

export const adminOnly: RequestHandler = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = await (User as any).findById(userId).exec();
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!user.roles || !Array.isArray(user.roles) || user.roles.indexOf('admin') === -1) {
      console.warn(
        `[AdminGuard] Forbidden for user=${userId}, roles=${JSON.stringify(user.roles)}`
      );
      return res.status(403).json({ message: 'Forbidden - admin only' });
    }

    console.log(`[AdminGuard] Access granted for admin user=${userId}`);

    next();
  } catch (err) {
    console.error('[AdminGuard] Error checking admin role', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
