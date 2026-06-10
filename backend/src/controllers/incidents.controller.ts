import { Request, Response } from 'express';
import { Incident, Role, User } from '../models';
import { auditService } from '../services/audit.service';
import { fail, success } from '../utils/response';
import { validateIncidentPayload } from '../validations/incident.validation';

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
    const validation = validateIncidentPayload(req.body);
    if (validation) return fail(res, validation, 400);

    const incident = await Incident.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
      assignedToId: req.body.assignedToId || null,
      technicalObservation: req.body.technicalObservation || null,
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

    await incident.update({
      title: req.body.title ?? incident.title,
      description: req.body.description ?? incident.description,
      category: req.body.category ?? incident.category,
      priority: req.body.priority ?? incident.priority,
      assignedToId: req.body.assignedToId ?? incident.assignedToId,
      technicalObservation: req.body.technicalObservation ?? incident.technicalObservation
    });

    return success(res, incident, 'Incidente actualizado');
  },

  async changeStatus(req: Request, res: Response) {
    const incident = await Incident.findByPk(String(req.params.id));
    if (!incident) return fail(res, 'Incidente no encontrado', 404);

    const allowed = ['pendiente', 'en_proceso', 'cerrado', 'inactivo'];
    if (!allowed.includes(req.body.status)) return fail(res, 'Estado inválido', 400);

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
  }
};
