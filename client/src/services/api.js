import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for all requests
});

// Interceptor to inject JWT Access Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for API errors
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default API;