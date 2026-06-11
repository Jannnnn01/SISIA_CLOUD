import { Request, Response } from 'express';
import { Asset, Risk } from '../models';
import { auditService } from '../services/audit.service';
import { calculateRiskLevel } from '../services/risk.service';
import { fail, success } from '../utils/response';

const normalizeRisk = (body: any) => {
  const probability = Number(body.probability);
  const impact = Number(body.impact);
  const calculated = calculateRiskLevel(probability, impact);
  return {
    assetId: Number(body.assetId),
    threat: String(body.threat || '').trim(),
    vulnerability: String(body.vulnerability || '').trim(),
    probability,
    impact,
    riskScore: calculated.score,
    riskLevel: calculated.level,
    mitigationPlan: body.mitigationPlan ? String(body.mitigationPlan).trim() : null,
    status: ['activo', 'inactivo'].includes(body.status) ? body.status : 'activo'
  };
};

const validateRisk = async (payload: ReturnType<typeof normalizeRisk>) => {
  if (!payload.assetId) return 'El activo es obligatorio';
  if (!payload.threat) return 'La amenaza es obligatoria';
  if (!payload.vulnerability) return 'La vulnerabilidad es obligatoria';
  if (!Number.isInteger(payload.probability) || payload.probability < 1 || payload.probability > 5) return 'La probabilidad debe estar entre 1 y 5';
  if (!Number.isInteger(payload.impact) || payload.impact < 1 || payload.impact > 5) return 'El impacto debe estar entre 1 y 5';
  const asset = await Asset.findByPk(payload.assetId);
  if (!asset || asset.status !== 'activo') return 'Activo inválido o inactivo';
  return null;
};

export const risksController = {
  async list(_req: Request, res: Response) {
    const risks = await Risk.findAll({ include: [{ model: Asset, as: 'asset' }], order: [['id', 'DESC']] });
    return success(res, risks);
  },

  async create(req: Request, res: Response) {
    const payload = normalizeRisk(req.body);
    const validation = await validateRisk(payload);
    if (validation) return fail(res, validation, 400);

    const risk = await Risk.create(payload);
    await auditService.log({
      userId: req.user?.id,
      action: 'RISK_CREATED',
      module: 'risks',
      recordId: risk.id,
      description: `Creación de riesgo ${risk.threat}`,
      req
    });

    return success(res, risk, 'Riesgo creado', 201);
  },

  async getById(req: Request, res: Response) {
    const risk = await Risk.findByPk(String(req.params.id), { include: [{ model: Asset, as: 'asset' }] });
    if (!risk) return fail(res, 'Riesgo no encontrado', 404);
    return success(res, risk);
  },

  async update(req: Request, res: Response) {
    const risk = await Risk.findByPk(String(req.params.id));
    if (!risk) return fail(res, 'Riesgo no encontrado', 404);

    const payload = normalizeRisk({ ...risk.toJSON(), ...req.body });
    const validation = await validateRisk(payload);
    if (validation) return fail(res, validation, 400);

    await risk.update(payload);
    await auditService.log({
      userId: req.user?.id,
      action: 'RISK_UPDATED',
      module: 'risks',
      recordId: risk.id,
      description: `Edición de riesgo ${risk.threat}`,
      req
    });

    return success(res, risk, 'Riesgo actualizado');
  },

  async changeStatus(req: Request, res: Response) {
    const risk = await Risk.findByPk(String(req.params.id));
    if (!risk) return fail(res, 'Riesgo no encontrado', 404);
    if (!['activo', 'inactivo'].includes(req.body.status)) return fail(res, 'Estado inválido', 400);

    await risk.update({ status: req.body.status });
    await auditService.log({
      userId: req.user?.id,
      action: 'RISK_STATUS_CHANGED',
      module: 'risks',
      recordId: risk.id,
      description: `Cambio de estado de riesgo a ${risk.status}`,
      req
    });

    return success(res, risk, 'Estado de riesgo actualizado');
  }
};
