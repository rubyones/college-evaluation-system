'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartCard } from '@/components/ChartCard';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { Users, BookOpen, BarChart3, AlertCircle, CheckCircle, Clock, Download, TrendingUp, Activity, Shield } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockDepartmentPerformance, mockInstructorRankings, mockAuditLogs, mockEvaluationResponses } from '@/data/mock';

export default function DeanDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const downloadDepartmentReport = () => {
    try {
      const data = mockDepartmentPerformance.map(d => ({
        period: d.period,
        score: d.score,
        completionRate: d.completionRate,
      }));
      const header = ['Period', 'Score', 'Completion Rate'];
      const csv = [header.join(','), ...data.map(d => [d.period, d.score, d.completionRate].join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `department-performance-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to generate report');
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  // Calculate additional stats
  const completedEvals = mockEvaluationResponses.filter(e => e.isLocked).length;
  const pendingEvals = mockEvaluationResponses.filter(e => !e.isLocked).length;
  const completionPercentage = Math.round((completedEvals / (completedEvals + pendingEvals)) * 100);

  const programData = [
    { name: 'BSIT', students: 120, completion: 72 },
    { name: 'BSCS', students: 85, completion: 68 },
    { name: 'BSEMC', students: 95, completion: 58 },
    { name: 'BSIS', students: 150, completion: 65 },
  ];

  const recentActivities = mockAuditLogs.slice(0, 5).map(log => ({
    user: log.user?.name,
    action: log.action,
    time: log.timestamp,
    type: log.actionType,
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            ✨ Command Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            College of Information Technology Evaluation System Overview
          </p>
        </div>
        <Button variant="primary" className="gap-2" onClick={downloadDepartmentReport}>
          <Download className="w-4 h-4" />
          Export Dashboard
        </Button>
      </div>

      {/* System Alerts */}
      <Alert variant="warning" title="Active Evaluation Period">
        Semester 1 2024-2025 evaluations are currently open. Deadline: October 15, 2024
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Students"
          value={<AnimatedCounter endValue={450} />}
          footer="Enrolled this semester"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <DashboardCard
          title="Total Teachers"
          value={<AnimatedCounter endValue={45} />}
          footer="Active instructors"
          icon={<Users className="w-6 h-6" />}
          color="blue"
          trend={3}
        />
        <DashboardCard
          title="Completion Rate"
          value={<AnimatedCounter endValue={completionPercentage} suffix="%" />}
          footer="Evaluations completed"
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          trend={8}
        />
        <DashboardCard
          title="Pending Actions"
          value={<AnimatedCounter endValue={pendingEvals} />}
          footer="Evaluations awaiting"
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
          trend={-2}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Performance */}
          <ChartCard
            title="Department Performance Trend"
            description="Average evaluation scores over time"
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={mockDepartmentPerformance}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[4, 4.6]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ fill: '#2563EB' }}
                  name="Score"
                />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                  name="Completion %"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Program Completion Rates */}
          <ChartCard
            title="Completion Rate by Program"
            description="Percentage of evaluations completed per program"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={programData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completion" fill="#10B981" name="Completion %" />
                <Bar dataKey="students" fill="#3B82F6" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Active Period Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Active Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Period</p>
                <p className="font-semibold text-gray-900 dark:text-white">Semester 1 2024-2025</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Deadline</p>
                <p className="font-semibold text-gray-900 dark:text-white">October 15, 2024</p>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Days Remaining</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  <AnimatedCounter endValue={5} />
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="primary" className="w-full" size="sm" onClick={() => router.push('/dean/forms')}>
                Manage Forms
              </Button>
              <Button variant="outline" className="w-full" size="sm" onClick={() => router.push('/dean/evaluations')}>
                View Evaluations
              </Button>
              <Button variant="outline" className="w-full" size="sm" onClick={() => router.push('/dean/reports')}>
                Generate Reports
              </Button>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">CHED Compliance</span>
                <Badge variant="success">95%</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Data Security</span>
                <Badge variant="success">99%</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Coverage</span>
                <Badge variant="success">87%</Badge>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Database: Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-gray-400">API: Operating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Services: Normal</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructor Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Performing Instructors
          </CardTitle>
          <CardDescription>Ranked by overall evaluation score this semester</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockInstructorRankings.map((instructor) => (
              <div key={instructor.rank} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full font-bold text-blue-600 dark:text-blue-300">
                    #{instructor.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{instructor.instructor?.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{instructor.yearsOfService} years service</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{instructor.overallScore}/5</p>
                  <Badge variant="success" className="text-xs">Excellent</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>Latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivities.map((activity, idx) => (
              <div key={`${activity.timestamp}-${activity.type}-${idx}`} className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition">
                <div className="mt-1">
                  {activity.type === 'login' && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                  {activity.type === 'submit' && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                  {activity.type === 'create' && <div className="w-2 h-2 bg-yellow-600 rounded-full" />}
                  {activity.type === 'delete' && <div className="w-2 h-2 bg-red-600 rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.user}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{activity.action}</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {activity.time instanceof Date ? activity.time.toLocaleTimeString() : 'Just now'}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/dean/audit')}>
            View All Activities
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
