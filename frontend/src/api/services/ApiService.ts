import type { LoginRequest, SignupRequest } from "@/types";
import { apiHeader, client, uploadHeader } from "../axios/client";
import axios from "axios";
import { env } from "../config/env";

export const userLogin = async (loginRequest: LoginRequest) => {
  try {
    const response = await client.post(
      "/auth/new-login",
      { ...loginRequest },
      {
        headers: apiHeader,
      }
    );
    console.log("login response: ", response);
    return response.data;
  } catch (error) {
    console.log("login error: ", error);
    throw error;
  }
};

export const userLogout = async () => {
  try {
    const response = await client.post("/auth/new-logout", {});
    console.log("login response: ", response);
    return response.data;
  } catch (error) {
    console.log("login error: ", error);
    throw error;
  }
};

export const userSignUp = async (signUpRequest: SignupRequest) => {
  console.log("singup Request: ", signUpRequest);
  try {
    const response = await client.post(
      "/auth/new-signup",
      { ...signUpRequest },
      {
        headers: apiHeader,
      }
    );
    console.log("signup response: ", response);
    return response.data;
  } catch (error) {
    console.log("signup error: ", error);
    throw error;
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${env.apiBaseUrl}/auth/refresh`,
      {},
      { withCredentials: true } // ensure cookie is sent
    );
    console.log("refreshToken response: ", response);
    return response.data;
  } catch (error) {
    console.log("refreshToken error: ", error);
    throw error;
  }
};

export const uploadPaper = async (file: FormData) => {
  try {
    const response = await client.post("/papers/upload", file, {
      headers: uploadHeader,
    });
    console.log("upload response: ", response);
    return response.data;
  } catch (error) {
    console.log("upload error: ", error);
    throw error;
  }
};

export const generateSummary = async (docId: string, query: string) => {
  console.log("in get summary api call: ", docId, query, apiHeader);
  try {
    const response = await client.post(
      "/summary/generate_summary",
      { docId, query },
      {
        headers: apiHeader,
      }
    );
    console.log("get summary response: ", response);
    return response.data;
  } catch (error) {
    console.log("get summary error: ", error);
    throw error;
  }
};

export const fetchSummaryById = async (docId: string) => {
  console.log("in get summary api call: ", docId, apiHeader);
  try {
    const response = await client.get(`/summary/fetch_summary_by_id/${docId}`, {
      headers: apiHeader,
    });
    console.log("get summary response: ", response);
    return response.data;
  } catch (error) {
    console.log("get summary error: ", error);
    throw error;
  }
};

export const fetchUserSummaries = async () => {
  try {
    const response = await client.get("/summary/by_user", {
      headers: apiHeader,
    });
    console.log("get summary response: ", response);
    return response.data;
  } catch (error) {
    console.log("get summary error: ", error);
    throw error;
  }
};
