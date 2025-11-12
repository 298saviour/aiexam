'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiService, handleApiError } from '@/services/api';
import { ArrowLeft, Download, AlertCircle, CheckCircle, XCircle, Flag } from 'lucide-react';

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  marks: number;
}

interface Answer {
  id: number;
  question_id: number;
  answer_text: string;
  ai_score: number;
  ai_feedback: string;
  ai_confidence: number;
  teacher_score?: number;
  teacher_feedback?: string;
  is_queried: boolean;
}

interface ExamResult {
  exam: {
    id: number;
    title: string;
    total_marks: number;
    pass_mark: number;
    duration: number;
  };
  student: {
    id: number;
    full_name: string;
    student_id: string;
  };
  submission: {
    submitted_at: string;
    total_score: number;
    percentage: number;
    grade: string;
    overall_feedback: string;
  };
  answers: (Answer & { question: Question })[];
}

export default function StudentResultsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [queryReason, setQueryReason] = useState('');
  const [submittingQuery, setSubmittingQuery] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [examId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await apiService.exams.getResults(parseInt(examId), user.studentId);
      setResult(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQueryGrade = async () => {
    if (!selectedAnswer || !queryReason.trim()) {
      alert('Please provide a reason for your query');
      return;
    }

    try {
      setSubmittingQuery(true);
      await apiService.gradeQueries.create({
        studentAnswerId: selectedAnswer,
        queryReason: queryReason.trim(),
      });
      alert('Grade query submitted successfully!');
      setShowQueryModal(false);
      setQueryReason('');
      setSelectedAnswer(null);
      fetchResults(); // Refresh to show updated query status
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSubmittingQuery(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A': 'text-green-600 bg-green-50',
      'B': 'text-blue-600 bg-blue-50',
      'C': 'text-yellow-600 bg-yellow-50',
      'D': 'text-orange-600 bg-orange-50',
      'F': 'text-red-600 bg-red-50',
    };
    return colors[grade] || 'text-gray-600 bg-gray-50';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export using jsPDF
    alert('PDF export coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Failed to load results'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Exams
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-5 w-5 mr-2" />
            Export PDF
          </button>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {result.exam.title}
            </h1>
            <p className="text-gray-600">
              Submitted on {new Date(result.submission.submitted_at).toLocaleString()}
            </p>
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Score</p>
              <p className="text-3xl font-bold text-blue-600">
                {result.submission.total_score}/{result.exam.total_marks}
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Percentage</p>
              <p className="text-3xl font-bold text-purple-600">
                {result.submission.percentage}%
              </p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Grade</p>
              <p className={`text-3xl font-bold ${getGradeColor(result.submission.grade).split(' ')[0]}`}>
                {result.submission.grade}
              </p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Pass Mark</p>
              <p className="text-3xl font-bold text-yellow-600">
                {result.exam.pass_mark}
              </p>
            </div>
          </div>

          {/* Overall Feedback */}
          {result.submission.overall_feedback && (
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                Overall Feedback
              </h3>
              <p className="text-gray-700">{result.submission.overall_feedback}</p>
            </div>
          )}

          {/* Pass/Fail Status */}
          <div className={`p-4 rounded-lg text-center mb-8 ${
            result.submission.total_score >= result.exam.pass_mark
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            {result.submission.total_score >= result.exam.pass_mark ? (
              <p className="text-green-700 font-semibold flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Congratulations! You passed this exam
              </p>
            ) : (
              <p className="text-red-700 font-semibold flex items-center justify-center">
                <XCircle className="h-5 w-5 mr-2" />
                Unfortunately, you did not pass this exam
              </p>
            )}
          </div>
        </div>

        {/* Question-by-Question Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Question-by-Question Breakdown
          </h2>

          <div className="space-y-6">
            {result.answers.map((answer, index) => {
              const finalScore = answer.teacher_score !== null && answer.teacher_score !== undefined
                ? answer.teacher_score
                : answer.ai_score;
              const finalFeedback = answer.teacher_feedback || answer.ai_feedback;

              return (
                <div
                  key={answer.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-gray-900 mr-2">
                          Question {index + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({answer.question.question_type})
                        </span>
                        {answer.is_queried && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                            <Flag className="h-3 w-3 mr-1" />
                            Queried
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4">{answer.question.question_text}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {finalScore}/{answer.question.marks}
                      </p>
                      <p className="text-sm text-gray-500">marks</p>
                    </div>
                  </div>

                  {/* Student Answer */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Your Answer:</p>
                    <p className="text-gray-900">{answer.answer_text || 'No answer provided'}</p>
                  </div>

                  {/* AI Confidence */}
                  <div className="mb-4 flex items-center">
                    <span className="text-sm text-gray-600 mr-2">AI Confidence:</span>
                    <span className={`font-semibold ${getConfidenceColor(answer.ai_confidence)}`}>
                      {(answer.ai_confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Feedback */}
                  <div className={`p-4 rounded-lg ${
                    answer.teacher_feedback ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-gray-50'
                  }`}>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      {answer.teacher_feedback ? 'Teacher Feedback:' : 'AI Feedback:'}
                    </p>
                    <p className="text-gray-700">{finalFeedback}</p>
                  </div>

                  {/* Query Button */}
                  {!answer.is_queried && (
                    <button
                      onClick={() => {
                        setSelectedAnswer(answer.id);
                        setShowQueryModal(true);
                      }}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Query this grade
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Query Modal */}
      {showQueryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Query Grade</h3>
            <p className="text-gray-600 mb-4">
              Please explain why you believe this grade should be reviewed:
            </p>
            <textarea
              value={queryReason}
              onChange={(e) => setQueryReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32"
              placeholder="Enter your reason..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowQueryModal(false);
                  setQueryReason('');
                  setSelectedAnswer(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                disabled={submittingQuery}
              >
                Cancel
              </button>
              <button
                onClick={handleQueryGrade}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={submittingQuery}
              >
                {submittingQuery ? 'Submitting...' : 'Submit Query'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
