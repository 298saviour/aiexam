'use client';

import { useState, useEffect } from 'react';
import { apiService, handleApiError } from '@/services/api';
import { Calendar, Save, Users, CheckCircle } from 'lucide-react';

interface Class {
  id: number;
  name: string;
}

interface Student {
  student_id: number;
  student_name: string;
  student_id_number: string;
  status: 'present' | 'absent' | 'late' | 'unmarked';
}

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await apiService.teachers.getClasses(user.teacherId);
      setClasses(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await apiService.attendance.getByClass(
        parseInt(selectedClass),
        selectedDate
      );
      setStudents(response.data.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setStudents(students.map(s =>
      s.student_id === studentId ? { ...s, status } : s
    ));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      alert('Please select a class and date');
      return;
    }

    const attendanceRecords = students.map(s => ({
      studentId: s.student_id,
      status: s.status === 'unmarked' ? 'absent' : s.status,
    }));

    try {
      setSaving(true);
      await apiService.attendance.mark({
        classId: parseInt(selectedClass),
        date: selectedDate,
        attendanceRecords,
      });
      alert('Attendance saved successfully!');
    } catch (err) {
      alert(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const stats = {
    total: students.length,
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    unmarked: students.filter(s => s.status === 'unmarked').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
          <p className="text-gray-600">
            Record student attendance for your classes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class *
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSaveAttendance}
                disabled={!selectedClass || students.length === 0 || saving}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Statistics */}
        {students.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow-md p-4 text-center border-2 border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              <p className="text-sm text-gray-600">Present</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow-md p-4 text-center border-2 border-red-200">
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-md p-4 text-center border-2 border-yellow-200">
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              <p className="text-sm text-gray-600">Late</p>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-md p-4 text-center border-2 border-gray-200">
              <p className="text-2xl font-bold text-gray-600">{stats.unmarked}</p>
              <p className="text-sm text-gray-600">Unmarked</p>
            </div>
          </div>
        )}

        {/* Students List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : !selectedClass ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Select a Class
            </h3>
            <p className="text-gray-600">
              Choose a class to mark attendance
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-600">
              This class has no students enrolled
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student, index) => (
                    <tr key={student.student_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.student_id_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.student_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleStatusChange(student.student_id, 'present')}
                            className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors ${
                              student.status === 'present'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-green-300'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.student_id, 'absent')}
                            className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors ${
                              student.status === 'absent'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-red-300'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.student_id, 'late')}
                            className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-colors ${
                              student.status === 'late'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-yellow-300'
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
