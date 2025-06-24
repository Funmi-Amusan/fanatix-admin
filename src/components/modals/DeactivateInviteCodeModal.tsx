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
import { useDeactivateUserInviteCodeMutation } from "@/hooks/useUserMutations";

interface DeactivateInviteCodeModalProps {
  id: string| undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeactivateInviteCodeModal =({ id, isOpen, onOpenChange }: DeactivateInviteCodeModalProps) => {
  const DeactivateInviteCodeMutation = useDeactivateUserInviteCodeMutation();
 const handleDeactivateCode = () => {
   if(!id) return
   DeactivateInviteCodeMutation.mutate({userId:id})
 }

  return (
<Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deactivate this user's invite code</DialogTitle>
          <DialogDescription>
          Deactivating this will make the user's invite code unusable.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center ">
        <Button type="button" variant="default" onClick={()=> handleDeactivateCode()}>
              Deactivate Invite Code
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
export default DeactivateInviteCodeModal;