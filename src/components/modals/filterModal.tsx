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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filter Users</DialogTitle>
          <DialogDescription>
            Narrow down the user list by applying specific filters.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Search & Identification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="sr-only">Name</Label>
              <Input
                id="name"
                name="name"
                value={localFilters.name || ''}
                onChange={handleInputChange}
                placeholder="Name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                name="email"
                value={localFilters.email || ''}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
            <div>
              <Label htmlFor="username" className="sr-only">Username</Label>
              <Input
                id="username"
                name="username"
                value={localFilters.username || ''}
                onChange={handleInputChange}
                placeholder="Username"
              />
            </div>
            <div>
              <Label htmlFor="invite_code" className="sr-only">Invite Code</Label>
              <Input
                id="invite_code"
                name="invite_code"
                value={localFilters.invite_code || ''}
                onChange={handleInputChange}
                placeholder="Invite Code"
              />
            </div>
          </div>

          {/* Registration Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">From Date</Label>
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
              />
            </div>
            <div>
              <Label htmlFor="end_date">To Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                max={maxDate}
                value={localFilters.end_date || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* User Attributes & Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1"> {/* Ensures it takes one column */}
              <Label htmlFor="verified">Email Verified</Label>
              <Select
                value={String(localFilters.verified ?? 'any')}
                onValueChange={(value) => handleSelectChange('verified', value)}
              >
                <SelectTrigger className="w-full"> {/* Added w-full */}
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1"> {/* Ensures it takes one column */}
              <Label htmlFor="team">Assigned Team</Label>
              <Select
                value={String(localFilters.team_id ?? 'any')}
                onValueChange={(value) => handleSelectChange('team_id', value)}
              >
                <SelectTrigger className="w-full"> {/* Added w-full */}
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
            <div className="md:col-span-1">
              <Label htmlFor="sort_by_oldest">Sort Users By</Label>
              <Select
                value={String(localFilters.sort_by_oldest ?? 'any')}
                onValueChange={(value) => handleSelectChange('sort_by_oldest', value)}
              >
                <SelectTrigger className="w-full"> {/* Added w-full */}
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Newest First</SelectItem>
                  <SelectItem value="true">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>Clear All Filters</Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};