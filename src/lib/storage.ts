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
  
  export const clearAuthTokens = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };