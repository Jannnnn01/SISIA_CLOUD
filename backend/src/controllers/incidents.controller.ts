import { Request, Response } from 'express';
import { Incident, Role, User } from '../models';
import { auditService } from '../services/audit.service';
import { fail, success } from '../utils/response';
import { validateIncidentPayload, validateIncidentStatus } from '../validations/incident.validation';

const incidentIncludes = [
  { model: User, as: 'createdBy', include: [{ model: Role, as: 'role' }] },
  { model: User, as: 'assignedTo', include: [{ model: Role, as: 'role' }] }
];

export const incidentsController = {
  async list(req: Request, res: Response) {
    const where = req.user?.role === 'Usuario' ? { createdById: req.user.id } : {};
    const incidents = await Incident.findAll({ where, include: incidentIncludes, order: [['id', 'DESC']] });
    return success(res, incidents);
  },

  async create(req: Request, res: Response) {
    const payload = {
      title: String(req.body.title || '').trim(),
      description: String(req.body.description || '').trim(),
      category: String(req.body.category || '').trim(),
      priority: String(req.body.priority || '').trim()
    };
    const validation = validateIncidentPayload(payload);
    if (validation) return fail(res, validation, 400);

    const canManage = ['Administrador', 'Analista de Seguridad'].includes(req.user?.role || '');
    const incident = await Incident.create({
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      assignedToId: canManage && req.body.assignedToId ? Number(req.body.assignedToId) : null,
      technicalObservation: canManage && req.body.technicalObservation ? String(req.body.technicalObservation).trim() : null,
      createdById: req.user!.id
    });

    await auditService.log({
      userId: req.user?.id,
      action: 'INCIDENT_CREATED',
      module: 'incidents',
      recordId: incident.id,
      description: `Creación de incidente ${incident.title}`,
      req
    });

    return success(res, incident, 'Incidente creado', 201);
  },

  async getById(req: Request, res: Response) {
    const incident = await Incident.findByPk(String(req.params.id), { include: incidentIncludes });
    if (!incident) return fail(res, 'Incidente no encontrado', 404);
    if (req.user?.role === 'Usuario' && incident.createdById !== req.user.id) return fail(res, 'No tiene permisos para este incidente', 403);
    return success(res, incident);
  },

  async update(req: Request, res: Response) {
    const incident = await Incident.findByPk(String(req.params.id));
    if (!incident) return fail(res, 'Incidente no encontrado', 404);
    if (req.user?.role === 'Usuario' && (incident.createdById !== req.user.id || incident.status !== 'pendiente')) {
      return fail(res, 'Solo puede editar incidentes propios en estado pendiente', 403);
    }

    const payload = {
      title: req.body.title ? String(req.body.title).trim() : incident.title,
      description: req.body.description ? String(req.body.description).trim() : incident.description,
      category: req.body.category ? String(req.body.category).trim() : incident.category,
      priority: req.body.priority ? String(req.body.priority).trim() : incident.priority
    };
    const validation = validateIncidentPayload(payload);
    if (validation) return fail(res, validation, 400);

    const canManage = ['Administrador', 'Analista de Seguridad'].includes(req.user?.role || '');
    await incident.update({
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      assignedToId: canManage && req.body.assignedToId !== undefined ? req.body.assignedToId || null : incident.assignedToId,
      technicalObservation: canManage && req.body.technicalObservation !== undefined ? String(req.body.technicalObservation || '').trim() : incident.technicalObservation
    });

    await auditService.log({
      userId: req.user?.id,
      action: 'INCIDENT_UPDATED',
      module: 'incidents',
      recordId: incident.id,
      description: `Edición de incidente ${incident.title}`,
      req
    });

    return success(res, incident, 'Incidente actualizado');
  },

  async changeStatus(req: Request, res: Response) {
    const incident = await Incident.findByPk(String(req.params.id));
    if (!incident) return fail(res, 'Incidente no encontrado', 404);

    const validation = validateIncidentStatus(req.body.status);
    if (validation) return fail(res, validation, 400);

    await incident.update({
      status: req.body.status,
      closedAt: req.body.status === 'cerrado' ? new Date() : incident.closedAt
    });

    await auditService.log({
      userId: req.user?.id,
      action: 'INCIDENT_STATUS_CHANGED',
      module: 'incidents',
      recordId: incident.id,
      description: `Cambio de estado de incidente a ${incident.status}`,
      req
    });

    return success(res, incident, 'Estado de incidente actualizado');
  },

  async assign(req: Request, res: Response) {
    const incident = await Incident.findByPk(String(req.params.id));
    if (!incident) return fail(res, 'Incidente no encontrado', 404);

    const assignedToId = req.body.assignedToId ? Number(req.body.assignedToId) : null;
    if (assignedToId) {
      const assignee = await User.findByPk(assignedToId, { include: [{ model: Role, as: 'role' }] });
      const assigneeRole = (assignee as any)?.role?.name;
      if (!assignee || assignee.status !== 'activo' || !['Administrador', 'Analista de Seguridad'].includes(assigneeRole)) {
        return fail(res, 'Responsable inválido', 400);
      }
    }

    await incident.update({ assignedToId });
    await auditService.log({
      userId: req.user?.id,
      action: 'INCIDENT_ASSIGNED',
      module: 'incidents',
      recordId: incident.id,
      description: assignedToId ? `Incidente asignado al usuario ${assignedToId}` : 'Asignación de incidente removida',
      req
    });

    return success(res, incident, 'Responsable actualizado');
  },

  async close(req: Request, res: Response) {
    const incident = await Incident.findByPk(String(req.params.id));
    if (!incident) return fail(res, 'Incidente no encontrado', 404);

    await incident.update({
      status: 'cerrado',
      technicalObservation: req.body.technicalObservation ? String(req.body.technicalObservation).trim() : incident.technicalObservation,
      closedAt: new Date()
    });

    await auditService.log({
      userId: req.user?.id,
      action: 'INCIDENT_CLOSED',
      module: 'incidents',
      recordId: incident.id,
      description: `Cierre de incidente ${incident.title}`,
      req
    });

    return success(res, incident, 'Incidente cerrado');
  }
};
