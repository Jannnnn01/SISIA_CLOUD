export const validateIncidentPayload = (payload: { title?: string; description?: string; category?: string; priority?: string }) => {
  if (!payload.title) return 'El título es obligatorio';
  if (!payload.description) return 'La descripción es obligatoria';
  if (!payload.category) return 'La categoría es obligatoria';
  if (!payload.priority) return 'La prioridad es obligatoria';
  return null;
};
