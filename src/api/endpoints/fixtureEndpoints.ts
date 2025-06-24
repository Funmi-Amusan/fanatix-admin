import { getAuthTokens } from "@/lib/storage";
import { httpClient } from "../httpClient";
import type { FetchFixturesParams, FixturesResponse, FixtureResponse, FixtureChatRoomUsersResponse } from "../types/fixtures";

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
    },

    fetchFixtureChatRoomUsers: async (fixtureId: number, params: FetchFixturesParams = {}): Promise<FixtureChatRoomUsersResponse> => {
      const { token } = getAuthTokens();
      const queryString = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString()
      }).toString();
      return httpClient.get<FixtureChatRoomUsersResponse>(`/admin/chat/${fixtureId}/user?${queryString}`, token);
    },
  };