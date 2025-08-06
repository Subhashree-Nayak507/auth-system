'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, User, Shield, Sparkles } from 'lucide-react';
import { FormEvent } from 'react';

interface LoginResponse {
  success: boolean;
  data?: {
    username: string;
    role: 'admin' | 'user';
  };
  message?: string;
}

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post<LoginResponse>('/api/login', {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data.success && response.data.data) {
        const { role } = response.data.data;
        
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (role === 'user') {
          router.push('/user/dashboard');
        } else {
          setError('Invalid user role received');
        }
      } 
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError('Invalid credentials. Please check your username and password.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(prevState => !prevState);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl mb-6 shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-violet-200/80">Sign in to access your dashboard</p>
          </div>
          <Card className="shadow-2xl  bg-white/10 backdrop-blur-xl  border-white/20">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-semibold text-center text-white">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-violet-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-fuchsia-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl mb-6 shadow-2xl relative">
            <Shield className="w-10 h-10 text-white" />
            <Sparkles className="w-4 h-4 text-violet-200 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>
          <p className="text-violet-200/80">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-2xl  bg-white/10 backdrop-blur-xl  border-white/20 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-xl"></div>
          
          <CardHeader className="space-y-1 pb-6 relative z-10">
            <CardTitle className="text-2xl font-semibold text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-violet-200/70">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            {error && (
              <Alert className="border-red-400/50 bg-red-500/20 backdrop-blur-sm">
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-violet-200">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-300 w-5 h-5" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-violet-300/60 focus:border-violet-400 focus:ring-violet-400/50 backdrop-blur-sm"
                  autoComplete="username"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-violet-200">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-300 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-11 pr-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-violet-300/60 focus:border-violet-400 focus:ring-violet-400/50 backdrop-blur-sm"
                  autoComplete="current-password"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-violet-300 hover:text-violet-200 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6 relative z-10">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              type="button"
              suppressHydrationWarning
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
          <h3 className="text-sm font-medium text-violet-200 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Demo Credentials:
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="font-medium text-violet-200">Admin:</span>
              <span className="font-mono text-fuchsia-200 bg-white/10 px-2 py-1 rounded">admin / admin123</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="font-medium text-violet-200">User:</span>
              <span className="font-mono text-fuchsia-200 bg-white/10 px-2 py-1 rounded">john / user123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}