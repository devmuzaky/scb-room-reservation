import { UserRole, UserStatus } from '@/models/user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: 'admin' | 'staff';
  };
}

export interface AuthUser {
  email: string;
  role: UserRole;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface SetPasswordResponse {
  message: string;
}

export interface ApiError {
  status: 'fail';
  message: string;
}

export interface ApiSuccess {
  status: 'success';
}

export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
}
