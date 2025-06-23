
import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUserData, clearAuthData } from '@/lib/storage';
import type { LoggedInUser } from '@/api/types/auth';

const AuthContext = createContext<{
  user: LoggedInUser|null;
  logout: () => void;
  isLoading: boolean;
}>({
  user: null,
  logout: () => {},
  isLoading: false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      setUser(storedUser);
      queryClient.setQueryData(['user'], storedUser);
    }
    setIsLoading(false);
  }, [queryClient]);

  const logout = () => {
    setUser(null);
    clearAuthData();
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};