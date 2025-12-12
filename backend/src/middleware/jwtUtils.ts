import jwt, { type SignOptions } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';

export const ACCESS_TOKEN_EXP = (process.env.ACCESS_TOKEN_EXP || '15m') as string;
export const REFRESH_TOKEN_EXP = (process.env.REFRESH_TOKEN_EXP || '7d') as string;

export function generateAccessToken(userId: string): string {
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_EXP as string | number };
  return jwt.sign({ userId }, JWT_SECRET, options);
}

export function generateRefreshToken(userId: string): string {
  const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXP as string | number };
  return jwt.sign({ userId }, JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function decodeToken(token: string) {
  try {
    return jwt.decode(token);
  } catch (_) {
    return null;
  }
}
