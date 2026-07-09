import { describe, expect, it } from 'vitest';
import { calculateRiskLevel } from '../src/services/risk.service';

describe('calculateRiskLevel', () => {
  it('clasifica bajo, medio, alto y critico con score probability * impact', () => {
    expect(calculateRiskLevel(1, 5)).toEqual({ score: 5, level: 'bajo' });
    expect(calculateRiskLevel(2, 3)).toEqual({ score: 6, level: 'medio' });
    expect(calculateRiskLevel(3, 4)).toEqual({ score: 12, level: 'alto' });
    expect(calculateRiskLevel(4, 4)).toEqual({ score: 16, level: 'critico' });
  });
});
