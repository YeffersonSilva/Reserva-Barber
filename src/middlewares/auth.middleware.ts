// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { AppError } from '../error/AppError';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError('No token provided', 401);
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
};
