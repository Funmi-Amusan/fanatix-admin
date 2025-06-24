import { Navigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function RedirectRoot() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['user']);

  return <Navigate to={user ? '/users' : '/login'} replace />;
}
