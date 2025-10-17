import axios from "axios";
import { envConfig } from "../config/envConfig";
import { refreshAccessToken } from "../services/ApiService";

export const apiConfig = {
  base_url: envConfig.apiBaseUrl,
  withCredentials: true,
};

export const apiHeader = {
  "Content-Type": "application/json",
};

export const uploadHeader = {
  "Content-Type": "multipart/form-data",
};

// Handlers registered from AuthContext
let getAccessToken: (() => string | null) | null = null;
let setAccessToken: ((token: string) => void) | null = null;

export const registerTokenHandlers = (
  getFn: () => string | null,
  setFn: (token: string) => void
) => {
  getAccessToken = getFn;
  setAccessToken = setFn;
};

// Axios instance
export const client = axios.create({
  baseURL: apiConfig.base_url,
  withCredentials: true,
});

// ---- RACE CONDITION FIX ----
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getAccessToken &&
      setAccessToken
    ) {
      if (isRefreshing) {
        // Wait for current refresh to finish
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(client(originalRequest));
          });
        });
      }

      // Start refresh flow
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const newTokenData = await refreshAccessToken();
        const newAccessToken = newTokenData.access_token;

        // This calls setAccessToken from AuthContext (registered earlier)
        setAccessToken(newAccessToken);

        // Update default headers
        client.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        // Finish refresh
        isRefreshing = false;
        onRefreshed(newAccessToken);

        // Retry original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
