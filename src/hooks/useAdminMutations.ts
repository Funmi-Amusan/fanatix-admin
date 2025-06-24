import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminEndpoints } from '@/api/endpoints';
import type { addAdminRequest, addAdminResponse } from '@/api/types/auth';

export const useAddAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<addAdminResponse, Error, addAdminRequest>({
    mutationFn: adminEndpoints.addAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};

export const useDeleteAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<addAdminResponse, Error, string>({
    mutationFn: adminEndpoints.deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};
