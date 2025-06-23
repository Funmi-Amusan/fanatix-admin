import { fixtureEndpoints } from '@/api/endpoints';
import type { FetchFixturesParams, FixtureResponse } from '@/api/types/fixtures';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useFixturesQuery = (
  params: FetchFixturesParams = {},
  options?: Omit<UseQueryOptions<FixtureResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fixtureEndpoints.fetchFixtures(params),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    ...options,
  });
};

export const useFixtureQuery = (
  fixtureId: string,
  options?: Omit<UseQueryOptions<FixtureResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['user', fixtureId],
    queryFn: () => fixtureEndpoints.fetchFixtureById(fixtureId),
    enabled: !!fixtureId, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    ...options,
  });
};