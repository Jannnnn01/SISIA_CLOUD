import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/utils/jwt', () => ({
  verifyToken: vi.fn()
}));

vi.mock('../src/models', () => ({
  Role: class Role {},
  User: {
    scope: vi.fn()
  }
}));

vi.mock('../src/services/audit.service', () => ({
  auditService: {
    log: vi.fn()
  }
}));

import { User } from '../src/models';
import { verifyToken } from '../src/utils/jwt';
import { authenticate } from '../src/middlewares/auth.middleware';
import { authorizeRoles } from '../src/middlewares/role.middleware';

const mockedVerifyToken = vi.mocked(verifyToken);
const mockedUser = vi.mocked(User);

const buildApp = () => {
  const app = express();
  app.get('/admin', authenticate, authorizeRoles('Administrador'), (_req, res) => res.json({ ok: true }));
  return app;
};

describe('authenticate and authorizeRoles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve 401 sin token', async () => {
    const response = await request(buildApp()).get('/admin');
    expect(response.status).toBe(401);
  });

  it('devuelve 401 con token inválido', async () => {
    mockedVerifyToken.mockImplementation(() => {
      throw new Error('invalid');
    });
    const response = await request(buildApp()).get('/admin').set('Authorization', 'Bearer invalid');
    expect(response.status).toBe(401);
  });

  it('devuelve 401 cuando el usuario está inactivo', async () => {
    mockedVerifyToken.mockReturnValue({ id: 1, email: 'u@sisia.com', role: 'Administrador', tokenVersion: 0 });
    mockedUser.scope.mockReturnValue({ findByPk: vi.fn().mockResolvedValue({ id: 1, status: 'inactivo' }) } as any);
    const response = await request(buildApp()).get('/admin').set('Authorization', 'Bearer token');
    expect(response.status).toBe(401);
  });

  it('devuelve 401 cuando tokenVersion no coincide', async () => {
    mockedVerifyToken.mockReturnValue({ id: 1, email: 'u@sisia.com', role: 'Administrador', tokenVersion: 0 });
    mockedUser.scope.mockReturnValue({ findByPk: vi.fn().mockResolvedValue({ id: 1, email: 'u@sisia.com', status: 'activo', tokenVersion: 1, role: { name: 'Administrador' } }) } as any);
    const response = await request(buildApp()).get('/admin').set('Authorization', 'Bearer token');
    expect(response.status).toBe(401);
  });

  it('usa el rol actual de base de datos y devuelve 403 si perdió permisos', async () => {
    mockedVerifyToken.mockReturnValue({ id: 1, email: 'u@sisia.com', role: 'Administrador', tokenVersion: 0 });
    mockedUser.scope.mockReturnValue({ findByPk: vi.fn().mockResolvedValue({ id: 1, email: 'u@sisia.com', status: 'activo', tokenVersion: 0, role: { name: 'Usuario' } }) } as any);
    const response = await request(buildApp()).get('/admin').set('Authorization', 'Bearer token');
    expect(response.status).toBe(403);
  });

  it('administrador activo con token vigente puede acceder a ruta protegida', async () => {
    mockedVerifyToken.mockReturnValue({ id: 1, email: 'admin@sisia.com', role: 'Administrador', tokenVersion: 2 });
    mockedUser.scope.mockReturnValue({ findByPk: vi.fn().mockResolvedValue({ id: 1, email: 'admin@sisia.com', status: 'activo', tokenVersion: 2, role: { name: 'Administrador' } }) } as any);
    const response = await request(buildApp()).get('/admin').set('Authorization', 'Bearer token');
    expect(response.status).toBe(200);
  });
});
