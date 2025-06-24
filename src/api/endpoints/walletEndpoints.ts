import { getAuthTokens } from "@/lib/storage";
import { httpClient } from "../httpClient";
import type { FetchTransactionsParams, TransactionsResponse, TransactionResponse, PlansResponse, BuyPlanResponse } from "../types/wallet";

  export const walletEndpoints = {
    fetchTransactions: async (userId: string, params: FetchTransactionsParams = {}): Promise<TransactionsResponse> => {
      const { token } = getAuthTokens();
      const queryString = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
      }).toString();
      return httpClient.get<TransactionsResponse>(`/admin/wallet/${userId}/?${queryString}`, token);
    },

    fetchATransaction: async (userId: string, transactionId: string): Promise<TransactionResponse> => {
      const { token } = getAuthTokens();
      return httpClient.get<TransactionResponse>(`/admin/wallet/${userId}/${transactionId}`, token);
    },

    fetchPlans: async (): Promise<PlansResponse> => {
      const { token } = getAuthTokens();
      return httpClient.get<PlansResponse>(`/wallet/plans`, token);
    },

    buyPlans: async (planId: string): Promise<BuyPlanResponse> => {
      const { token } = getAuthTokens();
      return httpClient.get<BuyPlanResponse>(`/wallet/plans/${planId}`, token);
    },
  };