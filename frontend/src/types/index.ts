export interface User {
  email: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

// export interface LoginResponse {
//   username: string;
// }

// export interface SignUpResponse {
//   username: string;
//   passowrd: string;
// }

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  accessToken: string | "";
  setAccessToken: React.Dispatch<React.SetStateAction<string | "">>;
  login: (loginRequest: LoginRequest) => Promise<void>;
  signup: (signupRequest: SignupRequest) => Promise<void>;
  logout: () => void;
};

export type ChatNavProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showText?: boolean;
};

export type PaperContextType = {
  docId: string | "";
  setDocId: React.Dispatch<React.SetStateAction<string | "">>;
};

export interface PaperSummary {
  title: string | null;
  summary: string;
  strengths: string[];
  limitations: string[];
  future_directions: string[];
  novelty_score: number;
  technical_depth_score: number;
  clarity_score: number;
  practical_impact_score: number;
  domain: string;
  keywords: string[];
  sources: string[];
}

export interface PaperSummaryCardProps {
  data: PaperSummary;
}
