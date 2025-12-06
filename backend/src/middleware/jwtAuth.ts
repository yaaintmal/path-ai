import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error('[Auth] Authorization header is missing');
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('[Auth] Token is missing from header:', authHeader);
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    console.log('[Auth] Verifying token with JWT_SECRET length:', JWT_SECRET.length);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('[Auth] Token verified successfully for user:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('[Auth] Token verification failed:', err instanceof Error ? err.message : err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const generateToken = (userId: string): string => {
  console.log(
    '[Auth] Generating token for user:',
    userId,
    'with JWT_SECRET length:',
    JWT_SECRET.length
  );
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  console.log('[Auth] Token generated successfully');
  return token;
};
