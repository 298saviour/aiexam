'use client';

import { BarChart3, TrendingUp, Users, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/dashboard/AdminSidebar';

export default function ReportsPage() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900">Reports & Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">135</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Exams</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">48</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Performance</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">85.2%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI Accuracy</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-1">94.5%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Performance by Class</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { class: 'SS3', avg: 87.5, color: 'bg-blue-500' },
                { class: 'SS2', avg: 82.3, color: 'bg-purple-500' },
                { class: 'SS1', avg: 79.8, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.class}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{item.class}</span>
                    <span className="text-sm">{item.avg}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.avg}%` }}></div>
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
