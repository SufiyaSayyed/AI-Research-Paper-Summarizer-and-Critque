import axios from "axios";
import { env } from "../config/env";

export const apiConfig = {
  base_url: env.apiBaseUrl,
};

export const apiHeader = {
  "Content-Type": "application/json",
};

export const uploadHeader = {
  "Content-Type": "multipart/form-data",
};

export const client = axios.create({
  baseURL: apiConfig.base_url,
  // withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    switch (error.response?.status) {
      case 400:
        throw new Error("Bad Request, Please check your input prompt.");
      case 415:
        throw new error(
          "Unsupported Media Type. Invalid file type. Supported file types are jpeg, jpg, png, webp."
        );
      case 429:
        throw new Error(
          "Too Many Requests: Request limit exceeded. Try again later."
        );
      case 500:
        throw new Error(
          "Internal server error occured. Please try again later."
        );
      default:
        throw new Error("Unknown error occurred.");
    }
  }
);
