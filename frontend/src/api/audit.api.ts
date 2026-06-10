import { api } from './axios';

export const auditApi = {
  list: () => api.get('/audit')
};
