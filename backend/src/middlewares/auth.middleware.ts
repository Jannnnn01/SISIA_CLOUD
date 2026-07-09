import { NextFunction, Request, Response } from 'express';
import { Role, User } from '../models';
import { auditService } from '../services/audit.service';
import { fail } from '../utils/response';
import { verifyToken } from '../utils/jwt';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return fail(res, 'Token no proporcionado', 401);
  }

  try {
    const tokenPayload = verifyToken(header.replace('Bearer ', ''));
    const user = await User.scope('withPassword').findByPk(tokenPayload.id, { include: [{ model: Role, as: 'role' }] });
    if (!user || user.status !== 'activo') {
      await auditService.log({
        userId: tokenPayload.id,
        action: 'ACCESS_REJECTED',
        module: 'auth',
        recordId: tokenPayload.id,
        description: 'Acceso rechazado por usuario inexistente o inactivo',
        req
      });
      return fail(res, 'Sesión no válida. Inicie sesión nuevamente.', 401);
    }
    if (user.tokenVersion !== tokenPayload.tokenVersion) {
      await auditService.log({
        userId: user.id,
        action: 'ACCESS_REJECTED',
        module: 'auth',
        recordId: user.id,
        description: 'Acceso rechazado por sesión revocada',
        req
      });
      return fail(res, 'La sesión ya no es válida. Inicie sesión nuevamente.', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: (user as any).role?.name || 'Usuario',
      tokenVersion: user.tokenVersion
    };
    return next();
  } catch {
    await auditService.log({
      userId: null,
      action: 'ACCESS_REJECTED',
      module: 'auth',
      recordId: null,
      description: 'Acceso rechazado por token inválido o expirado',
      req
    });
    return fail(res, 'Token inválido o expirado', 401);
  }
};
