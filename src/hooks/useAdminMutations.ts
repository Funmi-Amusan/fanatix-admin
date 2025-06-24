import { adminEndpoints } from '@/api/endpoints/adminEndpoints';
import type { addAdminRequest, addAdminResponse } from '@/api/types/admins';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
