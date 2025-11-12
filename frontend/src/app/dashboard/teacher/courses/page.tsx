'use client';

import { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherSidebar } from '@/components/dashboard/TeacherSidebar';
import { Modal } from '@/components/ui/Modal';

const initialCourses = [
  { id: 1, name: 'SS3 Science', code: 'SCI-301', students: 45, exams: 12, materials: 24, color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Mathematics', code: 'MATH-301', students: 42, exams: 15, materials: 30, color: 'from-purple-500 to-pink-500' },
  { id: 3, name: 'English Literature', code: 'ENG-301', students: 48, exams: 10, materials: 18, color: 'from-green-500 to-teal-500' },
  { id: 4, name: 'Chemistry', code: 'CHEM-301', students: 40, exams: 14, materials: 22, color: 'from-orange-500 to-red-500' },
];

const colorOptions = [
  { value: 'from-blue-500 to-cyan-500', label: 'Blue' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple' },
  { value: 'from-green-500 to-teal-500', label: 'Green' },
  { value: 'from-orange-500 to-red-500', label: 'Orange' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo' },
];

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    color: 'from-blue-500 to-cyan-500',
  });

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({ name: '', code: '', color: 'from-blue-500 to-cyan-500' });
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      color: course.color,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (id: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
    } else {
      const newCourse = {
        id: courses.length + 1,
        ...formData,
        students: 0,
        exams: 0,
        materials: 0,
      };
      setCourses([...courses, newCourse]);
    }
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout sidebar={<TeacherSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-1">Create and manage your courses</p>
          </div>
          <Button onClick={handleAddCourse} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Course
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.code}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium text-gray-900">{course.students}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Exams:</span>
                    <span className="font-medium text-gray-900">{course.exams}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Materials:</span>
                    <span className="font-medium text-gray-900">{course.materials}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleEditCourse(course)}
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDeleteCourse(course.id)}
                    variant="outline" 
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add/Edit Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Mathematics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Code *
            </label>
            <Input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              placeholder="e.g., MATH-301"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Theme *
            </label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className={`mt-2 h-3 rounded bg-gradient-to-r ${formData.color}`}></div>
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
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
