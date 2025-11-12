'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';

interface QuestionFormData {
  questionText: string;
  questionType: 'MCQ' | 'True/False' | 'Short Answer' | 'Essay' | 'Long Text';
  courseId: number;
  courseName: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  options?: string[]; // For MCQ
  correctAnswer: string | number; // For MCQ (index) or True/False
  acceptableAnswers: string[]; // For Essay/Long Text (multiple acceptable answers)
  keywords: string[]; // Keywords for AI grading
  explanation: string;
}

interface QuestionFormProps {
  initialData?: Partial<QuestionFormData>;
  onSubmit: (data: QuestionFormData) => void;
  onCancel: () => void;
  availableCourses: Array<{ id: number; name: string; subject: string }>;
  isEdit?: boolean;
}

const questionTypes = ['MCQ', 'True/False', 'Short Answer', 'Essay', 'Long Text'] as const;
const difficulties = ['Easy', 'Medium', 'Hard'] as const;

export function QuestionForm({ initialData, onSubmit, onCancel, availableCourses, isEdit = false }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    questionText: initialData?.questionText || '',
    questionType: initialData?.questionType || 'MCQ',
    courseId: initialData?.courseId || 0,
    courseName: initialData?.courseName || '',
    topic: initialData?.topic || '',
    difficulty: initialData?.difficulty || 'Medium',
    marks: initialData?.marks || 1,
    options: initialData?.options || ['', '', '', ''],
    correctAnswer: initialData?.correctAnswer || '',
    acceptableAnswers: initialData?.acceptableAnswers || [''],
    keywords: initialData?.keywords || [''],
    explanation: initialData?.explanation || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QuestionFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof QuestionFormData, string>> = {};

    if (!formData.questionText.trim()) newErrors.questionText = 'Question text is required';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.topic.trim()) newErrors.topic = 'Topic is required';
    if (formData.marks <= 0) newErrors.marks = 'Marks must be greater than 0';

    if (formData.questionType === 'MCQ') {
      const filledOptions = formData.options?.filter(opt => opt.trim()) || [];
      if (filledOptions.length < 2) {
        newErrors.options = 'At least 2 options are required for MCQ';
      }
      if (formData.correctAnswer === '') {
        newErrors.correctAnswer = 'Select the correct answer';
      }
    }

    if (formData.questionType === 'True/False' && formData.correctAnswer === '') {
      newErrors.correctAnswer = 'Select the correct answer';
    }

    if (['Essay', 'Long Text'].includes(formData.questionType)) {
      const filledAnswers = formData.acceptableAnswers.filter(ans => ans.trim());
      if (filledAnswers.length === 0) {
        newErrors.acceptableAnswers = 'At least one acceptable answer is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Clean up data based on question type
      const cleanedData = { ...formData };
      if (formData.questionType !== 'MCQ') {
        delete cleanedData.options;
      }
      if (!['Essay', 'Long Text'].includes(formData.questionType)) {
        cleanedData.acceptableAnswers = [];
        cleanedData.keywords = [];
      }
      onSubmit(cleanedData);
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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...(formData.options || []), ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, options: newOptions });
  };

  const handleAcceptableAnswerChange = (index: number, value: string) => {
    const newAnswers = [...formData.acceptableAnswers];
    newAnswers[index] = value;
    setFormData({ ...formData, acceptableAnswers: newAnswers });
  };

  const addAcceptableAnswer = () => {
    setFormData({ ...formData, acceptableAnswers: [...formData.acceptableAnswers, ''] });
  };

  const removeAcceptableAnswer = (index: number) => {
    const newAnswers = formData.acceptableAnswers.filter((_, i) => i !== index);
    setFormData({ ...formData, acceptableAnswers: newAnswers });
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData({ ...formData, keywords: newKeywords });
  };

  const addKeyword = () => {
    setFormData({ ...formData, keywords: [...formData.keywords, ''] });
  };

  const removeKeyword = (index: number) => {
    const newKeywords = formData.keywords.filter((_, i) => i !== index);
    setFormData({ ...formData, keywords: newKeywords });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
            <select
              value={formData.questionType}
              onChange={(e) => setFormData({ ...formData, questionType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {questionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
            <Input
              label="Topic/Chapter"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              error={errors.topic}
              placeholder="e.g., Cell Biology"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div>
            <Input
              label="Marks"
              type="number"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 0 })}
              error={errors.marks}
              placeholder="1"
            />
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
        <textarea
          value={formData.questionText}
          onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter the question..."
        />
        {errors.questionText && <p className="text-red-600 text-sm mt-1">{errors.questionText}</p>}
      </div>

      {/* MCQ Options */}
      {formData.questionType === 'MCQ' && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
          <div className="space-y-3">
            {formData.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === index}
                  onChange={() => setFormData({ ...formData, correctAnswer: index })}
                  className="w-4 h-4"
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1"
                />
                {(formData.options?.length || 0) > 2 && (
                  <button type="button" onClick={() => removeOption(index)} className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addOption} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>
          {errors.options && <p className="text-red-600 text-sm mt-1">{errors.options}</p>}
          {errors.correctAnswer && <p className="text-red-600 text-sm mt-1">{errors.correctAnswer}</p>}
        </div>
      )}

      {/* True/False */}
      {formData.questionType === 'True/False' && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Correct Answer</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswer === 'True'}
                onChange={() => setFormData({ ...formData, correctAnswer: 'True' })}
                className="w-4 h-4"
              />
              <span>True</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswer === 'False'}
                onChange={() => setFormData({ ...formData, correctAnswer: 'False' })}
                className="w-4 h-4"
              />
              <span>False</span>
            </label>
          </div>
          {errors.correctAnswer && <p className="text-red-600 text-sm mt-1">{errors.correctAnswer}</p>}
        </div>
      )}

      {/* Short Answer */}
      {formData.questionType === 'Short Answer' && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Correct Answer</h3>
          <Input
            value={formData.correctAnswer as string}
            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
            placeholder="Enter the correct answer"
          />
        </div>
      )}

      {/* Essay/Long Text - Multiple Acceptable Answers */}
      {['Essay', 'Long Text'].includes(formData.questionType) && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceptable Answers (for AI Grading)</h3>
          <p className="text-sm text-gray-600 mb-3">Provide multiple acceptable answers. AI will grade with leniency if student's answer relates to any of these.</p>
          <div className="space-y-3">
            {formData.acceptableAnswers.map((answer, index) => (
              <div key={index} className="flex items-start gap-2">
                <textarea
                  value={answer}
                  onChange={(e) => handleAcceptableAnswerChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder={`Acceptable answer ${index + 1}`}
                />
                {formData.acceptableAnswers.length > 1 && (
                  <button type="button" onClick={() => removeAcceptableAnswer(index)} className="text-red-600 mt-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addAcceptableAnswer} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Another Acceptable Answer
            </Button>
          </div>
          {errors.acceptableAnswers && <p className="text-red-600 text-sm mt-1">{errors.acceptableAnswers}</p>}

          {/* Keywords */}
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Keywords (for AI matching)</h4>
            <p className="text-sm text-gray-600 mb-3">Add important keywords that should appear in student's answer</p>
            <div className="space-y-2">
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={keyword}
                    onChange={(e) => handleKeywordChange(index, e.target.value)}
                    placeholder={`Keyword ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.keywords.length > 1 && (
                    <button type="button" onClick={() => removeKeyword(index)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addKeyword} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Keyword
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Explanation/Feedback (Optional)</h3>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Provide explanation or feedback for students..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Question' : 'Add Question'}
        </Button>
      </div>
    </form>
  );
}
