'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Calendar, BookOpen, Play, AlertCircle, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentSidebar } from '@/components/dashboard/StudentSidebar';
import { Modal } from '@/components/ui/Modal';

const availableExams = [
  {
    id: 1,
    course: 'Biology',
    title: 'Biology Final Exam',
    duration: 120,
    questions: 50,
    startDate: '2024-11-15',
    endDate: '2024-11-16',
    status: 'available',
    description: 'Comprehensive final exam covering all topics from the semester',
  },
  {
    id: 2,
    course: 'English Literature',
    title: 'English Literature Mid-Term',
    duration: 90,
    questions: 40,
    startDate: '2024-11-18',
    endDate: '2024-11-19',
    status: 'available',
    description: 'Mid-term examination on poetry and prose analysis',
  },
  {
    id: 3,
    course: 'Chemistry',
    title: 'Chemistry Practical Assessment',
    duration: 60,
    questions: 30,
    startDate: '2024-11-20',
    endDate: '2024-11-21',
    status: 'upcoming',
    description: 'Practical assessment on laboratory experiments and procedures',
  },
];

const completedExams = [
  { id: 4, course: 'Mathematics', title: 'Mathematics Mid-Term', score: 88, date: '2024-11-01', grade: 'A' },
  { id: 5, course: 'Physics', title: 'Physics Quiz', score: 92, date: '2024-10-28', grade: 'A+' },
  { id: 6, course: 'Chemistry', title: 'Chemistry Test', score: 78, date: '2024-10-25', grade: 'B' },
];

export default function TakeExamPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('available');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const handleStartExam = (exam: any) => {
    setSelectedExam(exam);
    setIsConfirmModalOpen(true);
  };

  const confirmStartExam = () => {
    if (selectedExam) {
      router.push(`/dashboard/student/exam/${selectedExam.id}`);
    }
  };

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Take Exam</h1>
          <p className="text-gray-600 mt-1">Select a course and start your examination</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedTab === 'available' ? 'primary' : 'outline'}
            onClick={() => setSelectedTab('available')}
            className="font-medium"
          >
            Available Exams ({availableExams.filter(e => e.status === 'available').length})
          </Button>
          <Button
            variant={selectedTab === 'upcoming' ? 'primary' : 'outline'}
            onClick={() => setSelectedTab('upcoming')}
            className="font-medium"
          >
            Upcoming Exams ({availableExams.filter(e => e.status === 'upcoming').length})
          </Button>
          <Button
            variant={selectedTab === 'completed' ? 'primary' : 'outline'}
            onClick={() => setSelectedTab('completed')}
            className="font-medium"
          >
            Completed Exams ({completedExams.length})
          </Button>
        </div>

        {selectedTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExams.filter(exam => exam.status === 'available').map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{exam.course}</p>
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Available
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>Questions: {exam.questions}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Available until: {exam.endDate}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-800">
                        Once started, you must complete the exam within the time limit. Make sure you have a stable internet connection.
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleStartExam(exam)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Exam
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExams.filter(exam => exam.status === 'upcoming').map((exam) => (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{exam.course}</p>
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      Upcoming
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>Questions: {exam.questions}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Starts on: {exam.startDate}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" disabled>
                    Not Yet Available
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'completed' && (
          <Card>
            <CardHeader>
              <CardTitle>Completed Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Course</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Exam</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Score</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Grade</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedExams.map((exam) => (
                      <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{exam.course}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{exam.title}</td>
                        <td className="py-3 px-4 text-center text-sm text-gray-600">{exam.date}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-sm font-semibold text-gray-900">{exam.score}%</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            {exam.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button 
                            onClick={() => router.push(`/dashboard/student/results/${exam.id}`)}
                            variant="outline" 
                            size="sm"
                          >
                            View Results
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'available' && availableExams.filter(e => e.status === 'available').length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No exams available at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Exam Start Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Start Exam Confirmation"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold text-yellow-900">Important Notice</p>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>You can only start this exam <strong>ONCE</strong></li>
                <li>Once started, the timer will begin immediately</li>
                <li>If you navigate away or close the browser, the timer will <strong>CONTINUE COUNTING</strong></li>
                <li>You cannot pause or restart the exam</li>
                <li>Make sure you have a stable internet connection</li>
                <li>Ensure you have enough time to complete the exam</li>
              </ul>
            </div>
          </div>

          {selectedExam && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900">Exam Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Course:</span>
                  <p className="font-medium text-gray-900">{selectedExam.course}</p>
                </div>
                <div>
                  <span className="text-gray-600">Title:</span>
                  <p className="font-medium text-gray-900">{selectedExam.title}</p>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-medium text-gray-900">{selectedExam.duration} minutes</p>
                </div>
                <div>
                  <span className="text-gray-600">Questions:</span>
                  <p className="font-medium text-gray-900">{selectedExam.questions}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              By clicking "Start Exam Now", you confirm that you understand and accept these conditions.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmStartExam}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Exam Now
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
