import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLoginMutation } from '@/hooks/useAuthMutations';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement | HTMLInputElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Login to your account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                {loginMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {loginMutation.error?.message || 'Login failed. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}

                {loginMutation.isSuccess && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>
                      Login successful! Welcome back.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loginMutation.isPending}
                  />
                </div>

                <div className="grid gap-3">
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
    placeholder="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    disabled={loginMutation.isPending}
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
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Login;