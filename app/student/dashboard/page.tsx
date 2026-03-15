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
import { BookOpen, AlertCircle, CheckCircle, Clock, Download, FileText, Share2, BarChart3, Target } from 'lucide-react';
import Link from 'next/link';
import { useFetch } from '@/hooks';
import { downloadPdf } from '@/utils/helpers';

export default function StudentDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations');
  const { data: coursesData, loading: coursesLoading } = useFetch<any>('/courses');
  const { data: periodData, loading: periodLoading } = useFetch<any>('/analytics');

  const isLoading = evalLoading || coursesLoading || periodLoading;

  // once data returns we can compute derived quantities


  const downloadEvaluationReport = () => {
    try {
      const courses = coursesData?.courses || [];
      const pending = evalData?.evaluations?.filter((e:any)=>e.status==='pending') || [];

      const rows = courses.map(c => ({
        code: c.course_code || c.code,
        name: c.course_name || c.name,
        instructor: c.teacher_name || c.instructor?.name || '',
        status: pending.some((p:any)=>p.course_id === c.id || p.courseId === c.id) ? 'Pending' : 'Completed',
      }));
      const header = ['code','name','instructor','status'];
      const csv = [header.join(','), ...rows.map(r=>header.map(h=>`"${String((r as any)[h]||'')}"`).join(','))].join('\n');
      downloadPdf(csv, `evaluation-status-${new Date().toISOString().split('T')[0]}.pdf`);
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

  const pendingCount = evalData?.evaluations?.filter((e:any)=>e.status!=='submitted' && e.status!=='locked').length || 0;
  const enrolledCount = coursesData?.courses?.length || 0;
  const completedCount = enrolledCount - pendingCount;
  const completionRate = enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0;
  const deadline = periodData?.endDate ? new Date(periodData.endDate) : null;
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
          color="blue"
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
          {/* Pending Evaluations */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Pending Evaluations</CardTitle>
              <CardDescription>Complete these evaluations before the deadline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {enrolledCount === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto text-yellow-600 mb-4" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">No Courses Assigned</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">You don’t have any enrolled courses yet.</p>
                </div>
              ) : !evalData?.evaluations?.length ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">No Evaluations Available</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">There are no active evaluations assigned to you at the moment.</p>
                </div>
              ) : pendingCount === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">All Complete! 🎉</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">You've completed all evaluations for this period.</p>
                </div>
              ) : (
                evalData?.evaluations?.filter((e:any)=>e.status!=='submitted' && e.status!=='locked').map((evaluation:any) => {
                  const course = (coursesData?.courses || []).find((c:any) => c.id === evaluation.course_id || c.id === evaluation.courseId);
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
                          {course?.code} • {course?.instructor_name || course?.instructor?.name}
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
              {(coursesData?.courses || []).map((course:any) => {
                const evaluation = evalData?.evaluations?.find((e:any)=>e.course_id===course.id || e.courseId===course.id);
                const isCompleted = evaluation?.status === 'submitted' || evaluation?.status === 'locked';
                return (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{course.course_name || course.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{course.instructor_name || course.instructor?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{course.course_code || course.code}</Badge>
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
            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-semibold text-green-600">{completedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-semibold text-yellow-600">{pendingCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Rate</span>
                <span className="font-semibold text-blue-600">{completionRate}%</span>
              </div>
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
