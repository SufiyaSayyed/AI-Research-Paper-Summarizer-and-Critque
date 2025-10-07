import { useContext } from "react";
import { AuthContext } from "./createAuthContext";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("UseAuth must be used within AuthProvider");
  return ctx;
};
