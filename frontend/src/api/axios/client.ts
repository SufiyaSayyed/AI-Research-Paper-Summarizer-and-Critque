import axios from "axios";
import { env } from "../config/env";
import { refreshAccessToken } from "../services/ApiService";

export const apiConfig = {
  base_url: env.apiBaseUrl,
  withCredentials: true, // Configure axios to include cookies with each request
};

export const apiHeader = {
  "Content-Type": "application/json",
};

export const uploadHeader = {
  "Content-Type": "multipart/form-data",
};

let getAccessToken: (() => string | null) | null = null;
let setAccessToken: ((token: string) => void) | null = null;

export const registerTokenHandlers = (
  getFn: () => string | null,
  setFn: (token: string) => void
) => {
  getAccessToken = getFn;
  setAccessToken = setFn;
};

export const client = axios.create({
  baseURL: apiConfig.base_url,
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("interceptor error: ", error);
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getAccessToken &&
      setAccessToken
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        setAccessToken(newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);
