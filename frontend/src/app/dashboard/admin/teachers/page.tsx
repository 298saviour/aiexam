'use client';

import { useState } from 'react';
import { GraduationCap, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { Modal } from '@/components/ui/Modal';
import { TeacherForm } from '@/components/forms/TeacherForm';

interface Teacher {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  department: string;
  subject: string;
  classes: string[];
  students: number;
  courses: number;
  status: 'active' | 'suspended' | 'absent';
}

const initialTeachers: Teacher[] = [
  { id: 1, fullName: 'Mr. Johnson', email: 'johnson@teacher.com', phone: '+234 800 123 4567', dateOfBirth: '1985-05-15', department: 'Science', subject: 'Biology', classes: ['SS3'], students: 45, courses: 2, status: 'active' },
  { id: 2, fullName: 'Mrs. Adebayo', email: 'adebayo@teacher.com', phone: '+234 800 234 5678', dateOfBirth: '1982-08-20', department: 'Science', subject: 'Mathematics', classes: ['SS2', 'SS3'], students: 42, courses: 3, status: 'active' },
  { id: 3, fullName: 'Mr. Okonkwo', email: 'okonkwo@teacher.com', phone: '+234 800 345 6789', dateOfBirth: '1988-03-10', department: 'Arts', subject: 'English', classes: ['SS1', 'SS2'], students: 48, courses: 2, status: 'active' },
  { id: 4, fullName: 'Dr. Nwosu', email: 'nwosu@teacher.com', phone: '+234 800 456 7890', dateOfBirth: '1980-11-25', department: 'Science', subject: 'Chemistry', classes: ['SS3'], students: 40, courses: 2, status: 'active' },
];

export default function ManageTeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleAddTeacher = (data: Omit<Teacher, 'id' | 'students' | 'courses'>) => {
    const newTeacher: Teacher = {
      ...data,
      id: teachers.length + 1,
      students: 0,
      courses: 0,
    };
    setTeachers([...teachers, newTeacher]);
    setIsAddModalOpen(false);
  };

  const handleEditTeacher = (data: Omit<Teacher, 'id' | 'students' | 'courses'>) => {
    if (selectedTeacher) {
      setTeachers(teachers.map(t => 
        t.id === selectedTeacher.id 
          ? { ...t, ...data }
          : t
      ));
      setIsEditModalOpen(false);
      setSelectedTeacher(null);
    }
  };

  const handleDeleteTeacher = (id: number) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Manage Teachers</h1>
            <p className="text-gray-600 mt-1">View and manage all teachers</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Teacher
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Teachers</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">{teachers.length}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input type="text" placeholder="Search teachers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Email</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Subject</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Students</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Courses</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.filter(t => t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || t.email.toLowerCase().includes(searchTerm.toLowerCase())).map((teacher) => (
                    <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{teacher.fullName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{teacher.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{teacher.subject}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">{teacher.students}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">{teacher.courses}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">{teacher.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEditModal(teacher)} className="text-blue-600 hover:text-blue-700">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteTeacher(teacher.id)} className="text-red-600 hover:text-red-700">
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

        {/* Add Teacher Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Teacher"
          size="lg"
        >
          <TeacherForm
            onSubmit={handleAddTeacher}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>

        {/* Edit Teacher Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTeacher(null);
          }}
          title="Edit Teacher"
          size="lg"
        >
          {selectedTeacher && (
            <TeacherForm
              initialData={selectedTeacher}
              onSubmit={handleEditTeacher}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedTeacher(null);
              }}
              isEdit
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
