import {
  fetchSummaryById,
  fetchUserSummaries,
  generateSummary,
  uploadPaper,
} from "@/api/services/ApiService";
import { useAuth } from "@/hooks/useAuthContext";
import type { LoginRequest, SignupRequest } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (loginRequest: LoginRequest) => {
      return await login(loginRequest);
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
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
  const { signup } = useAuth();
  return useMutation({
    mutationFn: async (signupRequest: SignupRequest) => {
      console.log("signup request in mutate: ", signupRequest);
      return await signup(signupRequest);
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

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return useMutation({
    mutationFn: async (signupRequest: SignupRequest) => {
      console.log("signup request in mutate: ", signupRequest);
      return logout();
    },
    onSuccess: (data) => {
      console.log("Signup successful", data);
      navigate("/");
    },
    onError: (error) => {
      console.log("Signup error: ", error);
      throw error;
    },
  });
};

export const useUploadMutation = () => {
  return useMutation({
    mutationFn: async (file: FormData) => {
      return await uploadPaper(file);
    },
    onError: (error) => {
      console.log("Upload error: ", error);
      throw error;
    },
  });
};

export const useFetchSummaryMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: { docId: string; query: string }) => {
      console.log("fetch summary req: ", data);
      return await generateSummary(data.docId, data.query);
    },
    onSuccess: (data) => {
      console.log("get summary data: ", data);
      navigate(`/summary/${data.doc_id}`, { state: data });
    },
    onError: (error) => {
      console.log("Upload error: ", error);
      throw error;
    },
  });
};

export const useFetchSummaryByIdQuery = (doc_id: string) => {
  return useQuery({
    queryFn: () => fetchSummaryById(doc_id as string),
    queryKey: ["summary", doc_id],
    enabled: !!doc_id,
  });
};

export const useFetchSummariesByUser = () => {
  return useQuery({
    queryFn: () => fetchUserSummaries(),
    queryKey: ["userSummaries"],
  });
};
