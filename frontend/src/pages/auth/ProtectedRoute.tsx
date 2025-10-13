import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
