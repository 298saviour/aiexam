import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Service
export const apiService = {
  // Teachers
  teachers: {
    getAll: () => api.get('/teachers'),
    getById: (id: number) => api.get(`/teachers/${id}`),
    create: (data: any) => api.post('/teachers', data),
    update: (id: number, data: any) => api.put(`/teachers/${id}`, data),
    delete: (id: number) => api.delete(`/teachers/${id}`),
    getClasses: (id: number) => api.get(`/teachers/${id}/classes`),
  },

  // Students
  students: {
    getAll: () => api.get('/students'),
    getById: (id: number) => api.get(`/students/${id}`),
    create: (data: any) => api.post('/students', data),
    update: (id: number, data: any) => api.put(`/students/${id}`, data),
    delete: (id: number) => api.delete(`/students/${id}`),
    getPerformance: (id: number) => api.get(`/students/${id}/performance`),
  },

  // Classes
  classes: {
    getAll: () => api.get('/classes'),
    getById: (id: number) => api.get(`/classes/${id}`),
    create: (data: any) => api.post('/classes', data),
    update: (id: number, data: any) => api.put(`/classes/${id}`, data),
    delete: (id: number) => api.delete(`/classes/${id}`),
    getStudents: (id: number) => api.get(`/classes/${id}/students`),
  },

  // Exams
  exams: {
    getAll: (params?: any) => api.get('/exams', { params }),
    getById: (id: number) => api.get(`/exams/${id}`),
    create: (data: any) => api.post('/exams', data),
    update: (id: number, data: any) => api.put(`/exams/${id}`, data),
    delete: (id: number) => api.delete(`/exams/${id}`),
    submit: (id: number, answers: any) => api.post(`/exams/${id}/submit`, { answers }),
    getResults: (examId: number, studentId: number) => 
      api.get(`/exams/${examId}/results/${studentId}`),
  },

  // Questions
  questions: {
    getAll: (params?: any) => api.get('/questions', { params }),
    getById: (id: number) => api.get(`/questions/${id}`),
    create: (data: any) => api.post('/questions', data),
    update: (id: number, data: any) => api.put(`/questions/${id}`, data),
    delete: (id: number) => api.delete(`/questions/${id}`),
    getByCourse: (courseId: number) => api.get(`/questions/by-course/${courseId}`),
  },

  // Grade Queries
  gradeQueries: {
    create: (data: any) => api.post('/grade-queries', data),
    getAll: () => api.get('/grade-queries'),
    getByStudent: (studentId: number) => api.get(`/grade-queries/student/${studentId}`),
    respond: (id: number, data: any) => api.put(`/grade-queries/${id}/respond`, data),
  },

  // Messages
  messages: {
    getInbox: () => api.get('/messages/inbox'),
    getSent: () => api.get('/messages/sent'),
    send: (data: any) => api.post('/messages', data),
    getById: (id: number) => api.get(`/messages/${id}`),
    markAsRead: (id: number) => api.put(`/messages/${id}/read`),
    delete: (id: number) => api.delete(`/messages/${id}`),
    getThread: (id: number) => api.get(`/messages/thread/${id}`),
  },

  // Ratings
  ratings: {
    create: (data: any) => api.post('/ratings', data),
    getByTeacher: (teacherId: number) => api.get(`/ratings/teacher/${teacherId}`),
    getAverage: (teacherId: number) => api.get(`/ratings/average/${teacherId}`),
    getAll: () => api.get('/ratings'),
    getTopRated: () => api.get('/ratings/top-rated'),
  },

  // Attendance
  attendance: {
    mark: (data: any) => api.post('/attendance', data),
    getByStudent: (studentId: number, params?: any) => 
      api.get(`/attendance/student/${studentId}`, { params }),
    getByClass: (classId: number, date: string) => 
      api.get(`/attendance/class/${classId}`, { params: { date } }),
    getByDate: (date: string) => api.get(`/attendance/date/${date}`),
    getReport: (params?: any) => api.get('/attendance/report', { params }),
  },

  // Auth
  auth: {
    login: (email: string, password: string) => 
      api.post('/auth/login', { email, password }),
    register: (data: any) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    refresh: (refreshToken: string) => 
      api.post('/auth/refresh', { refreshToken }),
    me: () => api.get('/auth/me'),
  },
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.error || error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred';
  }
};

export default api;
