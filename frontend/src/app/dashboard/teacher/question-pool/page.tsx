'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeacherSidebar } from '@/components/dashboard/TeacherSidebar';
import { Modal } from '@/components/ui/Modal';
import { QuestionForm } from '@/components/forms/QuestionForm';

const mockQuestions = [
  { id: 1, questionText: 'What is photosynthesis?', questionType: 'Essay', courseId: 1, courseName: 'Biology', topic: 'Plant Biology', difficulty: 'Medium', marks: 10, term: '1st Term 2024' },
  { id: 2, questionText: 'The mitochondria is the powerhouse of the cell', questionType: 'True/False', courseId: 1, courseName: 'Biology', topic: 'Cell Biology', difficulty: 'Easy', marks: 2, term: '1st Term 2024' },
];

const mockCourses = [
  { id: 1, name: 'Biology', subject: 'Science' },
];

export default function TeacherQuestionPoolPage() {
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const handleAddQuestion = (data: any) => {
    const newQuestion = { ...data, id: questions.length + 1, term: '1st Term 2024' };
    setQuestions([...questions, newQuestion]);
    setIsAddModalOpen(false);
  };

  const handleEditQuestion = (data: any) => {
    if (selectedQuestion) {
      setQuestions(questions.map(q => q.id === selectedQuestion.id ? { ...q, ...data } : q));
      setIsEditModalOpen(false);
      setSelectedQuestion(null);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <DashboardLayout sidebar={<TeacherSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">My Question Pool</h1>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader><CardTitle>All Questions ({questions.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.filter(q => q.questionText.toLowerCase().includes(searchTerm.toLowerCase())).map((q: any) => (
                <div key={q.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{q.questionText}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{q.questionType}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">{q.courseName}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{q.difficulty}</span>
                        <span className="text-xs text-gray-600">{q.marks} marks</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedQuestion(q); setIsEditModalOpen(true); }} className="text-blue-600 hover:text-blue-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Question" size="xl">
          <QuestionForm onSubmit={handleAddQuestion} onCancel={() => setIsAddModalOpen(false)} availableCourses={mockCourses} />
        </Modal>

        <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedQuestion(null); }} title="Edit Question" size="xl">
          {selectedQuestion && (
            <QuestionForm initialData={selectedQuestion} onSubmit={handleEditQuestion} onCancel={() => { setIsEditModalOpen(false); setSelectedQuestion(null); }} availableCourses={mockCourses} isEdit />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
