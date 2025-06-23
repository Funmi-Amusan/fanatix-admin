export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    data: {
      admin: LoggedInUser;
      token: string;
    };
    refreshToken: string;
    message: string;
  }
  
  export interface LoggedInUser {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthState {
    token: string;
    refreshToken: string;
    isAuthenticated: boolean;
  }