'use client';

import { useState, useEffect } from 'react';
import { apiService, handleApiError } from '@/services/api';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface GradeQuery {
  id: number;
  student_answer_id: number;
  query_reason: string;
  teacher_response: string | null;
  status: 'pending' | 'resolved';
  created_at: string;
  resolved_at: string | null;
  question_text: string;
  answer_text: string;
  ai_score: number;
  teacher_score: number | null;
  max_marks: number;
  exam_title: string;
}

export default function StudentGradeQueriesPage() {
  const [queries, setQueries] = useState<GradeQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await apiService.gradeQueries.getByStudent(user.studentId);
      setQueries(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredQueries = queries.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'pending') {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Pending
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
        <CheckCircle className="h-4 w-4 mr-1" />
        Resolved
      </span>
    );
  };

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
            View and track your grade query submissions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-medium ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Queries ({queries.length})
            </button>
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
              No {filter !== 'all' ? filter : ''} queries found
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? "You haven't submitted any grade queries yet."
                : `You don't have any ${filter} queries.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQueries.map((query) => (
              <div
                key={query.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Query Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {query.exam_title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Submitted on {new Date(query.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(query.status)}
                </div>

                {/* Question */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Question:</p>
                  <p className="text-gray-900 mb-3">{query.question_text}</p>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Your Answer:</p>
                  <p className="text-gray-900">{query.answer_text}</p>
                </div>

                {/* Scores */}
                <div className="flex items-center space-x-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">AI Score</p>
                    <p className="text-xl font-bold text-gray-900">
                      {query.ai_score}/{query.max_marks}
                    </p>
                  </div>
                  {query.teacher_score !== null && (
                    <>
                      <div className="text-gray-400">→</div>
                      <div>
                        <p className="text-sm text-gray-600">Adjusted Score</p>
                        <p className="text-xl font-bold text-green-600">
                          {query.teacher_score}/{query.max_marks}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Query Reason */}
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Your Query:</p>
                  <p className="text-gray-900">{query.query_reason}</p>
                </div>

                {/* Teacher Response */}
                {query.teacher_response && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-600">Teacher Response:</p>
                      {query.resolved_at && (
                        <p className="text-xs text-gray-500">
                          Resolved on {new Date(query.resolved_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-900">{query.teacher_response}</p>
                  </div>
                )}

                {/* Pending Status */}
                {query.status === 'pending' && (
                  <div className="mt-4 flex items-center text-yellow-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p className="text-sm">Waiting for teacher review...</p>
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
