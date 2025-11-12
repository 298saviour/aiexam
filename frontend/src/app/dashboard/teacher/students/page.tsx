'use client';

import { useState } from 'react';
import { Users, Search, Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherSidebar } from '@/components/dashboard/TeacherSidebar';
import { Modal } from '@/components/ui/Modal';

const initialStudents = [
  { id: 1, name: 'John Doe', email: 'john@student.com', class: 'SS3', phone: '+234 800 123 4567', avgScore: 85.5, status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@student.com', class: 'SS3', phone: '+234 800 234 5678', avgScore: 92.3, status: 'active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@student.com', class: 'SS2', phone: '+234 800 345 6789', avgScore: 78.1, status: 'active' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@student.com', class: 'SS3', phone: '+234 800 456 7890', avgScore: 88.7, status: 'active' },
  { id: 5, name: 'David Brown', email: 'david@student.com', class: 'SS2', phone: '+234 800 567 8901', avgScore: 81.2, status: 'active' },
];

export default function ManageStudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class: 'SS3',
    phone: '',
  });

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', class: 'SS3', phone: '' });
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      class: student.class,
      phone: student.phone,
    });
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s));
    } else {
      const newStudent = {
        id: students.length + 1,
        ...formData,
        avgScore: 0,
        status: 'active',
      };
      setStudents([...students, newStudent]);
    }
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout sidebar={<TeacherSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Manage Students</h1>
            <p className="text-gray-600 mt-1">View and manage all students in your classes</p>
          </div>
          <Button onClick={handleAddStudent} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">{students.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">SS3 Students</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">{students.filter(s => s.class === 'SS3').length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">SS2 Students</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">{students.filter(s => s.class === 'SS2').length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Performance</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">{(students.reduce((sum, s) => sum + s.avgScore, 0) / students.length).toFixed(1)}%</p>
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
          <Input type="text" placeholder="Search students by name, email, or class..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Email</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Class</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Phone</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Avg. Score</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{student.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{student.class}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{student.phone}</td>
                      <td className="py-3 px-4 text-center text-sm font-semibold text-gray-900">{student.avgScore}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded capitalize">{student.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEditStudent(student)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student.id)}
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

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="student@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="SS1">SS1</option>
              <option value="SS2">SS2</option>
              <option value="SS3">SS3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="+234 800 000 0000"
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
              {editingStudent ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
