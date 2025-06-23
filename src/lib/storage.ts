import type { LoggedInUser } from "@/api/types/auth";

export const setAuthTokens = (token: string, refreshToken: string) => {
    sessionStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  };
  
  export const getAuthTokens = () => {
    return {
      token: sessionStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken')
    };
  };
  
  export const setUserData = (userData: LoggedInUser) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  };
  
  export const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  };
  
  export const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  };