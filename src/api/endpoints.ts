import { getAuthTokens } from '@/lib/storage';
import { httpClient } from './httpClient';
import type { LoginRequest, LoginResponse } from './types/auth';
import type { FetchUsersParams, User, UserResponse, UsersResponse } from './types/users';

export const authEndpoints = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>('/admin/authentication/login', credentials);
  },
  
//   logout: async (token: string) => {
//     return httpClient.post('/admin/authentication/logout', {});
//   },
  
//   refreshToken: async (refreshToken: string) => {
//     return httpClient.post('/admin/authentication/refresh', { refreshToken });
//   }
};

export const userEndpoints = {
    fetchUsers: async (params: FetchUsersParams = {}): Promise<UsersResponse> => {
      const { token } = getAuthTokens();
      const queryString = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        ...(params.search && { search: params.search }),
        ...(params.role && { role: params.role }),
      }).toString();
      
      return httpClient.get<UsersResponse>(`/admin/user?${queryString}`, token);
    },
  
   
    fetchUserById: async (userId: string): Promise<UserResponse> => {
      const { token } = getAuthTokens();
      return httpClient.get<UserResponse>(`/admin/user/${userId}`, token);
    },
  

    createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserResponse> => {
      const { token } = getAuthTokens();
      return httpClient.post<UserResponse>('/admin/users', userData, token);
    },

    // updateUser: async (userId: string, userData: Partial<User>): Promise<UserResponse> => {
    //   const { token } = getAuthTokens();
    //   return httpClient.put<UserResponse>(`/admin/users/${userId}`, userData, token);
    // },
  

    // deleteUser: async (userId: string): Promise<{ message: string }> => {
    //   const { token } = getAuthTokens();
    //   return httpClient.delete<{ message: string }>(`/admin/users/${userId}`, token);
    // }
  };
  