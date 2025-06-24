import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useChangePasswordMutation } from '@/hooks/useAuthMutations';


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const changePasswordMutation = useChangePasswordMutation();

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement | HTMLInputElement>) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">ChangePassword to your account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                {changePasswordMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {changePasswordMutation.error?.message || 'changePassword failed. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}

                {changePasswordMutation.isSuccess && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>
                      Change Password successful!
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="**********"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={changePasswordMutation.isPending}
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={changePasswordMutation.isPending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? 'Processing' : 'Change Password'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;