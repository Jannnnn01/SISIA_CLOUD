export const validatePasswordPolicy = (password?: string) => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 10) return 'La contraseña debe tener mínimo 10 caracteres';
  if (password.length > 128) return 'La contraseña no puede superar 128 caracteres';
  if (/\s/.test(password)) return 'La contraseña no puede contener espacios';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe incluir al menos una mayúscula';
  if (!/[a-z]/.test(password)) return 'La contraseña debe incluir al menos una minúscula';
  if (!/[0-9]/.test(password)) return 'La contraseña debe incluir al menos un número';
  if (!/[^A-Za-z0-9]/.test(password)) return 'La contraseña debe incluir al menos un carácter especial';
  return null;
};
