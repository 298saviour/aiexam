'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, GraduationCap, FileText, Brain, Activity, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const stats = {
    totalTeachers: 0,
    totalStudents: 0,
    activeExams: 0,
    aiJobsToday: 0,
  };

  const recentAILogs: any[] = [];

  const systemHealth = [
    { service: 'API Server', status: 'healthy', uptime: '100%' },
    { service: 'Database', status: 'healthy', uptime: '100%' },
    { service: 'Redis Cache', status: 'healthy', uptime: '100%' },
    { service: 'AI Service', status: 'healthy', uptime: '100%' },
  ];

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor platform activity and manage all users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Teachers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalTeachers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Exams</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeExams}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI Jobs Today</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.aiJobsToday}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent AI Logs</CardTitle>
                <span className="flex items-center text-sm text-green-600">
                  <Activity className="w-4 h-4 mr-1" />
                  Live
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {recentAILogs.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No AI activity yet</p>
                  <p className="text-sm text-gray-400 mt-1">AI logs will appear here as the system processes tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAILogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            log.type === 'grading' ? 'bg-blue-100 text-blue-700' :
                            log.type === 'training' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {log.type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            log.status === 'completed' ? 'bg-green-100 text-green-700' :
                            log.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {log.student && `${log.student} - ${log.exam}`}
                          {log.course && `Course: ${log.course}`}
                          {log.teacher && `Teacher: ${log.teacher}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {service.status === 'healthy' ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      ) : service.status === 'degraded' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{service.service}</p>
                        <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      service.status === 'healthy' ? 'bg-green-100 text-green-700' :
                      service.status === 'degraded' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
