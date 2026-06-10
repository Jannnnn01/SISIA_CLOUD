import { api } from './axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export const authApi = {
  login: (payload: LoginPayload) => api.post('/auth/login', payload),
  register: (payload: RegisterPayload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me')
};
