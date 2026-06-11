import { Request, Response } from 'express';
import { Role } from '../models';
import { success } from '../utils/response';

export const rolesController = {
  async list(_req: Request, res: Response) {
    const roles = await Role.findAll({ order: [['id', 'ASC']] });
    return success(res, roles);
  }
};
