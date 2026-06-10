export const validateEmailPassword = (email?: string, password?: string) => {
  if (!email || !password) return 'Email y contraseña son obligatorios';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido';
  if (password.length < 8) return 'La contraseña debe tener mínimo 8 caracteres';
  return null;
};
