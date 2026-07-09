export const validateIncidentPayload = (payload: { title?: string; description?: string; category?: string; priority?: string }) => {
  if (!payload.title) return 'El título es obligatorio';
  if (payload.title.length > 160) return 'El título no puede superar 160 caracteres';
  if (!payload.description) return 'La descripción es obligatoria';
  if (!payload.category) return 'La categoría es obligatoria';
  if (payload.category.length > 80) return 'La categoría no puede superar 80 caracteres';
  if (!payload.priority) return 'La prioridad es obligatoria';
  if (!['baja', 'media', 'alta', 'critica'].includes(payload.priority)) return 'Prioridad inválida';
  return null;
};

export const validateIncidentStatus = (status?: string) => {
  if (!status) return 'El estado es obligatorio';
  if (!['pendiente', 'en_proceso', 'cerrado', 'inactivo'].includes(status)) return 'Estado inválido';
  return null;
};
