import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { FetchUsersParams } from '@/api/types/users';
import { useTeamsQuery } from '@/lib/queries/teamQueries';
import { formatToAPIDate } from '@/lib/helpers';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<FetchUsersParams>) => void;
  currentFilters: Partial<FetchUsersParams>;
}

type ModifiableFilters = Pick<
  FetchUsersParams,
  'name' | 'email' | 'username' | 'verified' | 'team_id' | 'invite_code' | 'start_date' | 'end_date' | 'sort_by_oldest'
>;

export const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: FilterModalProps) => {
  const [localFilters, setLocalFilters] = useState<Partial<ModifiableFilters>>({});
  const { data: allTeams } = useTeamsQuery();
  const teams = allTeams?.data?.teams;

  const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const maxDate = tomorrow.toISOString().split('T')[0];


  useEffect(() => {
    if (isOpen) {
      setLocalFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value || undefined }));
  };

  const handleSelectChange = (name: keyof ModifiableFilters, value: string) => {
    let filterValue: boolean | string | undefined = value;
    if (value === 'true') filterValue = true;
    else if (value === 'false') filterValue = false;
    else if (value === 'any') filterValue = undefined;
    setLocalFilters(prev => ({ ...prev, [name]: filterValue }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Filter Users</DialogTitle>
          <DialogDescription>
            Apply filters to refine the user list. Click “Apply” to confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Text Inputs */}
          {[
            { id: 'name', label: 'Name' },
            { id: 'email', label: 'Email' },
            { id: 'username', label: 'Username' },
            { id: 'invite_code', label: 'Invite Code' },
          ].map(field => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">{field.label}</Label>
              <Input
                id={field.id}
                name={field.id}
                value={(localFilters as any)[field.id] || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          ))}

          {/* Date Pickers */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_date" className="text-right">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              max={maxDate}
              value={localFilters.start_date || ''}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  start_date: formatToAPIDate(e.target.value),
                }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_date" className="text-right">End Date</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              max={maxDate}
              value={localFilters.end_date || ''}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  end_date: formatToAPIDate(e.target.value),
                }))
              }
              className="col-span-3"
            />
          </div>

          {/* Boolean Selects */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="verified" className="text-right">Email Verified</Label>
            <Select
              value={String(localFilters.verified ?? 'any')}
              onValueChange={(value) => handleSelectChange('verified', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sort_by_oldest" className="text-right">Sort By Oldest</Label>
            <Select
              value={String(localFilters.sort_by_oldest ?? 'any')}
              onValueChange={(value) => handleSelectChange('sort_by_oldest', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Default</SelectItem>
                <SelectItem value="true">Oldest</SelectItem>
                <SelectItem value="false">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team Selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">Team</Label>
            <Select
              value={String(localFilters.team_id ?? 'any')}
              onValueChange={(value) => handleSelectChange('team_id', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Any team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {teams?.map(team => (
                  <SelectItem key={team.ID} value={team.ID}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>Clear</Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
