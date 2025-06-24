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
import { useActivateUserInviteCodeMutation } from "@/hooks/useUserMutations";

interface ActivateInviteCodeModalProps {
  id: string| undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActivateInviteCodeModal =({ id, isOpen, onOpenChange }: ActivateInviteCodeModalProps) => {
 const ActivateInviteCodeMutation = useActivateUserInviteCodeMutation();
const handleActivateCode = () => {
  if(!id) return
  ActivateInviteCodeMutation.mutate({userId:id})
}

  return (
<Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Activate this user's invite code</DialogTitle>
          <DialogDescription>
          Activating this will make the user's invite code usable again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center ">
        <Button type="button" variant="default" onClick={()=> handleActivateCode()}>
              Activate Invite Code
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
export default ActivateInviteCodeModal;