import { Request, Response } from 'express';
import { Role, User } from '../models';
import { auditService } from '../services/audit.service';
import { authService } from '../services/auth.service';
import { fail, success } from '../utils/response';
import { comparePassword, hashPassword } from '../utils/password';
import { validateEmailPassword } from '../validations/auth.validation';

export const authController = {
  async login(req: Request, res: Response) {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const validation = validateEmailPassword(email, password);
    if (validation) return fail(res, validation, 400);

    const result = await authService.login(email, password);
    if (!result) return fail(res, 'Credenciales inválidas', 401);

    await auditService.log({
      userId: result.user.id as number,
      action: 'LOGIN',
      module: 'auth',
      recordId: result.user.id as number,
      description: 'Inicio de sesión exitoso',
      req
    });

    return success(res, result, 'Login exitoso');
  },

  async register(req: Request, res: Response) {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const validation = validateEmailPassword(email, password);
    if (!name) return fail(res, 'El nombre es obligatorio', 400);
    if (validation) return fail(res, validation, 400);

    const exists = await User.findOne({ where: { email } });
    if (exists) return fail(res, 'El email ya está registrado', 409);

    const user = await authService.register(name, email, password);
    await auditService.log({
      userId: user?.id,
      action: 'REGISTER',
      module: 'auth',
      recordId: user?.id,
      description: 'Registro de usuario',
      req
    });

    return success(res, user, 'Usuario registrado', 201);
  },

  async me(req: Request, res: Response) {
    const user = await User.findByPk(req.user?.id, { include: [{ model: Role, as: 'role' }] });
    if (!user) return fail(res, 'Usuario no encontrado', 404);
    return success(res, user);
  },

  async updateProfile(req: Request, res: Response) {
    const name = String(req.body.name || '').trim();
    if (!name) return fail(res, 'El nombre es obligatorio', 400);
    if (name.length > 120) return fail(res, 'El nombre no puede superar 120 caracteres', 400);

    const user = await User.findByPk(req.user?.id, { include: [{ model: Role, as: 'role' }] });
    if (!user) return fail(res, 'Usuario no encontrado', 404);

    await user.update({ name });
    await auditService.log({
      userId: user.id,
      action: 'PROFILE_UPDATED',
      module: 'auth',
      recordId: user.id,
      description: 'Edición de perfil',
      req
    });

    const updated = await User.findByPk(user.id, { include: [{ model: Role, as: 'role' }] });
    return success(res, updated, 'Perfil actualizado');
  },

  async changePassword(req: Request, res: Response) {
    const currentPassword = String(req.body.currentPassword || '');
    const newPassword = String(req.body.newPassword || '');
    if (!currentPassword || !newPassword) return fail(res, 'Contraseña actual y nueva contraseña son obligatorias', 400);
    if (newPassword.length < 8) return fail(res, 'La nueva contraseña debe tener mínimo 8 caracteres', 400);

    const user = await User.scope('withPassword').findByPk(req.user?.id);
    if (!user) return fail(res, 'Usuario no encontrado', 404);

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) return fail(res, 'La contraseña actual no es correcta', 400);

    await user.update({ password: await hashPassword(newPassword) });
    await auditService.log({
      userId: user.id,
      action: 'PASSWORD_CHANGED',
      module: 'auth',
      recordId: user.id,
      description: 'Cambio de contraseña',
      req
    });

    return success(res, null, 'Contraseña actualizada');
  },

  async logout(req: Request, res: Response) {
    await auditService.log({
      userId: req.user?.id,
      action: 'LOGOUT',
      module: 'auth',
      recordId: req.user?.id,
      description: 'Cierre de sesión',
      req
    });

    return success(res, null, 'Sesión cerrada');
  }
};
