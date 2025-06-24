import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserData } from '@/lib/storage';
import type { AdminUser } from '@/api/types/admins';

export const useUser = () => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['user'],
    queryFn: () => {
      let user: AdminUser|undefined = queryClient.getQueryData(['user']);
      
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