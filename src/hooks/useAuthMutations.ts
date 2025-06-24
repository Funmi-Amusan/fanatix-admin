import { authEndpoints } from '@/api/endpoints/authEndpoints';
import { clearAuthData, setAuthTokens, setUserData } from '@/lib/storage';
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
      setUserData(data.data.admin);
      
      navigate('/users');
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    }
  });
};

export const useChangePasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authEndpoints.changePassword,
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.error('Change Password failed:', error.message);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    queryClient.clear();  
    clearAuthData(); 
    sessionStorage.clear();     
    localStorage.removeItem('userData'); 
    navigate('/login');
  };

  return logout;
};