import axios from "axios";
import { getCookie } from "../utils/cookie";

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://ec2-43-201-56-176.ap-northeast-2.compute.amazonaws.com/api'
  : 'http://localhost:8000/api';

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 토큰 갱신 대기중인 요청들을 저장하는 배열
let refreshSubscribers = [];

// 토큰 갱신 후 대기중인 요청들을 처리하는 함수
const onRefreshed = (accessToken) => {
  refreshSubscribers.map(callback => callback(accessToken));
  refreshSubscribers = [];
};

// 실패한 요청을 다시 보내는 함수
const retryOriginalRequest = (originalRequest) =>
  new Promise(resolve => {
    refreshSubscribers.push(accessToken => {
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      resolve(axios(originalRequest));
    });
  });

export const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie("csrftoken")
  }
});

export const instanceWithToken = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie("csrftoken")
  }
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
    const originalRequest = error.config;

    // 네트워크 에러 처리
    if (!error.response) {
      console.error('Network error:', error);
      window.location.replace('/account/login');
      return Promise.reject(error);
    }

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 토큰 갱신 중이면 대기
      if (isRefreshing) {
        return retryOriginalRequest(originalRequest);
      }

      isRefreshing = true;

      try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await instance.post("/user/auth/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        
        // 토큰 저장 (7일 유효)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        
        localStorage.setItem('access_token', newAccessToken);
        document.cookie = `access_token=${newAccessToken}; expires=${expiryDate.toUTCString()}; path=/`;

        // 헤더 업데이트
        instanceWithToken.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 대기 중인 요청들 처리
        onRefreshed(newAccessToken);
        isRefreshing = false;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        isRefreshing = false;
        
        // 토큰 관련 데이터 삭제
        localStorage.removeItem('access_token');
        document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        window.location.replace('/account/login');
        return Promise.reject(refreshError);
      }
    }

    // 다른 401/403 에러 처리
    if (error.response.status === 401 || error.response.status === 403) {
      localStorage.removeItem('access_token');
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.replace('/account/login');
    }

    return Promise.reject(error);
  }
);
