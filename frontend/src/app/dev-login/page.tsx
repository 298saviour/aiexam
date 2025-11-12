'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AnimatedBackground } from '@/components/ui/animated-background';

export default function DevLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const loginAs = (role: 'admin' | 'teacher' | 'student') => {
    const mockUser = {
      id: 1,
      email: `${role}@test.com`,
      name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role: role,
    };

    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };

    // Set credentials in Redux store
    dispatch(setCredentials({
      user: mockUser,
      ...mockTokens,
    }));

    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('accessToken', mockTokens.accessToken);
    localStorage.setItem('refreshToken', mockTokens.refreshToken);

    // Redirect to appropriate dashboard
    router.push(`/dashboard/${role}`);
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md" variant="elevated">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">🚀 Development Login</CardTitle>
          <p className="text-center text-gray-600 mt-2 font-normal">
            Quick access to dashboards (Backend not required)
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-normal">
                ⚠️ <strong>Development Mode:</strong> This bypasses authentication. Use only for testing UI.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => loginAs('admin')}
                className="w-full font-medium bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                size="lg"
              >
                👨‍💼 Login as Admin
              </Button>

              <Button
                onClick={() => loginAs('teacher')}
                className="w-full font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                size="lg"
              >
                👨‍🏫 Login as Teacher
              </Button>

              <Button
                onClick={() => loginAs('student')}
                className="w-full font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                size="lg"
              >
                👨‍🎓 Login as Student
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 font-normal">
                Want to use real authentication?{' '}
                <a href="/auth/login" className="text-purple-600 hover:underline font-medium">
                  Go to Login
                </a>
              </p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </AnimatedBackground>
  );
}
