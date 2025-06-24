import { useQuery } from '@tanstack/react-query';
import { adminEndpoints } from '@/api/endpoints';
import type { UsersResponse } from '@/api/types/users';
import type { FetchAdminsParams } from '@/api/types/auth';

export const useAdminsQuery = (params: FetchAdminsParams = {}) => {
  return useQuery<UsersResponse, Error>({
    queryKey: ['admins', params],
    queryFn: () => adminEndpoints.fetchAdmins(params),
    staleTime: 5 * 60 * 1000 * 1000,
  });
};
