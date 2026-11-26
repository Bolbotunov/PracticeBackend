export interface UserResponse {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: UserResponse;
  accessToken: string;
}

export interface ErrorResponse {
  error: string;
  details?: Record<string, string[]>;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  accessToken: string;
}
