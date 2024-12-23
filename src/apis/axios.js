import axios from "axios";
import { getCookie, removeCookie } from "../utils/cookie";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.referto.site/api"
    : "http://localhost:8000/api";

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
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Origin 헤더가 자동으로 설정되지 않도록 삭제
    if (config.headers.hasOwnProperty("Origin")) {
      delete config.headers["Origin"];
    }

    if (process.env.NODE_ENV === "production") {
      config.url = config.url.replace("http://", "https://");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instanceWithToken.interceptors.response.use(
  (response) => response,
  async (error) => {
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
