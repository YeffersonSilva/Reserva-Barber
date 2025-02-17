// src/utils/token.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { envConfig } from '../config/envConfig';
import ms from 'ms'; // Asegúrate de tener instalada la dependencia "ms"

const { JWT_SECRET } = envConfig;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

const jwtSecret: string = JWT_SECRET;

/**
 * Firma un token JWT usando un payload y una expiración.
 * La expiración puede ser un número o una cadena (por ejemplo, "15m", "3d").
 */
export const signToken = (payload: object, expiresIn: number | string): string => {
  const expiresInOption: number | ms.StringValue =
    typeof expiresIn === 'string'
      ? (expiresIn as unknown as ms.StringValue)
      : expiresIn;
  const options: SignOptions = { expiresIn: expiresInOption };
  return jwt.sign(payload, jwtSecret, options);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, jwtSecret);
};
