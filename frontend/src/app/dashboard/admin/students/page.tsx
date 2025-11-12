'use client';

import { useState } from 'react';
import { Users, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { Modal } from '@/components/ui/Modal';
import { StudentForm } from '@/components/forms/StudentForm';

interface Student {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  classId: number;
  className: string;
  admissionDate: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentAddress: string;
  avgScore: number;
}

const generateStudentId = (className: string, count: number): string => {
  const classCode = className.replace(/\s+/g, '').toUpperCase();
  const paddedCount = String(count).padStart(5, '0');
  return `STU/${classCode}/${paddedCount}`;
};

const initialStudents: Student[] = [
  { id: 1, studentId: 'STU/SS3/00001', fullName: 'John Doe', email: 'john@student.com', phone: '+234 800 111 2222', dateOfBirth: '2006-05-15', classId: 1, className: 'SS3', admissionDate: '2021-09-01', parentName: 'Mr. Doe', parentPhone: '+234 800 111 3333', parentEmail: 'mrdoe@email.com', parentAddress: '123 Lagos Street', avgScore: 85.5 },
  { id: 2, studentId: 'STU/SS3/00002', fullName: 'Jane Smith', email: 'jane@student.com', phone: '+234 800 222 3333', dateOfBirth: '2006-08-20', classId: 1, className: 'SS3', admissionDate: '2021-09-01', parentName: 'Mrs. Smith', parentPhone: '+234 800 222 4444', parentEmail: 'mrssmith@email.com', parentAddress: '456 Abuja Road', avgScore: 92.3 },
  { id: 3, studentId: 'STU/SS2/00001', fullName: 'Mike Johnson', email: 'mike@student.com', phone: '+234 800 333 4444', dateOfBirth: '2007-03-10', classId: 2, className: 'SS2', admissionDate: '2022-09-01', parentName: 'Mr. Johnson', parentPhone: '+234 800 333 5555', parentEmail: 'mrjohnson@email.com', parentAddress: '789 Port Harcourt Ave', avgScore: 78.1 },
];

const mockClasses = [
  { id: 1, name: 'SS3 Science A', level: 'SS3' },
  { id: 2, name: 'SS2 Science B', level: 'SS2' },
  { id: 3, name: 'SS1 Science C', level: 'SS1' },
];

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleAddStudent = (data: any) => {
    const classStudentCount = students.filter(s => s.className === data.className).length + 1;
    const newStudent: Student = {
      ...data,
      id: students.length + 1,
      studentId: generateStudentId(data.className, classStudentCount),
      avgScore: 0,
    };
    setStudents([...students, newStudent]);
    setIsAddModalOpen(false);
  };

  const handleEditStudent = (data: any) => {
    if (selectedStudent) {
      setStudents(students.map(s => 
        s.id === selectedStudent.id ? { ...s, ...data } : s
      ));
      setIsEditModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">Manage Students</h1>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search students..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Card>
          <CardHeader><CardTitle>All Students</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Student ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-center py-3 px-4">Class</th>
                  <th className="text-center py-3 px-4">Parent/Guardian</th>
                  <th className="text-center py-3 px-4">Avg Score</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.filter(s => 
                  s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((s) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{s.studentId}</td>
                    <td className="py-3 px-4">{s.fullName}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{s.className}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">{s.parentName}</td>
                    <td className="py-3 px-4 text-center">{s.avgScore}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(s)} className="text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteStudent(s.id)} className="text-red-600 hover:text-red-700">
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

        {/* Add Student Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Student"
          size="lg"
        >
          <StudentForm
            onSubmit={handleAddStudent}
            onCancel={() => setIsAddModalOpen(false)}
            availableClasses={mockClasses}
          />
        </Modal>

        {/* Edit Student Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStudent(null);
          }}
          title="Edit Student"
          size="lg"
        >
          {selectedStudent && (
            <StudentForm
              initialData={selectedStudent}
              onSubmit={handleEditStudent}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedStudent(null);
              }}
              availableClasses={mockClasses}
              isEdit
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
