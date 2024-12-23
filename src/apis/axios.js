import axios from "axios";
import { getCookie, removeCookie } from "../utils/cookie";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";

const BASE_URL = "https://api.referto.site/api";

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (accessToken) => {
  refreshSubscribers.map((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const retryOriginalRequest = (originalRequest) =>
  new Promise((resolve) => {
    refreshSubscribers.push((accessToken) => {
      originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
      resolve(axios(originalRequest));
    });
  });

export const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"),
    Accept: "application/json",
  },
});

export const instanceWithToken = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"),
    Accept: "application/json",
  },
});

instanceWithToken.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("access_token");
    console.log('[Axios] Request interceptor - Access token:', accessToken);
    
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      console.log('[Axios] Added Authorization header:', config.headers["Authorization"]);
    } else {
      console.warn('[Axios] No access token found in cookies');
    }

    console.log('[Axios] Full request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });

    return config;
  },
  (error) => {
    console.error('[Axios] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

instanceWithToken.interceptors.response.use(
  (response) => {
    console.log('[Axios] Response interceptor - Success:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('[Axios] Response interceptor - Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    const originalRequest = error.config;

    if (!error.response) {
      console.error("Network error:", error);
      if (process.env.NODE_ENV === "production") {
        store.dispatch(logout());
        window.location.replace("/account/login");
      }
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return retryOriginalRequest(originalRequest);
      }

      isRefreshing = true;

      try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await instance.post("/user/auth/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        document.cookie = `access_token=${newAccessToken}; path=/; secure; samesite=Lax`;

        instanceWithToken.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        onRefreshed(newAccessToken);
        isRefreshing = false;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        isRefreshing = false;

        removeCookie("access_token");
        removeCookie("refresh_token");
        store.dispatch(logout());

        window.location.replace("/account/login");
        return Promise.reject(refreshError);
      }
    }

    if (error.response.status === 401 || error.response.status === 403) {
      removeCookie("access_token");
      removeCookie("refresh_token");
      store.dispatch(logout());
      window.location.replace("/account/login");
    }

    return Promise.reject(error);
  }
);

instanceWithToken.defaults.withCredentials = true;
instanceWithToken.defaults.headers.common['Accept'] = 'application/json';
instanceWithToken.defaults.headers.common['Content-Type'] = 'application/json';
