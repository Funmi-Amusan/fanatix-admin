import { authEndpoints } from '@/api/endpoints';
import { setAuthTokens } from '@/lib/storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authEndpoints.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.data.admin);
      
      queryClient.setQueryData(['auth'], {
        token: data.data.token,
        refreshToken: data.refreshToken,
        isAuthenticated: true
      });
      
      setAuthTokens(data.data.token, data.refreshToken);
      
      navigate('/users');
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    }
  });
};

// export const useLogoutMutation = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: authEndpoints.logout,
//     onSuccess: () => {
//       queryClient.clear();
      
//       clearAuthTokens();
      
//       navigate('/login');
//     }
//   });
// };