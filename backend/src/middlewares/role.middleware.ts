import { NextFunction, Request, Response } from 'express';
import { auditService } from '../services/audit.service';
import { fail } from '../utils/response';

export const authorizeRoles = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      await auditService.log({
        userId: req.user?.id ?? null,
        action: 'ACCESS_DENIED',
        module: 'authorization',
        recordId: req.user?.id ?? null,
        description: 'Acceso denegado por rol insuficiente',
        req
      });
      return fail(res, 'No tiene permisos para esta acción', 403);
    }

    return next();
  };
};
