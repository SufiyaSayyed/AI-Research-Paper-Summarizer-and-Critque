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
  withCredentials: true, // Configure axios to include cookies with each request
});

client.interceptors.response.use(
  (response) => {
    console.log("interceptor response: ", response);
    console.log("header cookie : ", document.cookie);
    return response;
  },
  async (error) => {
    console.log("interceptor error: ", error);
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getAccessToken &&
      setAccessToken
    ) {
      console.log("in if 401 error interceptor");
      originalRequest._retry = true;
      try {
        console.log("in try 401 error interceptor");
        const newAccessToken = await refreshAccessToken();
        console.log("newAccessToken: ", newAccessToken.access_token);
        setAccessToken(newAccessToken.access_token);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken.access_token}`;
        return client(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);
