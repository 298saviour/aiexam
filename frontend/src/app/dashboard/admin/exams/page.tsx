'use client';

import { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { Modal } from '@/components/ui/Modal';
import { ExamForm } from '@/components/forms/ExamForm';

interface Exam {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName: string;
  classIds: number[];
  term: '1st Term' | '2nd Term' | '3rd Term';
  examType: 'Test' | 'Mid-Term' | 'Final';
  duration: number;
  totalMarks: number;
  passMark: number;
  scheduledDate: string;
  scheduledTime: string;
  instructions: string;
  students: number;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
}

const initialExams: Exam[] = [
  { 
    id: 1, 
    title: 'Biology Final Exam', 
    description: 'Comprehensive final exam covering all topics',
    courseId: 1,
    courseName: 'Biology', 
    classIds: [1],
    term: '1st Term',
    examType: 'Final',
    duration: 120,
    totalMarks: 100,
    passMark: 40,
    scheduledDate: '2024-12-15',
    scheduledTime: '09:00',
    instructions: 'Answer all questions. No calculators allowed.',
    students: 45, 
    status: 'active' 
  },
  { 
    id: 2, 
    title: 'Math Mid-Term', 
    description: 'Mid-term assessment',
    courseId: 2,
    courseName: 'Mathematics', 
    classIds: [2],
    term: '1st Term',
    examType: 'Mid-Term',
    duration: 90,
    totalMarks: 50,
    passMark: 20,
    scheduledDate: '2024-12-20',
    scheduledTime: '10:00',
    instructions: 'Show all workings.',
    students: 42, 
    status: 'scheduled' 
  },
];

const mockClasses = [
  { id: 1, name: 'SS3 Science A', level: 'SS3' },
  { id: 2, name: 'SS2 Science B', level: 'SS2' },
  { id: 3, name: 'SS1 Science C', level: 'SS1' },
];

const mockCourses = [
  { id: 1, name: 'Biology', subject: 'Science' },
  { id: 2, name: 'Mathematics', subject: 'Science' },
  { id: 3, name: 'English', subject: 'Arts' },
];

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const handleAddExam = (data: any) => {
    const newExam: Exam = {
      ...data,
      id: exams.length + 1,
      students: 0,
      status: 'draft',
    };
    setExams([...exams, newExam]);
    setIsAddModalOpen(false);
  };

  const handleEditExam = (data: any) => {
    if (selectedExam) {
      setExams(exams.map(e => 
        e.id === selectedExam.id ? { ...e, ...data } : e
      ));
      setIsEditModalOpen(false);
      setSelectedExam(null);
    }
  };

  const handleDeleteExam = (id: number) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  const openEditModal = (exam: Exam) => {
    setSelectedExam(exam);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">Manage Exams</h1>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Exam
          </Button>
        </div>
        <Card>
          <CardHeader><CardTitle>All Exams</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Exam Title</th>
                  <th className="text-left py-3 px-4">Course</th>
                  <th className="text-center py-3 px-4">Term</th>
                  <th className="text-center py-3 px-4">Type</th>
                  <th className="text-center py-3 px-4">Date & Time</th>
                  <th className="text-center py-3 px-4">Duration</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{e.title}</p>
                        <p className="text-xs text-gray-500">{e.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {e.courseName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">{e.term}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                        {e.examType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {e.scheduledDate}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {e.scheduledTime}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">{e.duration} min</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(e.status)}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(e)} className="text-blue-600 hover:text-blue-700" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-700" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteExam(e.id)} className="text-red-600 hover:text-red-700" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Add Exam Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Exam"
          size="xl"
        >
          <ExamForm
            onSubmit={handleAddExam}
            onCancel={() => setIsAddModalOpen(false)}
            availableClasses={mockClasses}
            availableCourses={mockCourses}
          />
        </Modal>

        {/* Edit Exam Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedExam(null);
          }}
          title="Edit Exam"
          size="xl"
        >
          {selectedExam && (
            <ExamForm
              initialData={selectedExam}
              onSubmit={handleEditExam}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedExam(null);
              }}
              availableClasses={mockClasses}
              availableCourses={mockCourses}
              isEdit
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
