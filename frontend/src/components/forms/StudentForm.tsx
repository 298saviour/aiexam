'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface StudentFormData {
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
}

interface StudentFormProps {
  initialData?: Partial<StudentFormData>;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  availableClasses: Array<{ id: number; name: string; level: string }>;
  isEdit?: boolean;
}

export function StudentForm({ initialData, onSubmit, onCancel, availableClasses, isEdit = false }: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    classId: initialData?.classId || 0,
    className: initialData?.className || '',
    admissionDate: initialData?.admissionDate || new Date().toISOString().split('T')[0],
    parentName: initialData?.parentName || '',
    parentPhone: initialData?.parentPhone || '',
    parentEmail: initialData?.parentEmail || '',
    parentAddress: initialData?.parentAddress || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

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
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.classId) newErrors.classId = 'Class is required';
    if (!formData.admissionDate) newErrors.admissionDate = 'Admission date is required';
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent/Guardian name is required';
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent/Guardian phone is required';
    } else if (!/^(\+234|0)[0-9]{10}$/.test(formData.parentPhone.replace(/\s/g, ''))) {
      newErrors.parentPhone = 'Invalid Nigerian phone number';
    }
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = 'Parent/Guardian email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Invalid email format';
    }
    if (!formData.parentAddress.trim()) newErrors.parentAddress = 'Parent/Guardian address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = availableClasses.find(c => c.id === parseInt(e.target.value));
    if (selectedClass) {
      setFormData({
        ...formData,
        classId: selectedClass.id,
        className: selectedClass.name,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
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
              placeholder="student@school.com"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={formData.classId}
              onChange={handleClassChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {availableClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            {errors.classId && <p className="text-red-600 text-sm mt-1">{errors.classId}</p>}
          </div>

          <div>
            <Input
              label="Admission Date"
              type="date"
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
              error={errors.admissionDate}
            />
          </div>
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Parent/Guardian Name"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              error={errors.parentName}
              placeholder="Enter parent/guardian name"
            />
          </div>

          <div>
            <Input
              label="Parent/Guardian Phone"
              value={formData.parentPhone}
              onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
              error={errors.parentPhone}
              placeholder="+234 800 000 0000"
            />
          </div>

          <div>
            <Input
              label="Parent/Guardian Email"
              type="email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
              error={errors.parentEmail}
              placeholder="parent@email.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Address</label>
            <textarea
              value={formData.parentAddress}
              onChange={(e) => setFormData({ ...formData, parentAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter full address"
            />
            {errors.parentAddress && <p className="text-red-600 text-sm mt-1">{errors.parentAddress}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}
