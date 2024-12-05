import axios from "axios";
import { getCookie } from "../utils/cookie";

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://ec2-43-201-56-176.ap-northeast-2.compute.amazonaws.com/api'
  : 'http://localhost:8000/api';

// Update base URL configuration
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = getCookie("csrftoken");

export const instance = axios.create({
  baseURL: BASE_URL
});

export const instanceWithToken = axios.create({
  baseURL: BASE_URL
});

instanceWithToken.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token') || getCookie("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instanceWithToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) {
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await instance.post("/user/auth/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        document.cookie = `access_token=${newAccessToken}; path=/`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        localStorage.removeItem('access_token');
        document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
