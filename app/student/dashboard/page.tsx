'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { BookOpen, AlertCircle, CheckCircle, Clock, TrendingUp, Download, FileText, Share2, BarChart3, Target } from 'lucide-react';
import Link from 'next/link';
import { mockPendingEvaluations, mockCourses, mockEvaluationPeriod, mockEvaluationResponses } from '@/data/mock';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EvaluationProgress {
  week: string;
  completed: number;
  pending: number;
}

const evaluationProgressData: EvaluationProgress[] = [
  { week: 'Week 1', completed: 2, pending: 5 },
  { week: 'Week 2', completed: 4, pending: 3 },
  { week: 'Week 3', completed: 6, pending: 1 },
  { week: 'Week 4', completed: 7, pending: 0 },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function StudentDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const downloadEvaluationReport = () => {
    try {
      const data = {
        student: user?.name,
        generatedAt: new Date().toISOString(),
        summary: {
          totalCourses: mockCourses.length,
          completedEvaluations: mockCourses.length - mockPendingEvaluations.length,
          pendingEvaluations: mockPendingEvaluations.length,
          completionPercentage: mockEvaluationPeriod?.completionPercentage || 0,
        },
        courses: mockCourses.map(c => ({
          code: c.code,
          name: c.name,
          instructor: c.instructor?.name,
          status: mockPendingEvaluations.some(p => p.courseId === c.id) ? 'Pending' : 'Completed',
        })),
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evaluation-status-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Evaluation report downloaded successfully!');
    } catch (e) {
      alert('Failed to download report');
    }
  };

  const handleStartEvaluation = () => {
    router.push('/student/evaluations');
  };

  const handleViewResults = () => {
    router.push('/student/history');
  };

  if (isLoading) return <DashboardSkeleton />;

  const pendingCount = mockPendingEvaluations.length;
  const completedCount = mockCourses.length - pendingCount;
  const completionRate = mockEvaluationPeriod?.completionPercentage ?? 0;
  const enrolledCount = mockCourses.length;
  const deadline = mockEvaluationPeriod?.endDate ? new Date(mockEvaluationPeriod.endDate) : null;
  const daysUntilDeadline = deadline ? Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's your evaluation progress and important information
          </p>
        </div>
        <Button variant="outline" onClick={downloadEvaluationReport} className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Completed"
          value={<AnimatedCounter endValue={completedCount} />}
          footer={`${completedCount} of ${enrolledCount} courses`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          trend={completedCount}
        />
        <DashboardCard
          title="Pending"
          value={<AnimatedCounter endValue={pendingCount} />}
          footer={`${pendingCount} courses remaining`}
          icon={<AlertCircle className="w-6 h-6" />}
          color="red"
          trend={-pendingCount}
        />
        <DashboardCard
          title="Completion Rate"
          value={<AnimatedCounter endValue={completionRate} suffix="%" />}
          footer={`Progress: ${completionRate}%`}
          icon={<BarChart3 className="w-6 h-6" />}
          color="blue"
          trend={completionRate}
        />
        <DashboardCard
          title="Enrolled Courses"
          value={<AnimatedCounter endValue={enrolledCount} />}
          footer="Current semester"
          icon={<BookOpen className="w-6 h-6" />}
          color="purple"
        />
        <DashboardCard
          title="Days Left"
          value={<AnimatedCounter endValue={daysUntilDeadline} />}
          footer={deadline ? `Deadline: ${deadline.toLocaleDateString()}` : 'No deadline'}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
          trend={-daysUntilDeadline}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Evaluations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Evaluation Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Evaluation Progress</CardTitle>
              <CardDescription>Your completion progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={evaluationProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" />
                  <Bar dataKey="pending" fill="#EF4444" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pending Evaluations */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Pending Evaluations</CardTitle>
              <CardDescription>Complete these evaluations before the deadline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPendingEvaluations.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">All Complete! 🎉</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">You've completed all evaluations for this period.</p>
                </div>
              ) : (
                mockPendingEvaluations.map((evaluation) => {
                  const course = mockCourses.find(c => c.id === evaluation.courseId);
                  return (
                    <div
                      key={evaluation.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {course?.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course?.code} • {course?.instructor?.name}
                        </p>
                      </div>
                      <Link href={`/student/evaluations?courseId=${course?.id}&evalId=${evaluation.id}`}>
                        <Button variant="primary" size="sm">
                          Evaluate Now
                        </Button>
                      </Link>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Current Courses */}
          <Card>
            <CardHeader>
              <CardTitle>📚 Your Courses</CardTitle>
              <CardDescription>All enrolled courses this semester</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockCourses.map((course) => {
                const isCompleted = !mockPendingEvaluations.some(p => p.courseId === course.id);
                return (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{course.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{course.instructor?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{course.code}</Badge>
                      {isCompleted ? (
                        <Badge variant="success">✓ Done</Badge>
                      ) : (
                        <Badge variant="warning">⏳ Pending</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Items */}
        <div className="space-y-6">
          {/* Course Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: completedCount },
                      { name: 'Pending', value: pendingCount },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {[COLORS[0], COLORS[2]].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>✨ Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingCount > 0 && (
                <Button 
                  variant="primary" 
                  className="w-full gap-2"
                  onClick={handleStartEvaluation}
                >
                  <Target className="w-4 h-4" />
                  Start Evaluation
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleViewResults}
              >
                <FileText className="w-4 h-4" />
                View History
              </Button>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle>📅 Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{daysUntilDeadline}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Days remaining</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Until evaluation deadline</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Deadline:</strong> {deadline ? deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No deadline'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">🔒 Your Privacy</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    All evaluations are anonymous and confidential
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
