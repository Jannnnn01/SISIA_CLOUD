import { Request, Response } from 'express';
import { Role, User } from '../models';
import { auditService } from '../services/audit.service';
import { authService } from '../services/auth.service';
import { fail, success } from '../utils/response';
import { validateEmailPassword } from '../validations/auth.validation';

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
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
    const { name, email, password } = req.body;
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
  }
};
