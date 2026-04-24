import axios from 'axios';
import { store } from '../store/store';
import { setToken, logout } from '../slices/authSlice';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
instance.interceptors.request.use(
  (config) => {
    const { token } = store.getState().auth;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Axios: Token attached to request');
    } else {
      console.warn('⚠️ Axios: No token found in Redux store');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = store.getState().auth;
        const response = await axios.post('http://localhost:5000/auth/refresh', {
          refreshToken,
        });

        const { token } = response.data;
        store.dispatch(setToken(token));

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;