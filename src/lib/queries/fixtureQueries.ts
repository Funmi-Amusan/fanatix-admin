
import { fixtureEndpoints } from '@/api/endpoints/fixtureEndpoints';
import type { FetchFixturesParams, FixtureChatRoomUsersResponse, FixtureResponse, FixturesResponse } from '@/api/types/fixtures';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useFixturesQuery = (
  params: FetchFixturesParams = {},
  options?: Omit<UseQueryOptions<FixturesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['fixtures', params],
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
    queryKey: ['fixture', fixtureId],
    queryFn: () => fixtureEndpoints.fetchFixtureById(fixtureId),
    enabled: !!fixtureId, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    ...options,
  });
};

export const useFixtureChatRoomUsersQuery = (
  fixtureId: string,
  options?: Omit<UseQueryOptions<FixtureChatRoomUsersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['fixture chat room users', fixtureId],
    queryFn: () => fixtureEndpoints.fetchFixtureChatRoomUsers(Number(fixtureId)),
    enabled: !!fixtureId, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    ...options,
  });
};
