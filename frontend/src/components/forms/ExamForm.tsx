'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ExamFormData {
  title: string;
  description: string;
  courseId: number;
  courseName: string;
  classIds: number[];
  term: '1st Term' | '2nd Term' | '3rd Term';
  examType: 'Test' | 'Mid-Term' | 'Final';
  duration: number; // in minutes
  totalMarks: number;
  passMark: number;
  scheduledDate: string;
  scheduledTime: string;
  instructions: string;
}

interface ExamFormProps {
  initialData?: Partial<ExamFormData>;
  onSubmit: (data: ExamFormData) => void;
  onCancel: () => void;
  availableClasses: Array<{ id: number; name: string; level: string }>;
  availableCourses: Array<{ id: number; name: string; subject: string }>;
  isEdit?: boolean;
}

const terms = ['1st Term', '2nd Term', '3rd Term'] as const;
const examTypes = ['Test', 'Mid-Term', 'Final'] as const;

export function ExamForm({ initialData, onSubmit, onCancel, availableClasses, availableCourses, isEdit = false }: ExamFormProps) {
  const [formData, setFormData] = useState<ExamFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    courseId: initialData?.courseId || 0,
    courseName: initialData?.courseName || '',
    classIds: initialData?.classIds || [],
    term: initialData?.term || '1st Term',
    examType: initialData?.examType || 'Test',
    duration: initialData?.duration || 60,
    totalMarks: initialData?.totalMarks || 100,
    passMark: initialData?.passMark || 40,
    scheduledDate: initialData?.scheduledDate || '',
    scheduledTime: initialData?.scheduledTime || '',
    instructions: initialData?.instructions || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExamFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof ExamFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Exam title is required';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (formData.classIds.length === 0) newErrors.classIds = 'Select at least one class';
    if (!formData.term) newErrors.term = 'Term is required';
    if (!formData.examType) newErrors.examType = 'Exam type is required';
    if (formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    if (formData.totalMarks <= 0) newErrors.totalMarks = 'Total marks must be greater than 0';
    if (formData.passMark < 0 || formData.passMark > formData.totalMarks) {
      newErrors.passMark = 'Pass mark must be between 0 and total marks';
    }
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Scheduled date is required';
    if (!formData.scheduledTime) newErrors.scheduledTime = 'Scheduled time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourse = availableCourses.find(c => c.id === parseInt(e.target.value));
    if (selectedCourse) {
      setFormData({
        ...formData,
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
      });
    }
  };

  const handleClassToggle = (classId: number) => {
    setFormData(prev => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Exam Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
              placeholder="e.g., Biology Final Exam"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Brief description of the exam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course/Subject</label>
            <select
              value={formData.courseId}
              onChange={handleCourseChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              {availableCourses.map(course => (
                <option key={course.id} value={course.id}>{course.name} - {course.subject}</option>
              ))}
            </select>
            {errors.courseId && <p className="text-red-600 text-sm mt-1">{errors.courseId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
            <select
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {terms.map(term => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
            {errors.term && <p className="text-red-600 text-sm mt-1">{errors.term}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
            <select
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {examTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.examType && <p className="text-red-600 text-sm mt-1">{errors.examType}</p>}
          </div>

          <div>
            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              error={errors.duration}
              placeholder="60"
            />
          </div>
        </div>
      </div>

      {/* Grading */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Total Marks"
              type="number"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 0 })}
              error={errors.totalMarks}
              placeholder="100"
            />
          </div>

          <div>
            <Input
              label="Pass Mark"
              type="number"
              value={formData.passMark}
              onChange={(e) => setFormData({ ...formData, passMark: parseInt(e.target.value) || 0 })}
              error={errors.passMark}
              placeholder="40"
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Date"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              error={errors.scheduledDate}
            />
          </div>

          <div>
            <Input
              label="Time"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              error={errors.scheduledTime}
            />
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign to Classes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {availableClasses.map(cls => (
            <label key={cls.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={formData.classIds.includes(cls.id)}
                onChange={() => handleClassToggle(cls.id)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">{cls.name}</span>
            </label>
          ))}
        </div>
        {errors.classIds && <p className="text-red-600 text-sm mt-1">{errors.classIds}</p>}
      </div>

      {/* Instructions */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
        <textarea
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter exam instructions for students..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Exam' : 'Create Exam'}
        </Button>
      </div>
    </form>
  );
}
