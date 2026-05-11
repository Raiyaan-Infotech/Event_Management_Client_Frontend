import axios, { AxiosError } from 'axios';

const API_URL = '/api/proxy/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Response interceptor — on 401, hit /api/logout which clears HttpOnly cookies
// server-side (cannot be cleared by JS), then redirects to /login
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/api/logout';
      }
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export default apiClient;
