import { useQuery } from '@tanstack/react-query';
import { adminEndpoints } from '@/api/endpoints/adminEndpoints';
import type { AdminsResponse, FetchAdminsParams } from '@/api/types/admins';

export const useAdminsQuery = (params: FetchAdminsParams = {}) => {
  return useQuery<AdminsResponse, Error>({
    queryKey: ['admins', params],
    queryFn: () => adminEndpoints.fetchAdmins(params),
    staleTime: 5 * 60 * 1000 * 1000,
  });
};
