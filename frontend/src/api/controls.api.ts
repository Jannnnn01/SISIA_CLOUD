import { api } from './axios';

export const controlsApi = {
  list: () => api.get('/controls'),
  create: (payload: unknown) => api.post('/controls', payload),
  get: (id: number | string) => api.get(`/controls/${id}`),
  update: (id: number | string, payload: unknown) => api.put(`/controls/${id}`, payload),
  changeStatus: (id: number | string, status: string) => api.patch(`/controls/${id}/status`, { status })
};
