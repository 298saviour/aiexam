'use client';

import { Brain } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';

const logs = [
  { id: 1, action: 'Exam Graded', exam: 'Biology Final', student: 'John Doe', score: 88, time: '2 min ago' },
  { id: 2, action: 'Training Complete', course: 'Mathematics', accuracy: 94.5, time: '1 hour ago' },
];

export default function AILogsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900">AI Logs</h1>
        <Card>
          <CardHeader><CardTitle>Recent AI Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {log.exam && `${log.exam} - ${log.student}: ${log.score}%`}
                      {log.course && `${log.course} - Accuracy: ${log.accuracy}%`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
