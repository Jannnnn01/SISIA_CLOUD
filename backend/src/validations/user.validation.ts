import { validatePasswordPolicy } from './password.validation';

export const validateUserPayload = (payload: { name?: string; email?: string; password?: string; roleId?: number }, requirePassword = true) => {
  if (!payload.name) return 'El nombre es obligatorio';
  if (payload.name.length > 120) return 'El nombre no puede superar 120 caracteres';
  if (!payload.email) return 'El email es obligatorio';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'Email inválido';
  if (requirePassword) {
    const passwordError = validatePasswordPolicy(payload.password);
    if (passwordError) return passwordError;
  }
  if (!requirePassword && payload.password) {
    const passwordError = validatePasswordPolicy(payload.password);
    if (passwordError) return passwordError;
  }
  if (!payload.roleId) return 'El rol es obligatorio';
  return null;
};
