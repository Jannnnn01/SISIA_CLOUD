export const calculateRiskLevel = (probability: number, impact: number) => {
  const score = probability * impact;
  if (score >= 16) return { score, level: 'critico' };
  if (score >= 11) return { score, level: 'alto' };
  if (score >= 6) return { score, level: 'medio' };
  return { score, level: 'bajo' };
};
