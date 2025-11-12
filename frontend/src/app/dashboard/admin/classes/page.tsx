'use client';

import { useState } from 'react';
import { School, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { Modal } from '@/components/ui/Modal';
import { ClassForm } from '@/components/forms/ClassForm';

interface Class {
  id: number;
  name: string;
  level: string;
  department: string;
  academicYear: string;
  subjects: string[];
  assignedTeachers: number[];
  students: number;
  teachers: number;
}

const initialClasses: Class[] = [
  { id: 1, name: 'SS3 Science A', level: 'SS3', department: 'Science', academicYear: '2024/2025', subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English', 'Civic Education'], assignedTeachers: [1, 2, 4], students: 45, teachers: 4 },
  { id: 2, name: 'SS2 Science B', level: 'SS2', department: 'Science', academicYear: '2024/2025', subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English', 'Civic Education'], assignedTeachers: [2, 3], students: 42, teachers: 4 },
  { id: 3, name: 'SS1 Science C', level: 'SS1', department: 'Science', academicYear: '2024/2025', subjects: ['Biology', 'Chemistry', 'Mathematics', 'English', 'Computer Science'], assignedTeachers: [1, 3], students: 48, teachers: 3 },
];

// Mock teachers data - in real app, fetch from API
const mockTeachers = [
  { id: 1, fullName: 'Mr. Johnson', subject: 'Biology' },
  { id: 2, fullName: 'Mrs. Adebayo', subject: 'Mathematics' },
  { id: 3, fullName: 'Mr. Okonkwo', subject: 'English' },
  { id: 4, fullName: 'Dr. Nwosu', subject: 'Chemistry' },
];

export default function ManageClassesPage() {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const handleAddClass = (data: Omit<Class, 'id' | 'students' | 'teachers'>) => {
    const newClass: Class = {
      ...data,
      id: classes.length + 1,
      students: 0,
      teachers: data.assignedTeachers.length,
    };
    setClasses([...classes, newClass]);
    setIsAddModalOpen(false);
  };

  const handleEditClass = (data: Omit<Class, 'id' | 'students' | 'teachers'>) => {
    if (selectedClass) {
      setClasses(classes.map(c => 
        c.id === selectedClass.id 
          ? { ...c, ...data, teachers: data.assignedTeachers.length }
          : c
      ));
      setIsEditModalOpen(false);
      setSelectedClass(null);
    }
  };

  const handleDeleteClass = (id: number) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const openEditModal = (cls: Class) => {
    setSelectedClass(cls);
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Manage Classes</h1>
            <p className="text-gray-600 mt-1">View and manage all classes</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Class
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <Card key={cls.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{cls.academicYear}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(cls)} className="text-blue-600 hover:text-blue-700">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClass(cls.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">{cls.students}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Teachers:</span>
                    <span className="font-medium">{cls.teachers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subjects:</span>
                    <span className="font-medium">{cls.subjects.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{cls.department}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Class Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Class"
          size="lg"
        >
          <ClassForm
            onSubmit={handleAddClass}
            onCancel={() => setIsAddModalOpen(false)}
            availableTeachers={mockTeachers}
          />
        </Modal>

        {/* Edit Class Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClass(null);
          }}
          title="Edit Class"
          size="lg"
        >
          {selectedClass && (
            <ClassForm
              initialData={selectedClass}
              onSubmit={handleEditClass}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedClass(null);
              }}
              availableTeachers={mockTeachers}
              isEdit
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
