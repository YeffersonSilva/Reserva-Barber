
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/AppError';

export const requireRole = (role: 'ADMIN' | 'MANAGER' | 'USER' | 'COMPANY_ADMIN') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      throw new AppError('Unauthorized. Admin role required.', 403);
    }
    next();
  };
};
