import type { User } from "./users";

export interface FixtureResponse {
  message: string;
  data: {
    fixture: Fixture;
  };
}
export interface FixturesResponse {
  message: string;
  data: {
    fixtures: Fixture[];
  };
}

export interface FixtureChatRoomUsersResponse {
  message: string;
  data: {
    users: ChatRoomUser[];
  };
}

export interface Fixture {
  ID: number;
  external_id: number;
  start_time: string;
  Completed: boolean;
  home_team_external_id: number;
  away_team_external_id: number;
  MatchState: string;
  Scores: unknown[]; 
  Participants: Participant[];
  League: League;
  Statistics: unknown[]; 
  Events: unknown[]; 
  Lineups: unknown[]; 
  chatroom_user: ChatRoomUser;
}

export interface FetchFixturesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Score {
  ID: number;
  fixture_id: number;
  Goal: number;
  Home: boolean;
  Description: string;
}

export interface Participant {
  ID: number;
  fixture_id: number;
  external_id: number;
  Name: string;
  image_url: string;
  Winner: boolean;
  Home: boolean;
  short_code: string;
}

export interface League {
  ID: number;
  fixture_id: number;
  Name: string;
  image_url: string;
}

export type ChatRoomUser = Pick<
  User,
  'id' | 'teamId' | 'fanSince' | 'squadNumber' | 'username'
> & {
  team: {
    ID: string;
    name: string;
    imageURL: string;
    externalID: string;
    color: string;
  };
};
