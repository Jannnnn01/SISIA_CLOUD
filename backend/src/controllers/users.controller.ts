import { Request, Response } from 'express';
import { Role, User } from '../models';
import { auditService } from '../services/audit.service';
import { hashPassword } from '../utils/password';
import { fail, success } from '../utils/response';
import { validateUserPayload } from '../validations/user.validation';

export const usersController = {
  async list(_req: Request, res: Response) {
    const users = await User.findAll({ include: [{ model: Role, as: 'role' }], order: [['id', 'ASC']] });
    return success(res, users);
  },

  async create(req: Request, res: Response) {
    const payload = {
      ...req.body,
      name: String(req.body.name || '').trim(),
      email: String(req.body.email || '').trim().toLowerCase()
    };
    const validation = validateUserPayload(payload);
    if (validation) return fail(res, validation, 400);

    const exists = await User.findOne({ where: { email: payload.email } });
    if (exists) return fail(res, 'El email ya está registrado', 409);

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: await hashPassword(req.body.password),
      roleId: req.body.roleId,
      status: req.body.status || 'activo'
    });

    await auditService.log({
      userId: req.user?.id,
      action: 'USER_CREATED',
      module: 'users',
      recordId: user.id,
      description: `Creación de usuario ${user.email}`,
      req
    });

    const created = await User.findByPk(user.id, { include: [{ model: Role, as: 'role' }] });
    return success(res, created, 'Usuario creado', 201);
  },

  async getById(req: Request, res: Response) {
    const user = await User.findByPk(String(req.params.id), { include: [{ model: Role, as: 'role' }] });
    if (!user) return fail(res, 'Usuario no encontrado', 404);
    return success(res, user);
  },

  async update(req: Request, res: Response) {
    const user = await User.findByPk(String(req.params.id));
    if (!user) return fail(res, 'Usuario no encontrado', 404);

    await user.update({
      name: req.body.name ? String(req.body.name).trim() : user.name,
      email: req.body.email ? String(req.body.email).trim().toLowerCase() : user.email,
      roleId: req.body.roleId ?? user.roleId
    });

    const updated = await User.findByPk(user.id, { include: [{ model: Role, as: 'role' }] });
    return success(res, updated, 'Usuario actualizado');
  },

  async changeStatus(req: Request, res: Response) {
    const user = await User.findByPk(String(req.params.id));
    if (!user) return fail(res, 'Usuario no encontrado', 404);
    if (!['activo', 'inactivo'].includes(req.body.status)) return fail(res, 'Estado inválido', 400);

    await user.update({ status: req.body.status });
    return success(res, user, 'Estado de usuario actualizado');
  }
};
