import { Request, Response } from 'express';
import { Control, Risk } from '../models';
import { auditService } from '../services/audit.service';
import { fail, success } from '../utils/response';

const normalizeControl = (body: any) => ({
  riskId: Number(body.riskId),
  name: String(body.name || '').trim(),
  description: body.description ? String(body.description).trim() : null,
  type: String(body.type || '').trim(),
  status: ['activo', 'inactivo', 'pendiente', 'implementado'].includes(body.status) ? body.status : 'activo'
});

const validateControl = async (payload: ReturnType<typeof normalizeControl>) => {
  if (!payload.riskId) return 'El riesgo es obligatorio';
  if (!payload.name) return 'El nombre del control es obligatorio';
  if (!payload.type) return 'El tipo de control es obligatorio';
  const risk = await Risk.findByPk(payload.riskId);
  if (!risk || risk.status !== 'activo') return 'Riesgo inválido o inactivo';
  return null;
};

export const controlsController = {
  async list(_req: Request, res: Response) {
    const controls = await Control.findAll({ include: [{ model: Risk, as: 'risk' }], order: [['id', 'DESC']] });
    return success(res, controls);
  },

  async create(req: Request, res: Response) {
    const payload = normalizeControl(req.body);
    const validation = await validateControl(payload);
    if (validation) return fail(res, validation, 400);

    const control = await Control.create(payload);
    await auditService.log({
      userId: req.user?.id,
      action: 'CONTROL_CREATED',
      module: 'controls',
      recordId: control.id,
      description: `Creación de control ${control.name}`,
      req
    });

    return success(res, control, 'Control creado', 201);
  },

  async getById(req: Request, res: Response) {
    const control = await Control.findByPk(String(req.params.id), { include: [{ model: Risk, as: 'risk' }] });
    if (!control) return fail(res, 'Control no encontrado', 404);
    return success(res, control);
  },

  async update(req: Request, res: Response) {
    const control = await Control.findByPk(String(req.params.id));
    if (!control) return fail(res, 'Control no encontrado', 404);

    const payload = normalizeControl({ ...control.toJSON(), ...req.body });
    const validation = await validateControl(payload);
    if (validation) return fail(res, validation, 400);

    await control.update(payload);
    await auditService.log({
      userId: req.user?.id,
      action: 'CONTROL_UPDATED',
      module: 'controls',
      recordId: control.id,
      description: `Edición de control ${control.name}`,
      req
    });

    return success(res, control, 'Control actualizado');
  },

  async changeStatus(req: Request, res: Response) {
    const control = await Control.findByPk(String(req.params.id));
    if (!control) return fail(res, 'Control no encontrado', 404);
    if (!['activo', 'inactivo', 'pendiente', 'implementado'].includes(req.body.status)) return fail(res, 'Estado inválido', 400);

    await control.update({ status: req.body.status });
    await auditService.log({
      userId: req.user?.id,
      action: 'CONTROL_STATUS_CHANGED',
      module: 'controls',
      recordId: control.id,
      description: `Cambio de estado de control a ${control.status}`,
      req
    });

    return success(res, control, 'Estado de control actualizado');
  }
};
