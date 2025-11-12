'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentSidebar } from '@/components/dashboard/StudentSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TrendingUp, FileText, Award, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  
  // Mock data - will be replaced with API calls
  const stats = {
    overallAverage: 85.5,
    currentClass: 'SS3 Science',
    examsTaken: 12,
    pendingExams: 3,
  };

  const recentExams = [
    { id: 1, title: 'Mathematics Mid-Term', score: 88, date: '2024-11-01', status: 'graded' },
    { id: 2, title: 'Physics Quiz', score: 92, date: '2024-10-28', status: 'graded' },
    { id: 3, title: 'Chemistry Practical', score: 78, date: '2024-10-25', status: 'graded' },
  ];

  const upcomingExams = [
    { id: 4, title: 'Biology Final Exam', date: '2024-11-15', duration: 120 },
    { id: 5, title: 'English Literature', date: '2024-11-18', duration: 90 },
  ];

  const aiRemarks = {
    strengths: ['Strong analytical skills', 'Excellent problem-solving in Mathematics'],
    weaknesses: ['Need improvement in Chemistry practicals', 'Time management in exams'],
  };

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your performance overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Average</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.overallAverage}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Class</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{stats.currentClass}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Exams Taken</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.examsTaken}</p>
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
                  <p className="text-sm text-gray-600">Pending Exams</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingExams}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Exams & AI Remarks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Exams */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{exam.title}</p>
                      <p className="text-sm text-gray-500">{exam.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{exam.score}%</p>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        Graded
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Remarks */}
          <Card>
            <CardHeader>
              <CardTitle>AI Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">✓ Strengths</h4>
                  <ul className="space-y-2">
                    {aiRemarks.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">⚠ Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {aiRemarks.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">{exam.title}</p>
                    <p className="text-sm text-gray-500">Duration: {exam.duration} minutes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{exam.date}</p>
                    <button 
                      onClick={() => router.push(`/dashboard/student/exam/${exam.id}`)}
                      className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Start Exam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
