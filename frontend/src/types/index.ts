export interface User {
  username: string;
  passowrd: string;
}

export type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
};
