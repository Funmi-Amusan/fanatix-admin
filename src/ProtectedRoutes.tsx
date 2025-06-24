import { Navigate, Outlet } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function ProtectedRoute() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['user']);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
