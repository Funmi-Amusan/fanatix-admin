import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData } from '@/lib/storage';
import type { LoggedInUser } from '@/api/types/auth';

export const useUser = () => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['user'],
    queryFn: () => {
      let user: LoggedInUser|undefined = queryClient.getQueryData(['user']);
      
      if (!user) {
        user = getUserData();
        if (user) {
          queryClient.setQueryData(['user'], user);
        }
      }
      
      return user;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};