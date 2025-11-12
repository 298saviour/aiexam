'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ClassFormData {
  name: string;
  level: string;
  department: string;
  academicYear: string;
  subjects: string[];
  assignedTeachers: number[];
}

interface ClassFormProps {
  initialData?: Partial<ClassFormData>;
  onSubmit: (data: ClassFormData) => void;
  onCancel: () => void;
  availableTeachers: Array<{ id: number; fullName: string; subject: string }>;
  isEdit?: boolean;
}

const classLevels = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
const departments = ['Science', 'Arts', 'Commercial'];
const allSubjects = [
  'Mathematics', 'English', 'Biology', 'Chemistry', 'Physics',
  'Economics', 'Government', 'Literature', 'Geography', 'Civic Education',
  'Computer Science', 'Agricultural Science'
];

export function ClassForm({ initialData, onSubmit, onCancel, availableTeachers, isEdit = false }: ClassFormProps) {
  const [formData, setFormData] = useState<ClassFormData>({
    name: initialData?.name || '',
    level: initialData?.level || '',
    department: initialData?.department || '',
    academicYear: initialData?.academicYear || new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
    subjects: initialData?.subjects || [],
    assignedTeachers: initialData?.assignedTeachers || [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClassFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof ClassFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Class name is required';
    if (!formData.level) newErrors.level = 'Class level is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.academicYear.trim()) newErrors.academicYear = 'Academic year is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'Select at least one subject';
    if (formData.assignedTeachers.length === 0) newErrors.assignedTeachers = 'Assign at least one teacher';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleTeacherToggle = (teacherId: number) => {
    setFormData(prev => ({
      ...prev,
      assignedTeachers: prev.assignedTeachers.includes(teacherId)
        ? prev.assignedTeachers.filter(id => id !== teacherId)
        : [...prev.assignedTeachers, teacherId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Class Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="e.g., SS3 Science A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            {classLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.level && <p className="text-red-600 text-sm mt-1">{errors.level}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
        </div>

        <div>
          <Input
            label="Academic Year/Session"
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            error={errors.academicYear}
            placeholder="2024/2025"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subjects (Select Multiple)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {allSubjects.map(subject => (
            <label key={subject} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={formData.subjects.includes(subject)}
                onChange={() => handleSubjectToggle(subject)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">{subject}</span>
            </label>
          ))}
        </div>
        {errors.subjects && <p className="text-red-600 text-sm mt-1">{errors.subjects}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Teachers (Select Multiple)</label>
        <div className="border border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto">
          {availableTeachers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No teachers available</p>
          ) : (
            <div className="space-y-2">
              {availableTeachers.map(teacher => (
                <label key={teacher.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded cursor-pointer border border-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.assignedTeachers.includes(teacher.id)}
                    onChange={() => handleTeacherToggle(teacher.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{teacher.fullName}</p>
                    <p className="text-xs text-gray-500">{teacher.subject}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        {errors.assignedTeachers && <p className="text-red-600 text-sm mt-1">{errors.assignedTeachers}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Class' : 'Add Class'}
        </Button>
      </div>
    </form>
  );
}
