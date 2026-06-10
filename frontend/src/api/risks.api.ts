import { api } from './axios';

export const risksApi = {
  list: () => api.get('/risks')
};
