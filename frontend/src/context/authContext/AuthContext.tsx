import { useEffect, useState } from "react";
import { type LoginRequest, type SignupRequest, type User } from "../../types";
import {
  refreshAccessToken,
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    registerTokenHandlers(() => accessToken, setAccessToken);
    console.log("useEffect triggered: ", accessToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("in use effect for refresh token", document.cookie);
    const tryRefresh = async () => {
      try {
        const res = await refreshAccessToken();
        console.log("refresh access token response: ", res);
        setAccessToken(res.access_token);
        setUser({ email: res.email, username: res.username });
      } catch (error) {
        console.log("No valid refresh token or refresh failed", error);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    tryRefresh();
  }, []);

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

  return (
    <AuthContext.Provider value={value}>
      {isAuthLoading ? <div>Loading session...</div> : children}
    </AuthContext.Provider>
  );
};
