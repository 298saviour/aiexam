'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StudentSidebar } from '@/components/dashboard/StudentSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api';

interface Question {
  id: number;
  questionText: string;
  options?: string[];
  wordLimit?: number;
  points: number;
}

interface Exam {
  id: number;
  title: string;
  type: string;
  duration: number;
  questions: Question[];
}

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchExam = async () => {
    try {
      const response = await apiClient.get(`/exams/${examId}`);
      if (response.data.success) {
        const examData = response.data.data;
        setExam(examData);
        setTimeLeft(examData.duration * 60); // Convert minutes to seconds
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = exam?.questions.filter((q) => !answers[q.id]);
    if (unanswered && unanswered.length > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    try {
      const response = await apiClient.post(`/exams/${examId}/submit`, { answers });
      if (response.data.success) {
        alert('Exam submitted successfully! AI grading in progress.');
        router.push('/dashboard/student');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit exam');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<StudentSidebar />}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !exam) {
    return (
      <DashboardLayout sidebar={<StudentSidebar />}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="space-y-6">
        {/* Header with Timer */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{exam?.title}</h1>
            <p className="text-gray-600 mt-1">
              {exam?.questions.length} questions • {exam?.duration} minutes
            </p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {exam?.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    Question {index + 1} ({question.points} {question.points === 1 ? 'point' : 'points'})
                  </CardTitle>
                  {question.wordLimit && (
                    <span className="text-sm text-gray-500">Max {question.wordLimit} words</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{question.questionText}</p>

                {/* MCQ Options */}
                {question.options && question.options.length > 0 && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
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

                {/* Written Answer */}
                {!question.options && (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg sticky bottom-4">
          <div className="text-sm text-gray-600">
            Answered: {Object.keys(answers).length} / {exam?.questions.length}
          </div>
          <Button
            onClick={handleSubmit}
            isLoading={submitting}
            size="lg"
            className="px-8"
          >
            Submit Exam
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
