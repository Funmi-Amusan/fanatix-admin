import type { CoinTransaction, InviteUsage } from "./interfaces";

export interface User {
    id: string;
      name: string;
      email: string;
      password: string;
      emailVerified: boolean;
      identityVerified: boolean;
      teamId: string;
      fanSince: Date;
      squadNumber: number;
      username: string;
      oauthProvider: string;
      refreshTokenVersion: number;
      createdAt: Date;
      updatedAt: Date;
      inviteCode: string;
      inviteCodeUsed: string;
      coin: string;
      coinTransactions: CoinTransaction[];
      invitedUsers: InviteUsage[]
}

export type UserTable = Omit<User, 'coinTransactions' | 'invitedUsers'>