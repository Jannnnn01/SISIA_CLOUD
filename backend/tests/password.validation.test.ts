import { describe, expect, it } from 'vitest';
import { validatePasswordPolicy } from '../src/validations/password.validation';

describe('validatePasswordPolicy', () => {
  it('acepta una contraseña fuerte', () => {
    expect(validatePasswordPolicy('Sisia2026*')).toBeNull();
  });

  it('rechaza contraseñas débiles o con espacios', () => {
    expect(validatePasswordPolicy('corta1*')).toContain('mínimo 10');
    expect(validatePasswordPolicy('sisia2026*')).toContain('mayúscula');
    expect(validatePasswordPolicy('SISIA2026*')).toContain('minúscula');
    expect(validatePasswordPolicy('SisiaSegura*')).toContain('número');
    expect(validatePasswordPolicy('Sisia20260')).toContain('carácter especial');
    expect(validatePasswordPolicy('Sisia 2026*')).toContain('espacios');
  });
});
