import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, accessToken } = useAuth();

  if (!user || !accessToken) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
