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
import { useChangeeUserInviteCodeMutation } from "@/hooks/useUserMutations";

interface ChangeInviteCodeModalProps {
  id: string| undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangeInviteCodeModal =({ id, isOpen, onOpenChange }: ChangeInviteCodeModalProps) => {
 const ChangeInviteCodeMutation = useChangeeUserInviteCodeMutation();
  const handleChangeCode = () => {
    if(!id) return
    ChangeInviteCodeMutation.mutate({userId: id})
  }
    return (
<Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change this user's invite code</DialogTitle>
          <DialogDescription>
          Changing this will delete the user's current invite code.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center ">
        <Button type="button" variant="default" onClick={()=> handleChangeCode()}>
              Change Invite Code
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
export default ChangeInviteCodeModal;