import { client } from "../axios/client";

export const userLogin = async (username: string, password: string) => {
  try {
    const response = await client.get("/auth/login", {
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
    const response = await client.post("/auth/signup", {
      auth: { username, password },
    });
    console.log("signup response: ", response);
    return response.data;
  } catch (error) {
    console.log("signup error: ", error);
    throw error;
  }
};
