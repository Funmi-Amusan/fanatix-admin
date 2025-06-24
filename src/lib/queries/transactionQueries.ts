import { walletEndpoints } from '@/api/endpoints';
import type { FetchTransactionsParams, TransactionResponse, TransactionsResponse } from '@/api/types/transactions';
import type { PlansResponse } from '@/api/types/wallet';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useTransactionsQuery = (
  userId: string,
  params: FetchTransactionsParams = {},
  options?: Omit<UseQueryOptions<TransactionsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['transactions', userId, params],
    queryFn: () => walletEndpoints.fetchTransactions(userId, params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};


export const useTransactionQuery = (
  userId: string,
  tranactionId: string,
  options?: Omit<UseQueryOptions<TransactionResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['transaction', userId],
    queryFn: () => walletEndpoints.fetchATransaction(userId, tranactionId),
    enabled: !!userId, 
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    ...options,
  });
};

export const usePlansQuery = (
  options?: Omit<UseQueryOptions<PlansResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => walletEndpoints.fetchPlans(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};