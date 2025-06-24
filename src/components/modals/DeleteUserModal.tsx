import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteUserMutation } from "@/hooks/useUserMutations";

interface DeleteUserModalProps {
  id: string| undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteUserModal =({ id, isOpen, onOpenChange }: DeleteUserModalProps) => {
 const deleteMutation = useDeleteUserMutation();
const handleUserDelete = () => {
  if(!id) return
  deleteMutation.mutate(id)
}

  return (
<Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this user's account</DialogTitle>
          <DialogDescription>
           Deleting this will erase all the user's data on the database
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center ">
        <Button type="button" variant="default" onClick={()=> handleUserDelete()}>
              Delete User
            </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default DeleteUserModal;