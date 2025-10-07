export interface User {
  username: string;
  passowrd: string;
}

export interface LoginRequest {
  username: string;
  passowrd: string;
}

export interface SignupRequest {
  username: string;
  passowrd: string;
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
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
};
