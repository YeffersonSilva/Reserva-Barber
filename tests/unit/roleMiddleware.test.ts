// tests/unit/roleMiddleware.test.ts
import { requireRole } from '../../src/middlewares/roleMiddleware';
import { AppError } from '../../src/error/AppError';

describe('roleMiddleware', () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    req = { user: { role: 'USER' } };
    res = {};
    next = jest.fn();
  });

  it('should call next if the user role is allowed', () => {
    const middleware = requireRole(['USER', 'ADMIN']);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw an error if the user role is not allowed', () => {
    const middleware = requireRole(['ADMIN']);
    expect(() => middleware(req, res, next)).toThrow(AppError);
  });
});
