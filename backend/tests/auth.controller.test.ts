import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/services/auth.service', () => ({
  authService: { login: vi.fn() }
}));

vi.mock('../src/services/audit.service', () => ({
  auditService: { log: vi.fn().mockResolvedValue(undefined) }
}));

vi.mock('../src/models', () => ({
  Role: class Role {},
  User: class User {}
}));

import { authController } from '../src/controllers/auth.controller';
import { auditService } from '../src/services/audit.service';
import { authService } from '../src/services/auth.service';

const responseMock = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };
  return res as unknown as Response & { status: any; json: any };
};

describe('authController login auditing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('login incorrecto registra intento fallido sin contraseña', async () => {
    vi.mocked(authService.login).mockResolvedValue(null);
    const req = {
      body: { email: 'admin@sisia.com', password: 'NoValida2026*' },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'test' }
    } as unknown as Request;
    const res = responseMock();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(auditService.log).toHaveBeenCalledWith(expect.objectContaining({
      userId: null,
      action: 'LOGIN_FAILED',
      description: 'Intento de inicio de sesión fallido'
    }));
    const auditPayload = vi.mocked(auditService.log).mock.calls[0][0];
    expect(`${auditPayload.action} ${auditPayload.module} ${auditPayload.description}`).not.toContain('NoValida2026');
  });
});
