'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherSidebar } from '@/components/dashboard/TeacherSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, FileText, Clock, CheckCircle, Plus } from 'lucide-react';

export default function TeacherDashboard() {
  const router = useRouter();
  
  const stats = {
    totalStudents: 0,
    activeExams: 0,
    pendingGrading: 0,
    coursesManaged: 0,
  };

  const recentSubmissions: any[] = [];

  const aiTrainingStatus: any[] = [];

  return (
    <DashboardLayout sidebar={<TeacherSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your students, courses, and examinations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
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
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Grading</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingGrading}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Courses Managed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.coursesManaged}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Submissions</CardTitle>
                <Button size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent submissions</p>
                  <p className="text-sm text-gray-400 mt-1">Student submissions will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{submission.student}</p>
                        <p className="text-sm text-gray-500">{submission.exam}</p>
                        <p className="text-xs text-gray-400 mt-1">{submission.submitted}</p>
                      </div>
                      <div>
                        {submission.status === 'graded' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Graded</span>
                        ) : (
                          <Button size="sm" variant="outline">Grade Now</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Training Status</CardTitle>
            </CardHeader>
            <CardContent>
              {aiTrainingStatus.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No AI training in progress</p>
                  <p className="text-sm text-gray-400 mt-1">Upload lesson notes to start AI training</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiTrainingStatus.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.course}</span>
                        <span className="text-sm text-gray-500">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => router.push('/dashboard/teacher/exams')}
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Plus className="w-6 h-6" />
                <span>Create New Exam</span>
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/teacher/students')}
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Users className="w-6 h-6" />
                <span>Add Student</span>
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/teacher/upload')}
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <FileText className="w-6 h-6" />
                <span>Upload Lesson Notes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
