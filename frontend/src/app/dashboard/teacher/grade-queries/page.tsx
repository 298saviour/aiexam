'use client';

import { useState, useEffect } from 'react';
import { apiService, handleApiError } from '@/services/api';
import { MessageSquare, Clock, CheckCircle, Send } from 'lucide-react';

interface GradeQuery {
  id: number;
  student_answer_id: number;
  student_name: string;
  query_reason: string;
  teacher_response: string | null;
  status: 'pending' | 'resolved';
  created_at: string;
  question_text: string;
  answer_text: string;
  ai_score: number;
  ai_feedback: string;
  max_marks: number;
  exam_title: string;
}

export default function TeacherGradeQueriesPage() {
  const [queries, setQueries] = useState<GradeQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('pending');
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [response, setResponse] = useState('');
  const [adjustedScore, setAdjustedScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await apiService.gradeQueries.getAll();
      setQueries(res.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (queryId: number) => {
    if (!response.trim()) {
      alert('Please provide a response');
      return;
    }

    try {
      setSubmitting(true);
      await apiService.gradeQueries.respond(queryId, {
        teacherResponse: response.trim(),
        adjustedScore: adjustedScore,
      });
      alert('Response submitted successfully!');
      setRespondingTo(null);
      setResponse('');
      setAdjustedScore(null);
      fetchQueries();
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQueries = queries.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grade Queries</h1>
          <p className="text-gray-600">
            Review and respond to student grade queries
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 font-medium ${
                filter === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({queries.filter(q => q.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-6 py-3 font-medium ${
                filter === 'resolved'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resolved ({queries.filter(q => q.status === 'resolved').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-medium ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({queries.length})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Queries List */}
        {filteredQueries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {filter !== 'all' ? filter : ''} queries
            </h3>
            <p className="text-gray-600">
              {filter === 'pending'
                ? 'All queries have been resolved!'
                : `No ${filter} queries at this time.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQueries.map((query) => (
              <div
                key={query.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                {/* Query Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {query.student_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {query.exam_title} • {new Date(query.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {query.status === 'pending' ? (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolved
                    </span>
                  )}
                </div>

                {/* Question & Answer */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Question:</p>
                  <p className="text-gray-900 mb-3">{query.question_text}</p>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Student's Answer:</p>
                  <p className="text-gray-900">{query.answer_text}</p>
                </div>

                {/* AI Score & Feedback */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">AI Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {query.ai_score}/{query.max_marks}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">AI Feedback</p>
                    <p className="text-sm text-gray-900">{query.ai_feedback}</p>
                  </div>
                </div>

                {/* Student Query */}
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Student's Query:</p>
                  <p className="text-gray-900">{query.query_reason}</p>
                </div>

                {/* Response Section */}
                {query.status === 'pending' && respondingTo !== query.id ? (
                  <button
                    onClick={() => {
                      setRespondingTo(query.id);
                      setAdjustedScore(query.ai_score);
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Respond to Query
                  </button>
                ) : query.status === 'pending' && respondingTo === query.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adjusted Score (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={query.max_marks}
                        value={adjustedScore || ''}
                        onChange={(e) => setAdjustedScore(parseFloat(e.target.value) || null)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder={`Current: ${query.ai_score}/${query.max_marks}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Response *
                      </label>
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32"
                        placeholder="Explain your decision..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setRespondingTo(null);
                          setResponse('');
                          setAdjustedScore(null);
                        }}
                        className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRespond(query.id)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Response'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Your Response:</p>
                    <p className="text-gray-900">{query.teacher_response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
