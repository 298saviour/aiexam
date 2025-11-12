'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Trash2, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';

const notifications = [
  { id: 1, type: 'system', title: 'System Update', message: 'Platform updated to v2.1.0', time: '1 hour ago', read: false, icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 2, type: 'alert', title: 'New Teacher Added', message: 'Mr. Ibrahim joined as Physics teacher', time: '3 hours ago', read: false, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: 3, type: 'info', title: 'Exam Completed', message: 'Biology Final Exam completed by all students', time: '1 day ago', read: true, icon: CheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

export default function AdminNotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications);
  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">{unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={() => setNotificationList(notificationList.map(n => ({ ...n, read: true })))} variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {notificationList.map((notification) => (
            <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <notification.icon className={`w-5 h-5 ${notification.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  <button onClick={() => setNotificationList(notificationList.filter(n => n.id !== notification.id))} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
