import { api } from './axios';

export const assetsApi = {
  list: () => api.get('/assets'),
  create: (payload: unknown) => api.post('/assets', payload),
  get: (id: number | string) => api.get(`/assets/${id}`),
  update: (id: number | string, payload: unknown) => api.put(`/assets/${id}`, payload),
  changeStatus: (id: number | string, status: string) => api.patch(`/assets/${id}/status`, { status })
};
