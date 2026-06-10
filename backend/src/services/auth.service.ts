import { Role, User } from '../models';
import { comparePassword, hashPassword } from '../utils/password';
import { signToken } from '../utils/jwt';

const publicUser = (user: User) => {
  const json = user.toJSON() as unknown as Record<string, unknown>;
  delete json.password;
  return json;
};

export const authService = {
  async login(email: string, password: string) {
    const user = await User.scope('withPassword').findOne({ where: { email: email.trim().toLowerCase() }, include: [{ model: Role, as: 'role' }] });
    if (!user || user.status !== 'activo') return null;

    const valid = await comparePassword(password, user.password);
    if (!valid) return null;

    const role = (user as any).role?.name || 'Usuario';
    const token = signToken({ id: user.id, email: user.email, role });
    return { token, user: publicUser(user) };
  },

  async register(name: string, email: string, password: string) {
    const role = await Role.findOne({ where: { name: 'Usuario' } });
    if (!role) throw new Error('Rol Usuario no configurado');

    const hashed = await hashPassword(password);
    const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: hashed, roleId: role.id });
    const fullUser = await User.findByPk(user.id, { include: [{ model: Role, as: 'role' }] });
    return fullUser;
  }
};
