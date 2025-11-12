'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';
import { Modal } from '@/components/ui/Modal';
import { QuestionForm } from '@/components/forms/QuestionForm';

interface Question {
  id: number;
  questionText: string;
  questionType: 'MCQ' | 'True/False' | 'Short Answer' | 'Essay' | 'Long Text';
  courseId: number;
  courseName: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  term: string;
  createdBy: string;
}

const mockQuestions: Question[] = [
  { id: 1, questionText: 'What is photosynthesis?', questionType: 'Essay', courseId: 1, courseName: 'Biology', topic: 'Plant Biology', difficulty: 'Medium', marks: 10, term: '1st Term 2024', createdBy: 'Mr. Johnson' },
  { id: 2, questionText: 'Solve: 2x + 5 = 15', questionType: 'Short Answer', courseId: 2, courseName: 'Mathematics', topic: 'Algebra', difficulty: 'Easy', marks: 5, term: '1st Term 2024', createdBy: 'Mrs. Adebayo' },
  { id: 3, questionText: 'The mitochondria is the powerhouse of the cell', questionType: 'True/False', courseId: 1, courseName: 'Biology', topic: 'Cell Biology', difficulty: 'Easy', marks: 2, term: '1st Term 2024', createdBy: 'Mr. Johnson' },
];

const mockCourses = [
  { id: 1, name: 'Biology', subject: 'Science' },
  { id: 2, name: 'Mathematics', subject: 'Science' },
  { id: 3, name: 'English', subject: 'Arts' },
];

export default function QuestionPoolPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const handleAddQuestion = (data: any) => {
    const newQuestion: Question = {
      ...data,
      id: questions.length + 1,
      term: '1st Term 2024',
      createdBy: 'Admin',
    };
    setQuestions([...questions, newQuestion]);
    setIsAddModalOpen(false);
  };

  const handleEditQuestion = (data: any) => {
    if (selectedQuestion) {
      setQuestions(questions.map(q => 
        q.id === selectedQuestion.id ? { ...q, ...data } : q
      ));
      setIsEditModalOpen(false);
      setSelectedQuestion(null);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const openEditModal = (question: any) => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !filterCourse || q.courseId === parseInt(filterCourse);
    const matchesType = !filterType || q.questionType === filterType;
    const matchesDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCourse && matchesType && matchesDifficulty;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MCQ': return 'bg-blue-100 text-blue-800';
      case 'True/False': return 'bg-green-100 text-green-800';
      case 'Short Answer': return 'bg-yellow-100 text-yellow-800';
      case 'Essay': return 'bg-purple-100 text-purple-800';
      case 'Long Text': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Question Pool</h1>
            <p className="text-gray-600 mt-1">Manage all exam questions</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Courses</option>
                {mockCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="MCQ">MCQ</option>
                <option value="True/False">True/False</option>
                <option value="Short Answer">Short Answer</option>
                <option value="Essay">Essay</option>
                <option value="Long Text">Long Text</option>
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Questions ({filteredQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Question</th>
                    <th className="text-center py-3 px-4">Type</th>
                    <th className="text-center py-3 px-4">Course</th>
                    <th className="text-center py-3 px-4">Topic</th>
                    <th className="text-center py-3 px-4">Difficulty</th>
                    <th className="text-center py-3 px-4">Marks</th>
                    <th className="text-center py-3 px-4">Term</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((q) => (
                    <tr key={q.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{q.questionText}</p>
                        <p className="text-xs text-gray-500 mt-1">By {q.createdBy}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(q.questionType)}`}>
                          {q.questionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {q.courseName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm">{q.topic}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-medium">{q.marks}</td>
                      <td className="py-3 px-4 text-center text-xs text-gray-600">{q.term}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-green-600 hover:text-green-700" title="Preview">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(q)} className="text-blue-600 hover:text-blue-700" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-600 hover:text-red-700" title="Delete">
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

        {/* Add Question Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Question"
          size="xl"
        >
          <QuestionForm
            onSubmit={handleAddQuestion}
            onCancel={() => setIsAddModalOpen(false)}
            availableCourses={mockCourses}
          />
        </Modal>

        {/* Edit Question Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQuestion(null);
          }}
          title="Edit Question"
          size="xl"
        >
          {selectedQuestion && (
            <QuestionForm
              initialData={selectedQuestion}
              onSubmit={handleEditQuestion}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedQuestion(null);
              }}
              availableCourses={mockCourses}
              isEdit
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
