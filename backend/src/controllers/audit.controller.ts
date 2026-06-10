import { Request, Response } from 'express';
import { AuditLog, User } from '../models';
import { success } from '../utils/response';

export const auditController = {
  async list(_req: Request, res: Response) {
    const logs = await AuditLog.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });
    return success(res, logs);
  }
};
