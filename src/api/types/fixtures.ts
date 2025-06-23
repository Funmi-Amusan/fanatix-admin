export interface FixtureResponse {
  message: string;
  data: {
    fixtures: Fixture[];
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
  Scores: Score[];
  Participants: Participant[];
  League: League;
  Statistics: any[]; 
  Events: any | null; 
  Lineups: any | null;
  chatroom_user: ChatroomUser;
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

export interface ChatroomUser {
  id: number;
  userID: string;
  chatroomID: number;
  createdAt: string;
}