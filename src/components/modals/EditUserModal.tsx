import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useUpdateUserMutation } from "@/hooks/useUserMutations";
import type { Team } from "@/api/types/teams";

interface EditUserModalProps {
  id: string | undefined;
  user: {
    username: string; 
    email: string; 
    fanSince: number; 
    squadNumber: number;
    teamId: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[]| undefined;
}

const EditUserModal = ({ id, user, isOpen, onOpenChange, teams }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    fanSince: user.fanSince,
    squadNumber: user.squadNumber,
    teamId: user.teamId
  });

  const editMutation = useUpdateUserMutation();

  useEffect(() => {
    setFormData({
      username: user.username,
      email: user.email,
      fanSince: user.fanSince,
      squadNumber: user.squadNumber,
      teamId: user.teamId
    });
  }, [user]);

  const handleUserEdit = () => {
    if (!id) return;
    editMutation.mutate({
      userId: id,
      userData: formData
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogDescription>
            Update the user's information below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={formData.username} 
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username here" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={formData.email} 
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email here" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fanSince">Fan Since</Label>
            <Input 
              id="fanSince" 
              value={formData.fanSince.toString()} 
              onChange={(e) => setFormData(prev => ({ ...prev, fanSince: parseInt(e.target.value) || 0 }))}
              placeholder="2010" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="squadNumber">Squad Number</Label>
            <Input 
              id="squadNumber" 
              value={formData.squadNumber.toString()} 
              onChange={(e) => setFormData(prev => ({ ...prev, squadNumber: parseInt(e.target.value) || 0 }))}
              placeholder="12" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="team">Team</Label>
            <Select 
              value={formData.teamId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, teamId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams?.map((team) => (
                  <SelectItem key={team.ID} value={team.ID}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleUserEdit}>
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserModal;