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
import { useAddCoinsMutation } from "@/hooks/useUserMutations";

interface AddCoinsModalProps {
  id: string | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCoinsModal = ({ id, isOpen, onOpenChange }: AddCoinsModalProps) => {

  // const { data: plansData, isLoading: loadingPlans, isError: plansError } = usePlansQuery();
  // const plans = plansData?.data?.pricePlans ?? [];
const loadingPlans = false
  const plans = [];

 const [formData, setFormData] = useState({
    plan: "",
    title: "",
    description: "",
  });

  const addCoinMutation = useAddCoinsMutation();

  // Update form data when user prop changes
  useEffect(() => {
    return setFormData({
      plan: "",
      title: "",
      description: ""
    });
  }, []);

  const handleAddCoin = () => {
    if (!id) return;
    addCoinMutation.mutate({
      planId: id,
      // transactionData: formData
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Coins to User's Wallet (Not Yet Working)</DialogTitle>
          <DialogDescription>
            Update the user's information below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <div className="grid gap-2">
  <Label htmlFor="plan">Plans</Label>
  <Select 
    value={formData.plan} 
    onValueChange={(value) => setFormData(prev => ({ ...prev, plan: Number(value) }))}
  >
    <SelectTrigger>
      <SelectValue placeholder={loadingPlans ? "Loading plans..." : "Select plan"} />
    </SelectTrigger>
    <SelectContent>
      {plans.map((plan) => (
        <SelectItem key={plan.ID} value={String(plan.ID)}>
          {plan.Amount} coins
        </SelectItem>
      ))}
      {plans.length === 0 && !loadingPlans && (
        <div className="text-sm text-center text-gray-500 px-3 py-2">
          No plans available
        </div>
      )}
    </SelectContent>
  </Select>
</div>

          <div className="grid gap-2">
            <Label htmlFor="email">Transaction Title</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter title here" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fanSince">Description</Label>
            <Input 
              id="description" 
              value={formData.description} 
              onChange={(e) => setFormData(prev => ({ ...prev, fanSince: parseInt(e.target.value) || 0 }))}
              placeholder="Some placeholder for description" 
            />
          </div>
         
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleAddCoin}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddCoinsModal;