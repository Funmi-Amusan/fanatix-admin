export interface addAdminRequest {
    name: string;
    email: string;
    password: string;
    roles: ('viewer'| 'sales'| 'hr'| 'super'| 'coach')[]
  }

  export interface addAdminResponse {
    data: {
      password: string;
    };
    message: string;
  }

  export interface AdminUser {
    id: string;
    name: string;
    email: string;
    password: string;
    emailVerified: boolean;
    status: 'approved' | 'pending' | 'suspended';
    roles: ('viewer' | 'sales' | 'hr' | 'super' | 'coach')[];
    createdAt: string;
    updatedAt: string;
  }

  export interface FetchAdminsParams {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
}

export interface AdminsResponse {
    meta: {
      currentPage: string;
      totalPages:string
    };
    data: {
        admins: AdminUser[]
    }
    total: number;
    page: number;
    limit: number;
    message: string;
}