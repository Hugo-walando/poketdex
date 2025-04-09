import axios from 'axios';
import { signOut } from 'next-auth/react';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⛔ Token invalide ou expiré, déconnexion...');
      signOut({ callbackUrl: '/login' }); // Redirige vers page de login
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
