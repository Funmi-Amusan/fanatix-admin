import type { AdminUser } from "./admins";

export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
  }
  
  export interface LoginResponse {
    data: {
      admin: AdminUser;
      token: string;
    };
    refreshToken: string;
    message: string;
  }

  export interface ChangePasswordResponse {
    message: string;
  }
  
  export interface AuthState {
    token: string;
    refreshToken: string;
    isAuthenticated: boolean;
  }

