'use client';

import { useState, useEffect } from 'react';
import { apiService, handleApiError } from '@/services/api';
import { Star, TrendingUp, TrendingDown, Award } from 'lucide-react';

interface TeacherRating {
  id: number;
  full_name: string;
  subject: string;
  department: string;
  average_rating: number;
  total_reviews: number;
}

interface RatingDetail {
  id: number;
  rating: number;
  review_text: string;
  student_name: string;
  created_at: string;
}

interface RatingStats {
  average_rating: string | number;
  total_reviews: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export default function AdminTeacherRatingsPage() {
  const [teachers, setTeachers] = useState<TeacherRating[]>([]);
  const [topRated, setTopRated] = useState<TeacherRating[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [ratings, setRatings] = useState<RatingDetail[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
    fetchTopRated();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await apiService.teachers.getAll();
      const teachersData = response.data.data;
      
      // Fetch ratings for each teacher
      const teachersWithRatings = await Promise.all(
        teachersData.map(async (teacher: any) => {
          try {
            const avgResponse = await apiService.ratings.getAverage(teacher.id);
            return {
              id: teacher.id,
              full_name: teacher.full_name,
              subject: teacher.subject,
              department: teacher.department,
              average_rating: parseFloat(avgResponse.data.data.average_rating) || 0,
              total_reviews: avgResponse.data.data.total_reviews || 0,
            };
          } catch {
            return {
              id: teacher.id,
              full_name: teacher.full_name,
              subject: teacher.subject,
              department: teacher.department,
              average_rating: 0,
              total_reviews: 0,
            };
          }
        })
      );
      
      setTeachers(teachersWithRatings.sort((a, b) => b.average_rating - a.average_rating));
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRated = async () => {
    try {
      const response = await apiService.ratings.getTopRated();
      setTopRated(response.data.data);
    } catch (err) {
      console.error('Failed to fetch top rated:', err);
    }
  };

  const fetchTeacherRatings = async (teacherId: number) => {
    try {
      const [ratingsRes, statsRes] = await Promise.all([
        apiService.ratings.getByTeacher(teacherId),
        apiService.ratings.getAverage(teacherId),
      ]);
      setRatings(ratingsRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const StarDisplay = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating: string | number) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (numRating >= 4.5) return 'text-green-600';
    if (numRating >= 3.5) return 'text-blue-600';
    if (numRating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ratings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Ratings</h1>
          <p className="text-gray-600">
            Monitor and analyze teacher performance ratings
          </p>
        </div>

        {/* Top Rated Teachers */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="h-6 w-6 text-yellow-500 mr-2" />
            Top Rated Teachers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topRated.slice(0, 3).map((teacher, index) => (
              <div
                key={teacher.id}
                className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-yellow-600">#{index + 1}</span>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getRatingColor(teacher.average_rating)}`}>
                      {teacher.average_rating.toFixed(1)}
                    </p>
                    <StarDisplay rating={Math.round(teacher.average_rating)} />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{teacher.full_name}</h3>
                <p className="text-sm text-gray-600">{teacher.subject}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {teacher.total_reviews} reviews
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* All Teachers */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Teachers</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{teacher.full_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {teacher.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {teacher.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${getRatingColor(teacher.average_rating)}`}>
                          {teacher.average_rating > 0 ? teacher.average_rating.toFixed(1) : 'N/A'}
                        </span>
                        {teacher.average_rating > 0 && (
                          <StarDisplay rating={Math.round(teacher.average_rating)} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {teacher.total_reviews}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {teacher.total_reviews === 0 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          No ratings
                        </span>
                      ) : teacher.average_rating >= 4.0 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center w-fit">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Excellent
                        </span>
                      ) : teacher.average_rating >= 3.0 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Good
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center w-fit">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Needs Attention
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher.id);
                          fetchTeacherRatings(teacher.id);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        disabled={teacher.total_reviews === 0}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rating Details Modal */}
      {selectedTeacher && stats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Rating Details</h3>
                <button
                  onClick={() => {
                    setSelectedTeacher(null);
                    setRatings([]);
                    setStats(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Average Rating</p>
                  <p className={`text-4xl font-bold ${getRatingColor(stats.average_rating)}`}>
                    {(typeof stats.average_rating === 'string' ? parseFloat(stats.average_rating) : stats.average_rating).toFixed(1)}
                  </p>
                  <StarDisplay rating={Math.round(typeof stats.average_rating === 'string' ? parseFloat(stats.average_rating) : stats.average_rating)} />
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Total Reviews</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {stats.total_reviews}
                  </p>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h4>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats[`${['one', 'two', 'three', 'four', 'five'][star - 1]}_star` as keyof RatingStats] as number;
                  const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center mb-2">
                      <span className="text-sm text-gray-600 w-12">{star} star</span>
                      <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Individual Reviews */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Individual Reviews</h4>
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">
                            {rating.student_name}
                          </span>
                          <StarDisplay rating={rating.rating} />
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.review_text && (
                        <p className="text-gray-700 text-sm">{rating.review_text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
