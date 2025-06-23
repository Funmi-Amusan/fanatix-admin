
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
    data: User;
    message: string;
}

export interface FetchUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}

interface Team {
    ID: string;
    name: string;
    imageURL: string;
    externalID: string;
    color: string;
  }
  
  interface Wallet {
    id: string;
    userID: string;
    balance: string;
    createdAt: string;
    updatedAt: string;
  }