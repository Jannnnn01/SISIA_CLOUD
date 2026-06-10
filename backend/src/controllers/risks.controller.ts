import { Request, Response } from 'express';
import { Asset, Risk } from '../models';
import { success } from '../utils/response';

export const risksController = {
  async list(_req: Request, res: Response) {
    const risks = await Risk.findAll({ include: [{ model: Asset, as: 'asset' }], order: [['id', 'DESC']] });
    return success(res, risks);
  }
};
