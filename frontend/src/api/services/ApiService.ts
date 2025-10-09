import { apiHeader, client, uploadHeader } from "../axios/client";

export const userLogin = async (username: string, password: string) => {
  try {
    const response = await client.get("/auth/login", {
      headers: apiHeader,
      auth: { username, password },
    });
    console.log("login response: ", response);
    return response.data;
  } catch (error) {
    console.log("login error: ", error);
    throw error;
  }
};

export const userSignUp = async (username: string, password: string) => {
  try {
    const response = await client.post(
      "/auth/signup",
      {
        username,
        password,
      },
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

export const getSummary = async (docId: string, query: string) => {
  try {
    const response = await client.post("/summary/from_summary", {docId, query}, {
      headers: apiHeader
    })
    console.log("gt summary response: ", response)
    return response.data;
  } catch(error) {
    console.log("get summary error: ", error);
    throw error;
  }
}