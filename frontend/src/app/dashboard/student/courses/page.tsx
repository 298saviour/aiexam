'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Users, TrendingUp, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentSidebar } from '@/components/dashboard/StudentSidebar';

const courses = [
  { id: 1, name: 'SS3 Science', code: 'SCI-301', teacher: 'Mr. Johnson', students: 45, exams: 12, averageScore: 85.5, color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Mathematics', code: 'MATH-301', teacher: 'Mrs. Adebayo', students: 42, exams: 15, averageScore: 78.3, color: 'from-purple-500 to-pink-500' },
  { id: 3, name: 'English Literature', code: 'ENG-301', teacher: 'Mr. Okonkwo', students: 48, exams: 10, averageScore: 82.1, color: 'from-green-500 to-teal-500' },
  { id: 4, name: 'Chemistry', code: 'CHEM-301', teacher: 'Dr. Nwosu', students: 40, exams: 14, averageScore: 76.8, color: 'from-orange-500 to-red-500' },
  { id: 5, name: 'Physics', code: 'PHY-301', teacher: 'Prof. Ibrahim', students: 38, exams: 13, averageScore: 80.5, color: 'from-indigo-500 to-purple-500' },
  { id: 6, name: 'Biology', code: 'BIO-301', teacher: 'Mrs. Eze', students: 44, exams: 11, averageScore: 84.2, color: 'from-pink-500 to-rose-500' },
];

export default function MyCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">You're enrolled in {courses.length} courses this semester</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{courses.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{courses.reduce((sum, c) => sum + c.exams, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{(courses.reduce((sum, c) => sum + c.averageScore, 0) / courses.length).toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Classmates</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">{courses.reduce((sum, c) => sum + c.students, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{course.code}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Teacher:</span>
                  <span className="font-medium text-gray-900">{course.teacher}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium text-gray-900">{course.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Exams Taken:</span>
                  <span className="font-medium text-gray-900">{course.exams}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg. Score:</span>
                  <span className="font-semibold text-green-600">{course.averageScore}%</span>
                </div>
              </div>
              <Button 
                onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
                className="w-full mt-4"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </DashboardLayout>
  );
}
