'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TeacherFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  department: string;
  subject: string;
  classes: string[];
  status: 'active' | 'suspended' | 'absent';
}

interface TeacherFormProps {
  initialData?: Partial<TeacherFormData>;
  onSubmit: (data: TeacherFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const departments = ['Science', 'Arts', 'Commercial', 'Technical'];
const subjects = ['Mathematics', 'English', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Government', 'Literature'];
const availableClasses = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

export function TeacherForm({ initialData, onSubmit, onCancel, isEdit = false }: TeacherFormProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    department: initialData?.department || '',
    subject: initialData?.subject || '',
    classes: initialData?.classes || [],
    status: initialData?.status || 'active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});

  const validateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+234|0)[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid Nigerian phone number';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (validateAge(formData.dateOfBirth) < 21) {
      newErrors.dateOfBirth = 'Teacher must be at least 21 years old';
    }
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (formData.classes.length === 0) newErrors.classes = 'Select at least one class';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleClassToggle = (className: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
            placeholder="Enter full name"
          />
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="teacher@school.com"
          />
        </div>

        <div>
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            placeholder="+234 800 000 0000"
          />
        </div>

        <div>
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            error={errors.dateOfBirth}
          />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Subject</option>
            {subjects.map(subj => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>
          {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Classes (Select Multiple)</label>
        <div className="grid grid-cols-3 gap-2">
          {availableClasses.map(className => (
            <label key={className} className="flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.classes.includes(className)}
                onChange={() => handleClassToggle(className)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">{className}</span>
            </label>
          ))}
        </div>
        {errors.classes && <p className="text-red-600 text-sm mt-1">{errors.classes}</p>}
      </div>

      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Teacher' : 'Add Teacher'}
        </Button>
      </div>
    </form>
  );
}
