export interface PlansResponse {
  message: string;
  data: {
    pricePlans: Plan[];
  };
}

export interface BuyPlanResponse {
  message: string;
  data: {
    transaction: Plan;
  };
}

export interface Plan {
  ID: string;
  Amount: number;
  Price: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface TransactionsResponse {
  meta: {
    currentPage: string;
    totalPages:string
  };
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
