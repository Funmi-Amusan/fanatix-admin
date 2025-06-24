export interface TransactionsResponse {
  message: string;
  data: {
    transactions: Transaction[];
  };
}

export interface TransactionResponse {
  message: string;
  data: {
    transaction: Transaction;
  };
}

export interface Transaction {
  ID: string;
  Reference: string;
  Amount: number;
  Title: string;
  Description: string;
  Credit: boolean;
  Status: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  imagWalletIDeURL: string;
}

export interface FetchTransactionsParams {
  page?: number;
  limit?: number;
}
