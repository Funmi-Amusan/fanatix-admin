export interface TeamsResponse {
  message: string;
  data: {
    teams: Team[];
  };
}

export interface Team {
  ID: string;
  name: string;
  imageURL: string;
  externalID: string;
  color: string;
}

export interface FetchTeamsParams {
  page?: number;
  limit?: number;
  name?: string;
}
