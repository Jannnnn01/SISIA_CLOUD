export const validateUserPayload = (payload: { name?: string; email?: string; password?: string; roleId?: number }, requirePassword = true) => {
  if (!payload.name) return 'El nombre es obligatorio';
  if (!payload.email) return 'El email es obligatorio';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'Email inválido';
  if (requirePassword && (!payload.password || payload.password.length < 8)) return 'La contraseña debe tener mínimo 8 caracteres';
  if (!requirePassword && payload.password && payload.password.length < 8) return 'La contraseña debe tener mínimo 8 caracteres';
  if (!payload.roleId) return 'El rol es obligatorio';
  return null;
};
