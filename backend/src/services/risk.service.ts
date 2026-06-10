export const calculateRiskLevel = (probability: number, impact: number) => {
  const score = probability * impact;
  if (score >= 16) return { score, level: 'alto' };
  if (score >= 8) return { score, level: 'medio' };
  return { score, level: 'bajo' };
};
