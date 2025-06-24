import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, User, Mail, Shield, Plus, Users, Check, ChevronDown } from 'lucide-react';
import { useAddAdminMutation, useDeleteAdminMutation } from '@/hooks/useAdminMutations';
import { useAdminsQuery } from '@/lib/queries/adminQueries';
import { useUser } from '@/hooks/useUser';
import type { addAdminRequest } from '@/api/types/admins';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Profile = () => {
  const { data: loggedInUser, isLoading: isAuthLoading } = useUser();
  const allRoles = ['viewer', 'sales', 'hr', 'super', 'coach'] as const;
  const { data, isLoading, isError, error } = useAdminsQuery({ page: 1, limit: 100 });
  const addAdmin = useAddAdminMutation();
  const deleteAdmin = useDeleteAdminMutation();

  const [newAdmin, setNewAdmin] = useState<addAdminRequest>({
    name: '',
    email: '',
    password: '',
    roles: ['viewer'],
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
    addAdmin.mutate(newAdmin, {
      onSuccess: () => {
        setNewAdmin({ name: '', email: '', password: '', roles: ['viewer'] });
      },
    });
  };

  if (isAuthLoading) {
    return (
      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center pb-6 border-b">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage administrators and system access</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{loggedInUser?.name || 'Not available'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{loggedInUser?.email || 'Not available'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Roles</p>
                <p className="font-medium">{loggedInUser?.roles?.join(', ') || 'No roles assigned'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Admin Form */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Administrator
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Status Messages */}
            <div className="space-y-3 mb-6">
              {addAdmin.isError && (
                <Alert variant="destructive">
                  <AlertDescription>{addAdmin.error?.message || 'Failed to add admin.'}</AlertDescription>
                </Alert>
              )}
              {addAdmin.isSuccess && (
                <Alert className="border-gray-200 bg-gray-50">
                  <AlertDescription>Admin added successfully!</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
    <Label htmlFor="password">Password</Label>
    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      className="text-sm text-blue-600 hover:underline focus:outline-none"
    >
      {showPassword ? 'Hide' : 'Show'} password
    </button>
  </div>
  <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter secure password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
  <Label className="text-sm font-medium">Assign Roles</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        className="h-11 w-full justify-between"
      >
        {newAdmin.roles.length > 0
          ? newAdmin.roles.join(', ')
          : 'Select roles'}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-full p-0">
      <Command>
        <CommandInput placeholder="Search roles..." />
        <CommandEmpty>No role found.</CommandEmpty>
        <CommandGroup>
          {allRoles.map((role) => (
            <CommandItem
              key={role}
              onSelect={() => {
                setNewAdmin((prev) => ({
                  ...prev,
                  roles: prev.roles.includes(role)
                    ? prev.roles.filter((r) => r !== role)
                    : [...prev.roles, role],
                }));
              }}
            >
              <Checkbox
                checked={newAdmin.roles.includes(role)}
                className="mr-2 h-4 w-4"
              />
              <span className="capitalize">{role}</span>
              {newAdmin.roles.includes(role) && (
                <Check className="ml-auto h-4 w-4 text-primary" />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>
</div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button 
                onClick={handleAddAdmin} 
                disabled={addAdmin.isPending || !newAdmin.name || !newAdmin.email || !newAdmin.password}
                className="w-full md:w-auto h-11 px-8"
              >
                {addAdmin.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding Administrator...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Administrator
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admins List */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Administrators
            </div>
            {data?.data.admins?.length && (
              <span className="text-sm font-normal text-gray-500">
                {data.data.admins.length} total
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 mb-2">Failed to load administrators</p>
              <p className="text-gray-500 text-sm">{error?.message}</p>
            </div>
          ) : data?.data.admins?.length ? (
            <div className="space-y-3">
              {data.data.admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{admin.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {admin.email}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        Roles: {" "}
                        {admin.roles.join(', ')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAdmin.mutate(admin.id)}
                    disabled={deleteAdmin.isPending}
                    className="h-10 w-10 p-0 hover:bg-gray-100"
                  >
                    {deleteAdmin.isPending ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 mb-2">No administrators found</p>
              <p className="text-gray-500 text-sm">Add your first administrator using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Profile;