'use client';

import { useState } from 'react';
import { FileText, Plus, Calendar, Clock, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherSidebar } from '@/components/dashboard/TeacherSidebar';
import { Modal } from '@/components/ui/Modal';

const initialExams = [
  { id: 1, title: 'Biology Final Exam', course: 'Biology', duration: 120, questions: 50, students: 45, date: '2024-11-15', totalMarks: 100, passMarks: 50, status: 'active' },
  { id: 2, title: 'Mathematics Mid-Term', course: 'Mathematics', duration: 90, questions: 40, students: 42, date: '2024-11-18', totalMarks: 80, passMarks: 40, status: 'scheduled' },
  { id: 3, title: 'Chemistry Practical', course: 'Chemistry', duration: 60, questions: 30, students: 40, date: '2024-11-20', totalMarks: 60, passMarks: 30, status: 'scheduled' },
  { id: 4, title: 'Physics Quiz', course: 'Physics', duration: 45, questions: 25, students: 38, date: '2024-10-28', totalMarks: 50, passMarks: 25, status: 'completed' },
];

const courses = ['Biology', 'Mathematics', 'Chemistry', 'Physics', 'English', 'Geography'];

export default function ManageExamsPage() {
  const [exams, setExams] = useState(initialExams);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    course: 'Biology',
    date: '',
    duration: 60,
    questions: 0,
    totalMarks: 100,
    passMarks: 50,
  });

  const handleAddExam = () => {
    setEditingExam(null);
    setFormData({
      title: '',
      course: 'Biology',
      date: '',
      duration: 60,
      questions: 0,
      totalMarks: 100,
      passMarks: 50,
    });
    setIsModalOpen(true);
  };

  const handleEditExam = (exam: any) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      course: exam.course,
      date: exam.date,
      duration: exam.duration,
      questions: exam.questions,
      totalMarks: exam.totalMarks,
      passMarks: exam.passMarks,
    });
    setIsModalOpen(true);
  };

  const handleDeleteExam = (id: number) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExam) {
      setExams(exams.map(e => e.id === editingExam.id ? { ...e, ...formData } : e));
    } else {
      const newExam = {
        id: exams.length + 1,
        ...formData,
        students: 0,
        status: 'scheduled',
      };
      setExams([...exams, newExam]);
    }
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout sidebar={<TeacherSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Manage Exams</h1>
            <p className="text-gray-600 mt-1">Create and manage examinations</p>
          </div>
          <Button onClick={handleAddExam} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Exam
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'primary' : 'outline'} onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'active' ? 'primary' : 'outline'} onClick={() => setFilter('active')}>Active</Button>
          <Button variant={filter === 'scheduled' ? 'primary' : 'outline'} onClick={() => setFilter('scheduled')}>Scheduled</Button>
          <Button variant={filter === 'completed' ? 'primary' : 'outline'} onClick={() => setFilter('completed')}>Completed</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Exam Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Course</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Duration</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Questions</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Students</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.filter(e => filter === 'all' || e.status === filter).map((exam) => (
                    <tr key={exam.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{exam.title}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{exam.course}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">{exam.date}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">{exam.duration} min</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">{exam.questions}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">{exam.students}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          exam.status === 'active' ? 'bg-green-100 text-green-800' :
                          exam.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditExam(exam)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExam(exam.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Exam Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExam ? 'Edit Exam' : 'Create New Exam'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Title *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Biology Final Exam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course *
            </label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
                min="15"
                step="15"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Marks *
              </label>
              <Input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pass Marks *
              </label>
              <Input
                type="number"
                value={formData.passMarks}
                onChange={(e) => setFormData({ ...formData, passMarks: parseInt(e.target.value) })}
                required
                min="1"
                max={formData.totalMarks}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions *
            </label>
            <Input
              type="number"
              value={formData.questions}
              onChange={(e) => setFormData({ ...formData, questions: parseInt(e.target.value) })}
              required
              min="1"
              placeholder="e.g., 50"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingExam ? 'Update Exam' : 'Create Exam'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
