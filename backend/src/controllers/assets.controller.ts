import { Request, Response } from 'express';
import { Asset } from '../models';
import { success } from '../utils/response';

export const assetsController = {
  async list(_req: Request, res: Response) {
    const assets = await Asset.findAll({ order: [['id', 'DESC']] });
    return success(res, assets);
  }
};
