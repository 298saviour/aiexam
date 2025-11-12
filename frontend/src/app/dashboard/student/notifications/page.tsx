'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Calendar, Trash2, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentSidebar } from '@/components/dashboard/StudentSidebar';

const notifications = [
  {
    id: 1,
    type: 'exam',
    title: 'New Exam Available',
    message: 'Biology Final Exam is now available. Duration: 120 minutes',
    time: '2 hours ago',
    read: false,
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 2,
    type: 'grade',
    title: 'Exam Graded',
    message: 'Your Physics Quiz has been graded. Score: 92%',
    time: '5 hours ago',
    read: false,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 3,
    type: 'alert',
    title: 'Upcoming Deadline',
    message: 'English Literature assignment due in 2 days',
    time: '1 day ago',
    read: false,
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    id: 4,
    type: 'info',
    title: 'Course Update',
    message: 'New study materials added to Chemistry course',
    time: '2 days ago',
    read: true,
    icon: Info,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 5,
    type: 'grade',
    title: 'Exam Graded',
    message: 'Your Mathematics Mid-Term has been graded. Score: 88%',
    time: '3 days ago',
    read: true,
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 6,
    type: 'exam',
    title: 'Exam Reminder',
    message: 'Chemistry Practical exam starts tomorrow at 9:00 AM',
    time: '3 days ago',
    read: true,
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
];

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotificationList(notificationList.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotificationList(notificationList.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotificationList(notificationList.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notificationList 
    : filter === 'unread' 
    ? notificationList.filter(n => !n.read)
    : notificationList.filter(n => n.type === filter);

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{notificationList.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exams</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{notificationList.filter(n => n.type === 'exam').length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Grades</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{notificationList.filter(n => n.type === 'grade').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button variant={filter === 'all' ? 'primary' : 'outline'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'unread' ? 'primary' : 'outline'} onClick={() => setFilter('unread')}>Unread</Button>
        <Button variant={filter === 'exam' ? 'primary' : 'outline'} onClick={() => setFilter('exam')}>Exams</Button>
        <Button variant={filter === 'grade' ? 'primary' : 'outline'} onClick={() => setFilter('grade')}>Grades</Button>
        <Button variant={filter === 'alert' ? 'primary' : 'outline'} onClick={() => setFilter('alert')}>Alerts</Button>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No notifications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <notification.icon className={`w-5 h-5 ${notification.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button onClick={() => markAsRead(notification.id)} className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                            Mark read
                          </button>
                        )}
                        <button onClick={() => deleteNotification(notification.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}
