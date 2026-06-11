import { api } from './axios';

export const usersApi = {
  list: () => api.get('/users'),
  assignees: () => api.get('/users/assignees'),
  create: (payload: unknown) => api.post('/users', payload),
  get: (id: number | string) => api.get(`/users/${id}`),
  update: (id: number | string, payload: unknown) => api.put(`/users/${id}`, payload),
  changeStatus: (id: number | string, status: string) => api.patch(`/users/${id}/status`, { status })
};
