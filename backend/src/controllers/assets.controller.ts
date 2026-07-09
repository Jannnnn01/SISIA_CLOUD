import { Request, Response } from 'express';
import { Asset } from '../models';
import { auditService } from '../services/audit.service';
import { fail, success } from '../utils/response';

const validateAsset = (payload: ReturnType<typeof normalizeAsset>) => {
  if (!payload.name) return 'El nombre del activo es obligatorio';
  if (payload.name.length > 140) return 'El nombre del activo no puede superar 140 caracteres';
  if (!payload.type) return 'El tipo de activo es obligatorio';
  if (payload.type.length > 80) return 'El tipo de activo no puede superar 80 caracteres';
  if (!payload.owner) return 'El propietario es obligatorio';
  if (payload.owner.length > 120) return 'El propietario no puede superar 120 caracteres';
  if (!payload.confidentialityLevel) return 'El nivel de confidencialidad es obligatorio';
  if (!payload.integrityLevel) return 'El nivel de integridad es obligatorio';
  if (!payload.availabilityLevel) return 'El nivel de disponibilidad es obligatorio';
  if (payload.description && payload.description.length > 2000) return 'La descripción no puede superar 2000 caracteres';
  const levels = ['bajo', 'medio', 'alto'];
  if (!levels.includes(payload.confidentialityLevel) || !levels.includes(payload.integrityLevel) || !levels.includes(payload.availabilityLevel)) {
    return 'Los niveles de seguridad deben ser bajo, medio o alto';
  }
  return null;
};

const normalizeAsset = (body: any) => ({
  name: String(body.name || '').trim(),
  type: String(body.type || '').trim(),
  description: body.description ? String(body.description).trim() : null,
  owner: String(body.owner || '').trim(),
  confidentialityLevel: String(body.confidentialityLevel || '').trim(),
  integrityLevel: String(body.integrityLevel || '').trim(),
  availabilityLevel: String(body.availabilityLevel || '').trim(),
  status: ['activo', 'inactivo'].includes(body.status) ? body.status : 'activo'
});

export const assetsController = {
  async list(_req: Request, res: Response) {
    const assets = await Asset.findAll({ order: [['id', 'DESC']] });
    return success(res, assets);
  },

  async create(req: Request, res: Response) {
    const payload = normalizeAsset(req.body);
    const validation = validateAsset(payload);
    if (validation) return fail(res, validation, 400);

    const asset = await Asset.create(payload);
    await auditService.log({
      userId: req.user?.id,
      action: 'ASSET_CREATED',
      module: 'assets',
      recordId: asset.id,
      description: `Creación de activo ${asset.name}`,
      req
    });

    return success(res, asset, 'Activo creado', 201);
  },

  async getById(req: Request, res: Response) {
    const asset = await Asset.findByPk(String(req.params.id));
    if (!asset) return fail(res, 'Activo no encontrado', 404);
    return success(res, asset);
  },

  async update(req: Request, res: Response) {
    const asset = await Asset.findByPk(String(req.params.id));
    if (!asset) return fail(res, 'Activo no encontrado', 404);

    const payload = normalizeAsset({ ...asset.toJSON(), ...req.body });
    const validation = validateAsset(payload);
    if (validation) return fail(res, validation, 400);

    await asset.update(payload);
    await auditService.log({
      userId: req.user?.id,
      action: 'ASSET_UPDATED',
      module: 'assets',
      recordId: asset.id,
      description: `Edición de activo ${asset.name}`,
      req
    });

    return success(res, asset, 'Activo actualizado');
  },

  async changeStatus(req: Request, res: Response) {
    const asset = await Asset.findByPk(String(req.params.id));
    if (!asset) return fail(res, 'Activo no encontrado', 404);
    if (!['activo', 'inactivo'].includes(req.body.status)) return fail(res, 'Estado inválido', 400);

    await asset.update({ status: req.body.status });
    await auditService.log({
      userId: req.user?.id,
      action: 'ASSET_STATUS_CHANGED',
      module: 'assets',
      recordId: asset.id,
      description: `Cambio de estado de activo a ${asset.status}`,
      req
    });

    return success(res, asset, 'Estado de activo actualizado');
  }
};
