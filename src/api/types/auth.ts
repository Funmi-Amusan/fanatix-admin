
export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface addAdminRequest {
    name: string;
    email: string;
    password: string;
    roles: 'viewer'| 'sales'| 'hr'| 'super'| 'coach'
  }

  export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
  }
  
  export interface LoginResponse {
    data: {
      admin: LoggedInUser;
      token: string;
    };
    refreshToken: string;
    message: string;
  }

  export interface addAdminResponse {
    data: {
      password: string;
    };
    message: string;
  }

  export interface ChangePasswordResponse {
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

  export interface FetchAdminsParams {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
}

 export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  status: 'approved' | 'pending' | 'suspended';
  roles: 'viewer'| 'sales'| 'hr'| 'super'| 'coach'; 
  createdAt: string;
  updatedAt: string;
}

