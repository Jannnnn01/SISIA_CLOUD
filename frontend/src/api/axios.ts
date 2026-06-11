import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL;

if (!apiBaseUrl) {
  throw new Error('VITE_API_URL no está configurada');
}

export const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sisia_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('sisia_token');
      if (!window.location.pathname.includes('/login')) {
        window.dispatchEvent(new CustomEvent('sisia:session-expired'));
      }
    }
    return Promise.reject(error);
  }
);
