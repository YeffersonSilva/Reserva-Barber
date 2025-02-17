// tests/unit/errorHandler.test.ts
import { errorHandler } from '../../src/middlewares/ErrorHandler';
import { AppError } from '../../src/error/AppError';
import { Request, Response, NextFunction } from 'express';

describe('errorHandler', () => {
  let req: Partial<Request>, res: Partial<Response>, next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle an AppError properly', () => {
    const error = new AppError('Test error', 400);
    errorHandler(error, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
  });

  it('should handle a generic error with status 500', () => {
    const error = new Error('Generic error');
    errorHandler(error, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
