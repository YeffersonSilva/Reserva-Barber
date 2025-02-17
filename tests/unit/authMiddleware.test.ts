// tests/unit/authMiddleware.test.ts
import { authMiddleware } from '../../src/middlewares/auth.middleware';
import { AppError } from '../../src/error/AppError';
import { signToken } from '../../src/utils/token';

describe('authMiddleware', () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
  });

  it('should throw an error if no token is provided', () => {
    expect(() => authMiddleware(req, res, next)).toThrow(AppError);
  });

  it('should throw an error if the token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    expect(() => authMiddleware(req, res, next)).toThrow(AppError);
  });

  it('should attach the decoded token to req.user if the token is valid', () => {
    const payload = { id: 1, role: 'ADMIN', companyId: 1 };
    const token = signToken(payload, '15m');
    req.headers.authorization = `Bearer ${token}`;
    authMiddleware(req, res, next);
    expect(req.user).toEqual(expect.objectContaining(payload));
    expect(next).toHaveBeenCalled();
  });
});
