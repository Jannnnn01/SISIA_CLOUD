import axios from 'axios';
import { SESSION_TOKEN_KEY } from './session';

const apiBaseUrl = import.meta.env.VITE_API_URL;

if (!apiBaseUrl) {
  throw new Error('VITE_API_URL no está configurada');
}

export const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      if (!window.location.pathname.includes('/login')) {
        window.dispatchEvent(new CustomEvent('sisia:session-expired'));
      }
    }
    return Promise.reject(error);
  }
);
