import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, User, Mail, Shield, Plus, Users, ChevronDown, UserPlus } from 'lucide-react';
import { useAddAdminMutation, useDeleteAdminMutation } from '@/hooks/useAdminMutations';
import { useAdminsQuery } from '@/lib/queries/adminQueries';
import { useUser } from '@/hooks/useUser';
import type { addAdminRequest } from '@/api/types/admins';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const primaryColor = '#0E6654';
const primaryColorText = 'text-[#0E6654]';
const primaryColorRing = 'focus:ring-[#0E6654]';
const primaryColorBg = 'bg-[#0E6654]';
const primaryColorBgHover = 'hover:bg-[#0c5a4a]';

const Admins = () => {
  const { isLoading: isAuthLoading } = useUser();
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
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#0E6654]"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
            <p className="text-md text-gray-500 mt-1">Manage administrators and system access roles.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          
          <div className="lg:col-span-1">
  <Card className="border-gray-200/80 shadow-sm bg-white">
    <CardHeader className="border-b border-gray-100">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-700">
        <UserPlus className={`w-5 h-5 ${primaryColorText}`} />
        Add New Administrator
      </CardTitle>
    </CardHeader>
    <CardContent className=" ">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-600">Full Name</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="name"
                placeholder="Jane Doe"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className={`h-11 pl-10 border-gray-300 focus:border-[#0E6654] ${primaryColorRing}`}
              />
            </div>
          </div>
        
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-600">Email Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="jane.doe@example.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className={`h-11 pl-10 border-gray-300 focus:border-[#0E6654] ${primaryColorRing}`}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-600">Password</Label>
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-xs font-medium text-[#0E6654] hover:underline focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
          </div>
            <div className="relative mt-1">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a secure password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className={`h-11 pl-10 border-gray-300 focus:border-[#0E6654] ${primaryColorRing}`}
              />
            </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Assign Roles</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="h-11 w-full justify-between mt-1 border-gray-300 text-gray-600 hover:text-gray-800"
              >
                <span className="truncate">
                {newAdmin.roles.length > 0
                  ? newAdmin.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(', ')
                  : 'Select roles...'}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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
                      className="flex items-center"
                    >
                      <Checkbox
                        checked={newAdmin.roles.includes(role)}
                        className="mr-2 h-4 w-4"
                        style={{'--checkbox-color': primaryColor} as React.CSSProperties}
                      />
                      <span className="capitalize font-medium">{role}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <Button 
          onClick={handleAddAdmin} 
          disabled={addAdmin.isPending || !newAdmin.name || !newAdmin.email || !newAdmin.password}
          className={`w-full h-11 text-white font-semibold shadow-sm transition-all ${primaryColorBg} ${primaryColorBgHover}`}
        >
          {addAdmin.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Add Administrator
            </>
          )}
        </Button>
      </div>

        {/* Status Messages */}
      <div className="mt-4 space-y-2">
        {addAdmin.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {addAdmin.error?.message || 'Failed to add admin.'}
            </AlertDescription>
          </Alert>
        )}
        {addAdmin.isSuccess && (
          <Alert variant="default" className="bg-teal-50 border-teal-200 text-teal-800">
            <AlertDescription>
              Admin added successfully!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </CardContent>
  </Card>
</div>

          {/* Admins List (Right Column) */}
          <div className="lg:col-span-2">
  <Card className="border-gray-200/80 shadow-sm bg-white">
    <CardHeader className="border-b border-gray-100">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className={`w-5 h-5 ${primaryColorText}`} />
          <h2 className="text-lg font-semibold text-gray-700">Current Administrators</h2>
        </div>
        {!isLoading && data?.data.admins?.length && (
          <span className={`text-sm font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600`}>
            {data.data.admins.length} Total
          </span>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-2 sm:p-4">
      {isLoading ? (
        // --- Skeleton Loading State for Table ---
        <div className="space-y-2 p-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-3 bg-gray-50 rounded-md">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        // --- Error State ---
        <div className="text-center py-10">
          <div className={`w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Users className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Failed to load administrators</h3>
          <p className="text-gray-500 mt-1">{error?.message}</p>
        </div>
      ) : data?.data.admins?.length ? (
        // --- Admin Table ---
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Administrator
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.data.admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/70 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${primaryColorBg}`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {admin.roles.map((role) => (
                        <span
                          key={role}
                          className={`px-2.5 py-1 text-xs font-medium rounded-full bg-teal-50 text-teal-800`}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAdmin.mutate(admin.id)}
                      disabled={deleteAdmin.isPending}
                      className="h-8 w-8 text-gray-400 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // --- Empty State ---
        <div className="text-center py-10">
          <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No Administrators Found</h3>
          <p className="text-gray-500 mt-1">Add your first administrator using the form.</p>
        </div>
      )}
    </CardContent>
  </Card>
</div>

        </div>
      </div>
    </main>
  );
};

export default Admins;