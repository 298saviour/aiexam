'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Users, Calendar, Clock, TrendingUp, FileText, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentSidebar } from '@/components/dashboard/StudentSidebar';

const coursesData: any = {
  '1': { id: 1, name: 'SS3 Science', code: 'SCI-301', teacher: 'Mr. Johnson', students: 45, exams: 12, averageScore: 85.5, color: 'from-blue-500 to-cyan-500' },
  '2': { id: 2, name: 'Mathematics', code: 'MATH-301', teacher: 'Mrs. Adebayo', students: 42, exams: 15, averageScore: 78.3, color: 'from-purple-500 to-pink-500' },
  '3': { id: 3, name: 'English Literature', code: 'ENG-301', teacher: 'Mr. Okonkwo', students: 48, exams: 10, averageScore: 82.1, color: 'from-green-500 to-teal-500' },
  '4': { id: 4, name: 'Chemistry', code: 'CHEM-301', teacher: 'Dr. Nwosu', students: 40, exams: 14, averageScore: 76.8, color: 'from-orange-500 to-red-500' },
  '5': { id: 5, name: 'Physics', code: 'PHY-301', teacher: 'Prof. Ibrahim', students: 38, exams: 13, averageScore: 80.5, color: 'from-indigo-500 to-purple-500' },
  '6': { id: 6, name: 'Biology', code: 'BIO-301', teacher: 'Mrs. Eze', students: 44, exams: 11, averageScore: 84.2, color: 'from-pink-500 to-rose-500' },
};

const upcomingExams = [
  { id: 1, title: 'Mid-Term Examination', date: '2024-11-20', duration: 120, questions: 50 },
  { id: 2, title: 'Chapter 5 Quiz', date: '2024-11-25', duration: 45, questions: 20 },
];

const recentExams = [
  { id: 1, title: 'Chapter 4 Test', date: '2024-11-05', score: 88, grade: 'A' },
  { id: 2, title: 'Monthly Assessment', date: '2024-10-28', score: 92, grade: 'A+' },
  { id: 3, title: 'Chapter 3 Quiz', date: '2024-10-15', score: 85, grade: 'A' },
];

const materials = [
  { id: 1, title: 'Chapter 5 Notes', type: 'PDF', uploadDate: '2024-11-01' },
  { id: 2, title: 'Practice Questions', type: 'PDF', uploadDate: '2024-10-28' },
  { id: 3, title: 'Video Lecture - Topic 3', type: 'Video', uploadDate: '2024-10-25' },
];

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const course = coursesData[courseId];

  if (!course) {
    return (
      <DashboardLayout sidebar={<StudentSidebar />}>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard/student/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/student/courses')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">{course.name}</h1>
              <p className="text-gray-600 mt-1">{course.code}</p>
            </div>
          </div>
        </div>

        {/* Course Header Card */}
        <Card>
          <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teacher</p>
                  <p className="font-semibold text-gray-900">{course.teacher}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="font-semibold text-gray-900">{course.students}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exams Taken</p>
                  <p className="font-semibold text-gray-900">{course.exams}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Your Average</p>
                  <p className="font-semibold text-green-600">{course.averageScore}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exam.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{exam.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{exam.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        Upcoming
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{exam.questions} questions</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Exam Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exam.title}</h4>
                        <p className="text-sm text-gray-600">{exam.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{exam.score}%</p>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          {exam.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Title</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Type</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Upload Date</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{material.title}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          material.type === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {material.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">{material.uploadDate}</td>
                      <td className="py-3 px-4 text-center">
                        <Button variant="outline" size="sm">Download</Button>
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
