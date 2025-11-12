'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Flag, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Question {
  id: number;
  questionText: string;
  questionType: 'MCQ' | 'True/False' | 'Short Answer' | 'Essay' | 'Long Text';
  options?: string[];
  marks: number;
}

const mockExam = {
  id: 1,
  title: 'Biology Final Exam',
  duration: 120, // minutes
  totalMarks: 100,
  instructions: 'Answer all questions. Read each question carefully before answering.',
  questions: [
    { id: 1, questionText: 'What is photosynthesis? Explain the process in detail.', questionType: 'Essay', marks: 10 },
    { id: 2, questionText: 'The mitochondria is the powerhouse of the cell.', questionType: 'True/False', marks: 2 },
    { id: 3, questionText: 'Which organelle is responsible for protein synthesis?', questionType: 'MCQ', options: ['Ribosome', 'Mitochondria', 'Nucleus', 'Golgi Apparatus'], marks: 5 },
    { id: 4, questionText: 'Name the process by which plants lose water through their leaves.', questionType: 'Short Answer', marks: 3 },
  ] as Question[],
};

export default function TakeExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(mockExam.duration * 60); // in seconds
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-save every 30 seconds
    const autoSave = setInterval(() => {
      saveAnswers();
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(autoSave);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveAnswers = () => {
    // Auto-save to localStorage or backend
    localStorage.setItem(`exam_${params.id}_answers`, JSON.stringify(answers));
  };

  const handleAutoSubmit = () => {
    alert('Time is up! Your exam will be submitted automatically.');
    handleSubmit();
  };

  const handleSubmit = () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      saveAnswers();
      // Submit to backend
      setTimeout(() => {
        router.push(`/dashboard/student/results/${params.id}`);
      }, 1000);
    }
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const toggleFlag = (questionId: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const getQuestionStatus = (questionId: number) => {
    if (answers[questionId] !== undefined && answers[questionId] !== '') {
      return 'answered';
    }
    return 'unanswered';
  };

  const answeredCount = mockExam.questions.filter(q => getQuestionStatus(q.id) === 'answered').length;
  const unansweredCount = mockExam.questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{mockExam.title}</h1>
              <p className="text-sm text-gray-600">Total Marks: {mockExam.totalMarks}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-semibold">{formatTime(timeRemaining)}</span>
              </div>
              <Button onClick={() => {
                if (confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
                  handleSubmit();
                }
              }} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Unanswered ({unansweredCount})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Flag className="w-3 h-3 text-orange-500" />
                  <span>Flagged ({flaggedQuestions.size})</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {mockExam.questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      const element = document.getElementById(`question-${q.id}`);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`w-10 h-10 rounded flex items-center justify-center text-sm font-medium relative
                      ${getQuestionStatus(q.id) === 'answered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}
                      hover:opacity-80 transition-opacity`}
                  >
                    {q.id}
                    {flaggedQuestions.has(q.id) && (
                      <Flag className="w-3 h-3 text-orange-500 absolute -top-1 -right-1" fill="currentColor" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="lg:col-span-3 space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Instructions</h3>
                  <p className="text-sm text-blue-800">{mockExam.instructions}</p>
                </div>
              </div>
            </div>

            {/* Questions List */}
            {mockExam.questions.map((question, index) => (
              <div key={question.id} id={`question-${question.id}`} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold text-gray-900">Question {question.id}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                        {question.questionType}
                      </span>
                    </div>
                    <p className="text-gray-800 text-base leading-relaxed">{question.questionText}</p>
                  </div>
                  <button
                    onClick={() => toggleFlag(question.id)}
                    className={`ml-4 p-2 rounded hover:bg-gray-100 ${flaggedQuestions.has(question.id) ? 'text-orange-500' : 'text-gray-400'}`}
                    title="Flag for review"
                  >
                    <Flag className="w-5 h-5" fill={flaggedQuestions.has(question.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Answer Input Based on Question Type */}
                <div className="mt-4">
                  {question.questionType === 'MCQ' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-800">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.questionType === 'True/False' && (
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="True"
                          checked={answers[question.id] === 'True'}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-800">True</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="False"
                          checked={answers[question.id] === 'False'}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-800">False</span>
                      </label>
                    </div>
                  )}

                  {question.questionType === 'Short Answer' && (
                    <input
                      type="text"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your answer here..."
                    />
                  )}

                  {(question.questionType === 'Essay' || question.questionType === 'Long Text') && (
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={8}
                      placeholder="Type your answer here..."
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Answered: <span className="font-semibold text-green-600">{answeredCount}</span> / {mockExam.questions.length}
                  </p>
                  {unansweredCount > 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
                      handleSubmit();
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
