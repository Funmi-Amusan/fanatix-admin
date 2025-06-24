import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2 } from 'lucide-react';
import { useAddAdminMutation, useDeleteAdminMutation } from '@/hooks/useAdminMutations';
import { useAdminsQuery } from '@/lib/queries/adminQueries';
import { useUser } from '@/hooks/useUser';
import type { addAdminRequest } from '@/api/types/admins';

const Profile = () => {
  const { data: loggedInUser, isLoading: isAuthLoading } = useUser()

  const { data, isLoading, isError, error } = useAdminsQuery({ page: 1, limit: 100 });
  const addAdmin = useAddAdminMutation();
  const deleteAdmin = useDeleteAdminMutation();

  const [newAdmin, setNewAdmin] = useState<addAdminRequest>({
    name: '',
    email: '',
    password: '',
    roles: 'viewer',
  });

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
    addAdmin.mutate(newAdmin, {
      onSuccess: () => {
        setNewAdmin({ name: '', email: '', password: '', roles: 'viewer' });
      },
    });
  };

  if (isAuthLoading) return <div>Loading...</div>

  console.log("loggedin user", loggedInUser)

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {loggedInUser?.name}</p>
          <p><strong>Email:</strong> {loggedInUser?.email}</p>
          <p><strong>Roles:</strong> {loggedInUser?.roles?.join(', ')}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Admin</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {addAdmin.isError && (
            <Alert variant="destructive">
              <AlertDescription>{addAdmin.error?.message || 'Failed to add admin.'}</AlertDescription>
            </Alert>
          )}
          {addAdmin.isSuccess && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>Admin added successfully!</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            />
          </div>
          <Button onClick={handleAddAdmin} disabled={addAdmin.isPending}>
            {addAdmin.isPending ? 'Adding...' : 'Add Admin'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Admins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p>Loading admins...</p>}
          {isError && <p className="text-red-600">Error: {error?.message}</p>}
          {data?.data.admins?.length ? (
            data.data.admins.map((admin) => (
              <div
                key={admin.id}
                className="flex justify-between items-center border p-3 rounded-md bg-gray-50"
              >
                <div>
                  <p className="font-semibold">{admin.name}</p>
                  <p className="text-sm text-gray-600">{admin.email}</p>
                  <p className="text-xs text-gray-500">Roles: {admin.roles.join(', ')}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => deleteAdmin.mutate(admin.id)}
                  disabled={deleteAdmin.isPending}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No admins found.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
};
export default Profile;
