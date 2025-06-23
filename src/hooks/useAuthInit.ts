
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUserData, getAuthTokens } from '@/lib/storage';

export const useAuthInit = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const userData = getUserData();
    const { token, refreshToken } = getAuthTokens();

    if (userData && token) {
      queryClient.setQueryData(['user'], userData);
      queryClient.setQueryData(['auth'], {
        token,
        refreshToken,
        isAuthenticated: true
      });
    }
  }, [queryClient]);
};