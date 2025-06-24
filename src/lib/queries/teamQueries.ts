import { teamEndpoints } from '@/api/endpoints';
import type { FetchTeamsParams, TeamsResponse } from '@/api/types/teams';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useTeamsQuery = (
  params: FetchTeamsParams = {},
  options?: Omit<UseQueryOptions<TeamsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: () => teamEndpoints.fetchTeams(params),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 60 * 60 * 1000, // 1 hour 
    ...options,
  });
};
