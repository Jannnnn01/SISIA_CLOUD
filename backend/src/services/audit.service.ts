import { Request } from 'express';
import { AuditLog } from '../models';

interface AuditInput {
  userId?: number | null;
  action: string;
  module: string;
  recordId?: number | null;
  description: string;
  req?: Request;
}

export const auditService = {
  async log(input: AuditInput) {
    await AuditLog.create({
      userId: input.userId ?? null,
      action: input.action,
      module: input.module,
      recordId: input.recordId ?? null,
      description: input.description,
      ipAddress: input.req?.ip || null,
      userAgent: input.req?.headers['user-agent'] || null
    });
  }
};
