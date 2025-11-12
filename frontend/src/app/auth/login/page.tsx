'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { setCredentials } from '@/store/slices/authSlice';
import apiClient from '@/lib/api';
import { AnimatedBackground } from '@/components/ui/animated-background';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await apiClient.post('/auth/login', data);

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        dispatch(setCredentials({ user, accessToken, refreshToken }));

        // Redirect based on role
        switch (user.role) {
          case 'admin':
            router.push('/dashboard/admin');
            break;
          case 'teacher':
            router.push('/dashboard/teacher');
            break;
          case 'student':
            router.push('/dashboard/student');
            break;
          default:
            router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md" variant="elevated">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Welcome Back</CardTitle>
          <p className="text-center text-gray-600 mt-2 font-normal">Sign in to your account</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-purple-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full font-medium" size="lg" isLoading={isLoading}>
              Sign In
            </Button>

            <p className="text-center text-sm text-gray-600 font-normal">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-purple-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
        </Card>
      </div>
    </AnimatedBackground>
  );
}
