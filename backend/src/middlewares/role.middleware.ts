import { NextFunction, Request, Response } from 'express';
import { fail } from '../utils/response';

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, 'No tiene permisos para esta acción', 403);
    }

    return next();
  };
};
