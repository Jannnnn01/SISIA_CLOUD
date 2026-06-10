import { api } from './axios';

export const incidentsApi = {
  list: () => api.get('/incidents'),
  create: (payload: unknown) => api.post('/incidents', payload),
  get: (id: number | string) => api.get(`/incidents/${id}`),
  update: (id: number | string, payload: unknown) => api.put(`/incidents/${id}`, payload),
  changeStatus: (id: number | string, status: string) => api.patch(`/incidents/${id}/status`, { status })
};
