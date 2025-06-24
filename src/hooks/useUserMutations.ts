import { userEndpoints, walletEndpoints } from "@/api/endpoints";
import type { updateUser } from "@/api/types/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: userEndpoints.createUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error) => {
        console.error('Failed to create user:', error);
      }
    });
  };
  
  export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ userId, userData }: { userId: string; userData: updateUser }) => 
        userEndpoints.updateUser(userId, userData),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      },
      onError: (error) => {
        console.error('Failed to update user:', error);
      }
    });
  };
  
  export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: userEndpoints.deleteUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error) => {
        console.error('Failed to delete user:', error);
      }
    });
  };

  export const useDeactivateUserInviteCodeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId }: { userId: string;  }) => 
        userEndpoints.deactivateUserInviteCode(userId),
      onSuccess: (variables) => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      },
      onError: (error) => {
        console.error('Failed to deactivate invite code:', error);
      }
    });
  };

  export const useActivateUserInviteCodeMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ userId }: { userId: string;  }) => 
        userEndpoints.activateUserInviteCode(userId),
      onSuccess: (variables) => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      },
      onError: (error) => {
        console.error('Failed to activate invite code::', error);
      }
    });
  };

  export const useChangeeUserInviteCodeMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: userEndpoints.changeUserInviteCode,
      onSuccess: (variables) => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
        console.log('successfully changed')
      },
      onError: (error) => {
        console.error('Failed to change invite code::', error);
      }
    });
  };

  export const useAddCoinsMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ planId }: { planId: string;  }) => 
        walletEndpoints.buyPlans(planId),
      onSuccess: (variables) => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['user', variables.planId] });
      },
      onError: (error) => {
        console.error('Failed to add coins:', error);
      }
    });
  };