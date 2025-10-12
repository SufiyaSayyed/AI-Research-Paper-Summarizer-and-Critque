import { useEffect, useState } from "react";
import { type LoginRequest, type SignupRequest, type User } from "../../types";
import {
  userLogin,
  userLogout,
  userSignUp,
} from "../../api/services/ApiService";
import { AuthContext } from "./createAuthContext";
import { registerTokenHandlers } from "@/api/axios/client";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    console.log("useEffect triggered: ", accessToken);
    registerTokenHandlers(() => accessToken, setAccessToken);
    console.log("useEffect triggered: ", accessToken);
  }, [accessToken]);

  const login = async (loginRequest: LoginRequest) => {
    const res = await userLogin(loginRequest);
    setUser({ email: res.email, username: res.username });
    setAccessToken(res.access_token);
  };

  const signup = async (singupRequest: SignupRequest) => {
    const res = await userSignUp(singupRequest);
    console.log("in signup context: ", res);
    setUser({ email: res.email, username: res.username });
    setAccessToken(res.access_token);
  };

  const logout = async () => {
    await userLogout();
    setUser(null);
    setAccessToken("");
  };

  const value = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
