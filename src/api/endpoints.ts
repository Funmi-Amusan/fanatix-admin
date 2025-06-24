import { getAuthTokens } from '@/lib/storage';
import { httpClient } from './httpClient';
import type { ChangePasswordRequest, ChangePasswordResponse, LoginRequest, LoginResponse } from './types/auth';
import type { FetchUsersParams, updateUser, User, UserResponse, UsersResponse } from './types/users';
import type { FetchFixturesParams, FixtureResponse, FixturesResponse } from './types/fixtures';
import type { FetchTeamsParams, TeamsResponse } from './types/teams';
import type { FetchTransactionsParams, TransactionResponse, TransactionsResponse } from './types/transactions';
import type { BuyPlanResponse, PlansResponse } from './types/wallet';

export const authEndpoints = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>('/admin/authentication/login', credentials);
  },
  changePassword: async (credentials: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    return httpClient.post<ChangePasswordResponse>('/admin/authentication/password/change', credentials);
  },
};

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
  
  export const fixtureEndpoints = {
    fetchFixtures: async (params: FetchFixturesParams = {}): Promise<FixturesResponse> => {
      const { token } = getAuthTokens();
      const queryString = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        ...(params.search && { search: params.search }),
      }).toString();
      
      return httpClient.get<FixturesResponse>(`/admin/fixture?${queryString}`, token);
    },
  
    fetchFixtureById: async (fixtureId: string): Promise<FixtureResponse> => {
      const { token } = getAuthTokens();
      return httpClient.get<FixtureResponse>(`/admin/fixture/${fixtureId}`, token);
    }
  };

  export const teamEndpoints = {
    fetchTeams: async (params: FetchTeamsParams = {}): Promise<TeamsResponse> => {
      const { token } = getAuthTokens();
      const queryString = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        ...(params.name && { search: params.name }),
      }).toString();
      return httpClient.get<TeamsResponse>(`/team?${queryString}`, token);
    }
  };

  export const walletEndpoints = {
    fetchTransactions: async (userId: string, params: FetchTransactionsParams = {}): Promise<TransactionsResponse> => {
      const { token } = getAuthTokens();
      const queryString = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
      }).toString();
      return httpClient.get<TransactionsResponse>(`/admin/wallet/${userId}/?${queryString}`, token);
    },

    fetchATransaction: async (userId: string, transactionId: string): Promise<TransactionResponse> => {
      const { token } = getAuthTokens();
      return httpClient.get<TransactionResponse>(`/admin/wallet/${userId}/${transactionId}`, token);
    },

    fetchPlans: async (): Promise<PlansResponse> => {
      const { token } = getAuthTokens();
      return httpClient.get<PlansResponse>(`/wallet/plans`, token);
    },

    buyPlans: async (planId: string): Promise<BuyPlanResponse> => {
      const { token } = getAuthTokens();
      return httpClient.get<BuyPlanResponse>(`/wallet/plans/${planId}`, token);
    },
  };