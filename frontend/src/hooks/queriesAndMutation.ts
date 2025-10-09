import { userLogin, userSignUp } from "@/api/services/ApiService";
import { useAuth } from "@/context/useAuthContext";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return await userLogin(data.username, data.password);
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setUser(data);
      navigate("/upload"); // Redirect to dashboard/home
    },
    onError: (error) => {
      console.error("Login failed:", error);
      throw error;
    },
  });
};

export const useSignupMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      return await userSignUp(data.username, data.password);
    },
    onSuccess: (data) => {
      console.log("Signup successful", data);
      navigate("/upload");
    },
    onError: (error) => {
      console.log("Signup error: ", error);
      throw error;
    },
  });
};
