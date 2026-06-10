import { Request, Response } from 'express';
import { AuditLog, Incident, User } from '../models';
import { success } from '../utils/response';

export const dashboardController = {
  async show(req: Request, res: Response) {
    const incidentWhere = req.user?.role === 'Usuario' ? { createdById: req.user.id } : {};

    const [usersCount, incidentsCount, auditCount] = await Promise.all([
      User.count({ where: { status: 'activo' } }),
      Incident.count({ where: incidentWhere }),
      AuditLog.count()
    ]);

    return success(res, {
      role: req.user?.role,
      metrics: {
        users: req.user?.role === 'Administrador' ? usersCount : undefined,
        incidents: incidentsCount,
        auditLogs: req.user?.role === 'Administrador' ? auditCount : undefined
      }
    });
  }
};
