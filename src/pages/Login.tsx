import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';

const loginApi = async ({ email, password }: {email:string; password: string}) => {
  try {
    const response = await fetch("https://fanatix.usetend.com/api/v1/admin/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return {
      user: data.data.admin,
      token: data.data.token,
      refreshToken: data.refreshToken,
      message: data.message
    };
  } catch (error) {
    throw new Error(`Login error: ${error.message}`);
  }
};


const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      queryClient.setQueryData(['auth'], {
        token: data.token,
        refreshToken: data.refreshToken,
        isAuthenticated: true
      });
      
      sessionStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      navigate('/users');
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    }
  });

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
                {/* Error Alert */}
                {loginMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {loginMutation.error?.message || 'Login failed. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Alert */}
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
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