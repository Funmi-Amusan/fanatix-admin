import { userEndpoints } from "@/api/endpoints";
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
  
//   export const useUpdateUserMutation = () => {
//     const queryClient = useQueryClient();
    
//     return useMutation({
//       mutationFn: ({ userId, userData }: { userId: string; userData: User }) => 
//         userEndpoints.updateUser(userId, userData),
//       onSuccess: (data, variables) => {
//         queryClient.invalidateQueries({ queryKey: ['users'] });
//         queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
//       },
//       onError: (error) => {
//         console.error('Failed to update user:', error);
//       }
//     });
//   };
  
//   export const useDeleteUserMutation = () => {
//     const queryClient = useQueryClient();
    
//     return useMutation({
//       mutationFn: userEndpoints.deleteUser,
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ['users'] });
//       },
//       onError: (error) => {
//         console.error('Failed to delete user:', error);
//       }
//     });
//   };