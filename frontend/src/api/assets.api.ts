import { api } from './axios';

export const assetsApi = {
  list: () => api.get('/assets')
};
