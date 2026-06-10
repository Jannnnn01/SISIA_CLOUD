import { api } from './axios';

export const controlsApi = {
  list: () => api.get('/controls')
};
