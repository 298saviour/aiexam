'use client';

import { TrendingUp, TrendingDown, Award, Target, BarChart3, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentSidebar } from '@/components/dashboard/StudentSidebar';

const performanceData = {
  overallAverage: 85.5,
  trend: 'up',
  trendValue: 5.2,
  rank: 5,
  totalStudents: 45,
  strengths: ['Strong analytical skills', 'Excellent problem-solving in Mathematics', 'Consistent performance'],
  improvements: ['Need improvement in Chemistry practicals', 'Time management in exams'],
};

const subjectPerformance = [
  { subject: 'Mathematics', score: 88, trend: 'up', change: 5, color: 'bg-blue-500' },
  { subject: 'Physics', score: 92, trend: 'up', change: 8, color: 'bg-purple-500' },
  { subject: 'Chemistry', score: 78, trend: 'down', change: -3, color: 'bg-orange-500' },
  { subject: 'Biology', score: 85, trend: 'up', change: 2, color: 'bg-green-500' },
  { subject: 'English', score: 82, trend: 'stable', change: 0, color: 'bg-pink-500' },
];

const recentExams = [
  { name: 'Mathematics Mid-Term', date: '2024-11-01', score: 88, grade: 'A', status: 'graded' },
  { name: 'Physics Quiz', date: '2024-10-28', score: 92, grade: 'A+', status: 'graded' },
  { name: 'Chemistry Practical', date: '2024-10-25', score: 78, grade: 'B', status: 'graded' },
  { name: 'Biology Test', date: '2024-10-22', score: 85, grade: 'A', status: 'graded' },
];

export default function PerformancePage() {
  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Performance Analytics</h1>
        <p className="text-gray-600 mt-1">Track your academic progress and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Average</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{performanceData.overallAverage}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+{performanceData.trendValue}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Class Rank</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">#{performanceData.rank}</p>
                <p className="text-sm text-gray-600 mt-2">of {performanceData.totalStudents} students</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exams Taken</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">12</p>
                <p className="text-sm text-gray-600 mt-2">this semester</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Target Score</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">90%</p>
                <p className="text-sm text-gray-600 mt-2">4.5% to go</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{subject.score}%</span>
                      {subject.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {subject.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                      <span className={`text-xs ${subject.trend === 'up' ? 'text-green-600' : subject.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {subject.change > 0 ? '+' : ''}{subject.change}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${subject.color} h-2 rounded-full transition-all`} style={{ width: `${subject.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Strengths
                </h4>
                <ul className="space-y-2">
                  {performanceData.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {performanceData.improvements.map((improvement, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">⚠</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Exam</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Grade</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.map((exam, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{exam.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{exam.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-semibold text-gray-900">{exam.score}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">{exam.grade}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{exam.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
