import jwt from 'jsonwebtoken';
import { envConfig } from '../config/envConfig';

const { JWT_SECRET } = envConfig;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

export const signToken = (payload: object, expiresIn: string | number): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
