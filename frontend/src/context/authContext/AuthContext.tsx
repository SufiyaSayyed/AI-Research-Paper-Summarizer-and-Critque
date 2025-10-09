import { useState } from "react";
import { type User } from "../../types";
import { userLogin, userSignUp } from "../../api/services/ApiService";
import { AuthContext } from "./createAuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    const res = await userLogin(username, password);
    setUser(res);
  };

  const signup = async (username: string, password: string) => {
    const res = await userSignUp(username, password);
    setUser(res);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
