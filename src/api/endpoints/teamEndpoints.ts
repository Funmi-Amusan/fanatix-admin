import { getAuthTokens } from "@/lib/storage";
import { httpClient } from "../httpClient";
import type { FetchTeamsParams, TeamsResponse } from "../types/teams";

  export const teamEndpoints = {
    fetchTeams: async (params: FetchTeamsParams = {}): Promise<TeamsResponse> => {
      const { token } = getAuthTokens();
      const queryString = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
        ...(params.name && { search: params.name }),
      }).toString();
      return httpClient.get<TeamsResponse>(`/team/?${queryString}`, token);
    }
  };