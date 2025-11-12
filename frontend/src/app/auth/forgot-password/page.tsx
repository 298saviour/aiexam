'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import apiClient from '@/lib/api';
import { AnimatedBackground } from '@/components/ui/animated-background';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess(false);

      await apiClient.post('/auth/forgot-password', data);

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md" variant="elevated">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">Reset Password</CardTitle>
            <p className="text-center text-gray-600 mt-2 font-normal">
              Enter your email to receive a password reset link
            </p>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✅ Password reset link has been sent to your email!
                  </p>
                  <p className="text-green-600 text-xs mt-2">
                    Please check your inbox and follow the instructions.
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="block text-center text-purple-600 hover:underline font-medium"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
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

                <Button type="submit" className="w-full font-medium" size="lg" isLoading={isLoading}>
                  Send Reset Link
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600 font-normal">
                    Remember your password?{' '}
                    <Link href="/auth/login" className="text-purple-600 hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600 font-normal">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-purple-600 hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedBackground>
  );
}
