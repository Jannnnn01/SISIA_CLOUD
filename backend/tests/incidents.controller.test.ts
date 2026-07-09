import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/models', () => ({
  Incident: {
    findByPk: vi.fn()
  },
  Role: class Role {},
  User: class User {}
}));

vi.mock('../src/services/audit.service', () => ({
  auditService: { log: vi.fn().mockResolvedValue(undefined) }
}));

import { Incident } from '../src/models';
import { incidentsController } from '../src/controllers/incidents.controller';

const responseMock = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };
  return res as unknown as Response & { status: any; json: any };
};

describe('incidentsController object permissions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('usuario no puede consultar un incidente ajeno', async () => {
    vi.mocked(Incident.findByPk).mockResolvedValue({ id: 10, createdById: 99, status: 'pendiente' } as any);
    const req = { params: { id: '10' }, user: { id: 1, email: 'u@sisia.com', role: 'Usuario', tokenVersion: 0 } } as unknown as Request;
    const res = responseMock();
    await incidentsController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('usuario no puede editar un incidente en proceso', async () => {
    vi.mocked(Incident.findByPk).mockResolvedValue({ id: 10, createdById: 1, status: 'en_proceso' } as any);
    const req = { params: { id: '10' }, body: {}, user: { id: 1, email: 'u@sisia.com', role: 'Usuario', tokenVersion: 0 } } as unknown as Request;
    const res = responseMock();
    await incidentsController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
