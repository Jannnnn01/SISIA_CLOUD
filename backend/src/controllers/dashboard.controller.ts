import { Request, Response } from 'express';
import { Asset, AuditLog, Control, Incident, Risk, User } from '../models';
import { success } from '../utils/response';

export const dashboardController = {
  async show(req: Request, res: Response) {
    const incidentWhere = req.user?.role === 'Usuario' ? { createdById: req.user.id } : {};

    const [usersCount, incidentsCount, pendingCount, inProgressCount, closedCount, assetsCount, risksCount, lowRisksCount, mediumRisksCount, highRisksCount, criticalRisksCount, controlsCount, pendingControlsCount, latestAuditLogs] = await Promise.all([
      User.count({ where: { status: 'activo' } }),
      Incident.count({ where: incidentWhere }),
      Incident.count({ where: { ...incidentWhere, status: 'pendiente' } }),
      Incident.count({ where: { ...incidentWhere, status: 'en_proceso' } }),
      Incident.count({ where: { ...incidentWhere, status: 'cerrado' } }),
      Asset.count({ where: { status: 'activo' } }),
      Risk.count({ where: { status: 'activo' } }),
      Risk.count({ where: { status: 'activo', riskLevel: 'bajo' } }),
      Risk.count({ where: { status: 'activo', riskLevel: 'medio' } }),
      Risk.count({ where: { status: 'activo', riskLevel: 'alto' } }),
      Risk.count({ where: { status: 'activo', riskLevel: 'critico' } }),
      Control.count({ where: { status: ['activo', 'implementado'] } }),
      Control.count({ where: { status: 'pendiente' } }),
      AuditLog.findAll({ include: [{ model: User, as: 'user' }], order: [['createdAt', 'DESC']], limit: 5 })
    ]);

    return success(res, {
      role: req.user?.role,
      metrics: {
        users: req.user?.role === 'Administrador' ? usersCount : undefined,
        incidents: incidentsCount,
        pendingIncidents: pendingCount,
        inProgressIncidents: inProgressCount,
        closedIncidents: closedCount,
        assets: req.user?.role === 'Administrador' ? assetsCount : undefined,
        risks: ['Administrador', 'Analista de Seguridad'].includes(req.user?.role || '') ? risksCount : undefined,
        lowRisks: ['Administrador', 'Analista de Seguridad'].includes(req.user?.role || '') ? lowRisksCount : undefined,
        mediumRisks: ['Administrador', 'Analista de Seguridad'].includes(req.user?.role || '') ? mediumRisksCount : undefined,
        highRisks: ['Administrador', 'Analista de Seguridad'].includes(req.user?.role || '') ? highRisksCount + criticalRisksCount : undefined,
        controls: ['Administrador', 'Analista de Seguridad'].includes(req.user?.role || '') ? controlsCount : undefined,
        pendingControls: ['Administrador', 'Analista de Seguridad'].includes(req.user?.role || '') ? pendingControlsCount : undefined
      },
      latestAuditLogs: req.user?.role === 'Administrador' ? latestAuditLogs : []
    });
  }
};
