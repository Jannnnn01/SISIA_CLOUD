import { NextFunction, Request, Response } from 'express';
import { fail } from '../utils/response';
import { verifyToken } from '../utils/jwt';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return fail(res, 'Token no proporcionado', 401);
  }

  try {
    req.user = verifyToken(header.replace('Bearer ', ''));
    return next();
  } catch {
    return fail(res, 'Token inválido o expirado', 401);
  }
};
