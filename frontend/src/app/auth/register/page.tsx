'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import apiClient from '@/lib/api';
import { AnimatedBackground } from '@/components/ui/animated-background';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'teacher']),
  // Student fields
  guardianName: z.string().optional(),
  guardianEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  // Teacher fields
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const payload: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      // Add optional fields if provided
      if (data.guardianName) payload.guardianName = data.guardianName;
      if (data.guardianEmail) payload.guardianEmail = data.guardianEmail;
      if (data.address) payload.address = data.address;
      if (data.phone) payload.phone = data.phone;

      const response = await apiClient.post('/auth/register', payload);

      if (response.data.success) {
        router.push('/auth/login?registered=true');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md" variant="elevated">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Create Account</CardTitle>
          <p className="text-center text-gray-600 mt-2 font-normal">Join the AI Exam Platform</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="student"
                    {...register('role')}
                    className="mr-2"
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="teacher"
                    {...register('role')}
                    className="mr-2"
                  />
                  <span>Teacher</span>
                </label>
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
            </div>

            {/* Student-specific fields */}
            {selectedRole === 'student' && (
              <>
                <Input
                  label="Guardian Name (Optional)"
                  type="text"
                  placeholder="Parent/Guardian Full Name"
                  error={errors.guardianName?.message}
                  {...register('guardianName')}
                />
                <Input
                  label="Guardian Email (Optional)"
                  type="email"
                  placeholder="guardian@example.com"
                  error={errors.guardianEmail?.message}
                  helperText="For important notifications"
                  {...register('guardianEmail')}
                />
                <Input
                  label="Address (Optional)"
                  type="text"
                  placeholder="Your home address"
                  error={errors.address?.message}
                  {...register('address')}
                />
              </>
            )}

            {/* Teacher-specific fields */}
            {selectedRole === 'teacher' && (
              <>
                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <Input
                  label="Address (Optional)"
                  type="text"
                  placeholder="Your address"
                  error={errors.address?.message}
                  {...register('address')}
                />
              </>
            )}

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText="Must be 8+ characters with uppercase, lowercase, and number"
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full font-medium" size="lg" isLoading={isLoading}>
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600 font-normal">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-purple-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
        </Card>
      </div>
    </AnimatedBackground>
  );
}
