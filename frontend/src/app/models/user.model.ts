export interface User {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponse {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  adminKey?: string;
}

