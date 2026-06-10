import { Request, Response } from 'express';
import { Control, Risk } from '../models';
import { success } from '../utils/response';

export const controlsController = {
  async list(_req: Request, res: Response) {
    const controls = await Control.findAll({ include: [{ model: Risk, as: 'risk' }], order: [['id', 'DESC']] });
    return success(res, controls);
  }
};
