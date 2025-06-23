import { userEndpoints } from '@/api/endpoints';
import type { FetchUsersParams, UserResponse, UsersResponse } from '@/api/types/users';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useUsersQuery = (
  params: FetchUsersParams = {},
  options?: Omit<UseQueryOptions<UsersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userEndpoints.fetchUsers(params),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    ...options,
  });
};

export const useUserQuery = (
  userId: string,
  options?: Omit<UseQueryOptions<UserResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userEndpoints.fetchUserById(userId),
    enabled: !!userId, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    ...options,
  });
};