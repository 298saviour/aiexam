'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Activity,
  Users,
  FileText,
  Brain,
  TrendingUp,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LiveStats {
  totalUsers: number;
  totalExams: number;
  todayAnalytics: number;
  activeUsers: number;
  recentAILogs: any[];
  recentSystemLogs: any[];
  timestamp: Date;
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalExams: number;
    totalCourses: number;
    totalAILogs: number;
    totalSystemLogs: number;
    totalAnalyticsEvents: number;
  };
  recentActivity: {
    aiLogs: any[];
    systemLogs: any[];
  };
  breakdowns: {
    usersByRole: any[];
    examsByStatus: any[];
    aiGradingStats: any[];
    analyticsEventsByType: any[];
  };
  charts: {
    dailyAnalytics: any[];
  };
}

const COLORS = ['#1E40AF', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B'];

export default function AdminAnalyticsPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-logs' | 'system-logs' | 'analytics'>('overview');

  // Initialize WebSocket connection
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
      socketInstance.emit('join_admin');
    });

    socketInstance.on('live_stats_update', (stats: LiveStats) => {
      setLiveStats(stats);
    });

    socketInstance.on('ai_log_update', (log: any) => {
      console.log('New AI log:', log);
      // Could add toast notification here
    });

    socketInstance.on('system_log_update', (log: any) => {
      console.log('New system log:', log);
    });

    socketInstance.on('analytics_update', (event: any) => {
      console.log('New analytics event:', event);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/export/logs?format=${format}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${Date.now()}.${format}`;
      a.click();
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => handleExportLogs('csv')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Live Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-3xl font-bold">{liveStats?.totalUsers || analyticsData?.overview.totalUsers || 0}</div>
          <div className="text-blue-100 text-sm mt-1">Total Users</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 opacity-80" />
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-3xl font-bold">{liveStats?.totalExams || analyticsData?.overview.totalExams || 0}</div>
          <div className="text-purple-100 text-sm mt-1">Total Exams</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 opacity-80" />
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-3xl font-bold">{liveStats?.todayAnalytics || 0}</div>
          <div className="text-cyan-100 text-sm mt-1">Today's Activity</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 opacity-80" />
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-3xl font-bold">{analyticsData?.overview.totalAILogs || 0}</div>
          <div className="text-orange-100 text-sm mt-1">AI Operations</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Analytics Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData?.charts.dailyAnalytics || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#1E40AF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Role */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData?.breakdowns.usersByRole || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.role}: ${entry.count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(analyticsData?.breakdowns.usersByRole || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* AI Grading Stats */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Grading Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData?.breakdowns.aiGradingStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Analytics Events by Type */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData?.breakdowns.analyticsEventsByType || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="eventType" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent AI Logs */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Recent AI Activity
          </h3>
          <div className="space-y-3">
            {(liveStats?.recentAILogs || analyticsData?.recentActivity.aiLogs || []).slice(0, 5).map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.status === 'success' ? 'bg-green-500' : 
                  log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{log.eventType || 'AI Operation'}</div>
                  <div className="text-xs text-gray-600 mt-1">{log.details || 'Processing...'}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent System Logs */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Recent System Activity
          </h3>
          <div className="space-y-3">
            {(liveStats?.recentSystemLogs || analyticsData?.recentActivity.systemLogs || []).slice(0, 5).map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{log.action}</div>
                  <div className="text-xs text-gray-600 mt-1">{log.description}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{log.actorRole}</span>
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Connection Indicator */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${socket?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium text-gray-700">
          {socket?.connected ? 'Live Updates Active' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
}
