// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT automatiquement si dispo
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('session') || '{}')?.user?.token
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
