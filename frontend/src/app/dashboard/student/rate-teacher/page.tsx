'use client';

import { useState, useEffect } from 'react';
import { apiService, handleApiError } from '@/services/api';
import { Star, Send, Eye, EyeOff } from 'lucide-react';

interface Teacher {
  id: number;
  full_name: string;
  subject: string;
  department: string;
  email: string;
}

interface Rating {
  id: number;
  teacher_id: number;
  rating: number;
  review_text: string;
  is_anonymous: boolean;
  created_at: string;
}

export default function RateTeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [myRatings, setMyRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await apiService.teachers.getAll();
      setTeachers(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedTeacher || rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await apiService.ratings.create({
        teacherId: selectedTeacher.id,
        rating,
        reviewText: reviewText.trim() || null,
        isAnonymous,
      });
      alert('Rating submitted successfully!');
      setSelectedTeacher(null);
      setRating(0);
      setReviewText('');
      setIsAnonymous(false);
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, readonly = false }: any) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            disabled={readonly}
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoverRating || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Teachers</h1>
          <p className="text-gray-600">
            Share your feedback to help improve teaching quality
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {teacher.full_name.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
                {teacher.full_name}
              </h3>
              <p className="text-sm text-gray-600 text-center mb-1">
                {teacher.subject}
              </p>
              <p className="text-xs text-gray-500 text-center mb-4">
                {teacher.department}
              </p>
              <button
                onClick={() => setSelectedTeacher(teacher)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
              >
                <Star className="h-4 w-4 mr-2" />
                Rate Teacher
              </button>
            </div>
          ))}
        </div>

        {teachers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No teachers available
            </h3>
            <p className="text-gray-600">
              There are no teachers to rate at this time.
            </p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Rate {selectedTeacher.full_name}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedTeacher.subject} • {selectedTeacher.department}
            </p>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Rating *
              </label>
              <div className="flex items-center space-x-4">
                <StarRating value={rating} onChange={setRating} />
                <span className="text-lg font-semibold text-gray-900">
                  {rating > 0 ? `${rating}/5` : 'Select'}
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review (Optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32"
                placeholder="Share your experience with this teacher..."
              />
            </div>

            {/* Anonymous Option */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  {isAnonymous ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Submit anonymously
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Submit with my name
                    </>
                  )}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                {isAnonymous
                  ? 'Your name will not be shown to anyone'
                  : 'Your name will be visible to administrators'}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedTeacher(null);
                  setRating(0);
                  setReviewText('');
                  setIsAnonymous(false);
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                disabled={submitting || rating === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
