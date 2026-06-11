import { api } from './axios';

export const risksApi = {
  list: () => api.get('/risks'),
  create: (payload: unknown) => api.post('/risks', payload),
  get: (id: number | string) => api.get(`/risks/${id}`),
  update: (id: number | string, payload: unknown) => api.put(`/risks/${id}`, payload),
  changeStatus: (id: number | string, status: string) => api.patch(`/risks/${id}/status`, { status })
};
