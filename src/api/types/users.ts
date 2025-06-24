import type { Team } from "./teams";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  identityVerified: boolean;
  teamId: string;
  fanSince: number;
  squadNumber: number;
  username: string;
  inviteCode: string;
  referrerCode: string;
  oauthProvider: string;
  refreshTokenVersion: number;
  createdAt: string;
  updatedAt: string;
  inviteDeactivated: boolean;
  teams: Team;
  wallet: Wallet;
}

export interface updateUser {
  teamId: string;
  fanSince: number;
  squadNumber: number;
  username: string;
}

export interface UsersResponse {
    data: {
        users: User[]
    }
    total: number;
    page: number;
    limit: number;
    message: string;
}

export interface UserResponse {
    data: {
      fan: User
    };
    message: string;
}

export interface FetchUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    // role?: string;
    team_id?: string;
    name?: string;
    email?: string;
    verified?: boolean;
    email_verified?: boolean;
    identity_verified?: boolean;
    invite_code?: string;
    referrer_code?: string;
    username?: string;
    start_date?: string;
    end_date?: string;
    sort_by_oldest?: boolean;
}
  
  interface Wallet {
    id: string;
    userID: string;
    balance: string;
    createdAt: string;
    updatedAt: string;
  }