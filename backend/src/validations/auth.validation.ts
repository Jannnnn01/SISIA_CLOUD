export const validateEmailPassword = (email?: string, password?: string) => {
  if (!email || !password) return 'Email y contraseña son obligatorios';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido';
  return null;
};
