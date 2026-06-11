import { NextFunction, Request, Response } from 'express';
import { fail } from '../utils/response';
import { verifyToken } from '../utils/jwt';
import { User } from '../models';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return fail(res, 'Token no proporcionado', 401);
  }

  try {
    req.user = verifyToken(header.replace('Bearer ', ''));
    const user = await User.findByPk(req.user.id);
    if (!user || user.status !== 'activo') {
      return fail(res, 'Sesión no válida. Inicie sesión nuevamente.', 401);
    }
    return next();
  } catch {
    return fail(res, 'Token inválido o expirado', 401);
  }
};
