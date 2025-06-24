import { getAuthTokens } from "@/lib/storage";
import { httpClient } from "../httpClient";
import type { FetchUsersParams, UsersResponse, UserResponse, User, updateUser } from "../types/users";

export const userEndpoints = {
    fetchUsers: async (params: FetchUsersParams = {}): Promise<UsersResponse> => {
      const { token } = getAuthTokens();
      const queryString = new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)])
      ).toString();      
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

    updateUser: async (userId: string, userData: updateUser): Promise<UserResponse> => {
      const { token } = getAuthTokens();
      return httpClient.put<UserResponse>(`/admin/user/${userId}`, userData, token);
    },  

    deleteUser: async (userId: string): Promise<{ message: string }> => {
      const { token } = getAuthTokens();
      return httpClient.delete<{ message: string }>(`/admin/user/${userId}`, token);
    },

    changeUserInviteCode: async (userId: string): Promise<{userId: string; message: string }> => {
      const { token } = getAuthTokens();
      return httpClient.patch<{ userId: string; message: string }>(`/admin/user/${userId}/invite/change`, token);
    },        
    
    deactivateUserInviteCode: async (userId: string): Promise<{ message: string }> => {
      const { token } = getAuthTokens();
      return httpClient.patch<{ message: string }>(`/admin/user/${userId}/invite/deactivate`, token);
    },

    activateUserInviteCode: async (userId: string): Promise<{ message: string }> => {
      const { token } = getAuthTokens();
      return httpClient.patch<{ message: string }>(`/admin/user/${userId}/invite/activate`, token);
    } 
  };