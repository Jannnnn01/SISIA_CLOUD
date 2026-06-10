import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const signToken = (payload: JwtPayload) => {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
