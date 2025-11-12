'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { LogOut, Bell, User, CheckCircle, AlertCircle, Info, Calendar, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  // Role-specific notifications
  const getNotifications = () => {
    switch (user?.role) {
      case 'student':
        return [
          { id: 1, type: 'exam', title: 'New Exam Available', message: 'Biology Final Exam is now available. Duration: 120 minutes', time: '2 hours ago', icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { id: 2, type: 'grade', title: 'Exam Graded', message: 'Your Physics Quiz has been graded. Score: 92%', time: '5 hours ago', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
          { id: 3, type: 'alert', title: 'Upcoming Deadline', message: 'English Literature assignment due in 2 days', time: '1 day ago', icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        ];
      case 'teacher':
        return [
          { id: 1, type: 'submission', title: 'New Exam Submission', message: 'John Doe submitted Biology Final Exam', time: '10 min ago', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
          { id: 2, type: 'alert', title: 'AI Training Complete', message: 'Mathematics course AI training completed successfully', time: '1 hour ago', icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { id: 3, type: 'info', title: 'Student Query', message: 'Sarah Williams asked a question about Chemistry', time: '2 hours ago', icon: Info, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        ];
      case 'admin':
        return [
          { id: 1, type: 'system', title: 'System Update', message: 'Platform updated to v2.1.0', time: '1 hour ago', icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { id: 2, type: 'alert', title: 'New Teacher Added', message: 'Mr. Ibrahim joined as Physics teacher', time: '3 hours ago', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
          { id: 3, type: 'info', title: 'Exam Completed', message: 'Biology Final Exam completed by all students', time: '1 day ago', icon: CheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        ];
      default:
        return [];
    }
  };

  const notifications = getNotifications();
  const unreadCount = notifications.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">AI Exam Platform</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      You have {unreadCount} notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => {
                          const Icon = notification.icon;
                          return (
                            <div key={notification.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`w-5 h-5 ${notification.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        router.push(`/dashboard/${user?.role}/notifications`);
                      }}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 border-l pl-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
          {sidebar}
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
