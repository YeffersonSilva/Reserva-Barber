// src/middlewares/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/AppError';

export const requireRole = (allowedRoles: Array<'ADMIN' | 'MANAGER' | 'USER' | 'COMPANY_ADMIN' | 'EMPLOYEE'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError(`Unauthorized. Required role: ${allowedRoles.join(' or ')}`, 403);
    }
    next();
  };
};
