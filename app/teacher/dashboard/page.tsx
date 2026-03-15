'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { Users, TrendingUp, AlertCircle, Award, Download, Eye, FileText, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { useFetch } from '@/hooks';
import { downloadPdf } from '@/utils/helpers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface StudentFeedback {
  id: string;
  comment: string;
  rating: number;
  date: Date;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [feedbackItems, setFeedbackItems] = useState<StudentFeedback[]>([]);

  const { data: coursesData, loading: coursesLoading } = useFetch<any>('/courses');
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations');
  const { data: analyticsData, loading: analyticsLoading } = useFetch<any>('/analytics');

  const teacherId = user?.id;

  const assignedCourses = coursesData?.courses?.filter((c:any) => c.teacher_id === teacherId) || [];
  const assignedCount = assignedCourses.length;

  const teacherEvals = evalData?.evaluations?.filter((e:any) => e.evaluatee_id === teacherId) || [];
  const teachingLoad = teacherEvals.length * 20;
  const evaluationAvg = analyticsData?.analytics?.evaluationRate || 0;
  const peerCompleted = analyticsData?.analytics?.peerCompleted || 0;
  const deptAvg = analyticsData?.analytics?.departmentTrend?.slice(-1)[0]?.score || 0;
  const studentFeedbackAvg = feedbackItems.length ? feedbackItems.reduce((s, f) => s + f.rating, 0) / feedbackItems.length : 0;

  const isLoading = coursesLoading || evalLoading || analyticsLoading; // derive from fetch hooks

  // single export action producing a PDF file
  const exportReport = () => {
    try {
      const rows = teacherEvals.map((r:any) => ({
        id: r.id,
        course: r.course?.code || r.courseId,
        evaluator: r.evaluator?.name || r.evaluatorId,
        overallComment: r.overallComment || '',
        submittedAt: r.submittedAt ? new Date(r.submittedAt).toISOString() : '',
      }));
      const header = Object.keys(rows[0] || { id: '', course: '', evaluator: '', overallComment: '', submittedAt: '' });
      const csv = [header.join(','), ...rows.map(r => header.map(h => `"${String((r as any)[h] ?? '')}"`).join(','))].join('\n');
      downloadPdf(csv, `teacher-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error('Failed to generate report', e);
      alert('Failed to generate report');
    }
  };

  // computed loading flag
  if (isLoading) return <DashboardSkeleton />;

  // calculate student satisfaction based on received evaluations for this teacher
  const studentSatisfactionData = (() => {
    const counts = { very: 0, sat: 0, neutral: 0, unsat: 0 };
    teacherEvals.forEach((e:any) => {
      const score = Number(e.score ?? e.rating ?? 0);
      if (score >= 4.5) counts.very++;
      else if (score >= 3.5) counts.sat++;
      else if (score >= 2.5) counts.neutral++;
      else counts.unsat++;
    });
    const total = teacherEvals.length;
    if (!total) return [];
    const distribution = [
      { name: 'Very Satisfied', value: Math.round((counts.very / total) * 100) },
      { name: 'Satisfied', value: Math.round((counts.sat / total) * 100) },
      { name: 'Neutral', value: Math.round((counts.neutral / total) * 100) },
      { name: 'Unsatisfied', value: Math.round((counts.unsat / total) * 100) },
    ];
    // adjust rounding error to ensure total 100
    const sum = distribution.reduce((a, v) => a + v.value, 0);
    const diff = 100 - sum;
    if (distribution.length && diff !== 0) {
      distribution[distribution.length - 1].value += diff;
    }
    return distribution;
  })();
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            ✨ Teaching Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.name || 'Teacher'}! Here's your performance overview
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="outline" size="sm" className="gap-2" onClick={exportReport}>
            <FileText className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Courses Teaching"
          value={<AnimatedCounter endValue={assignedCount} />}
          footer="This semester"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <DashboardCard
          title="Total Students"
          value={<AnimatedCounter endValue={teachingLoad} />}
          footer="Estimated enrollees"
          icon={<Users className="w-6 h-6" />}
          color="green"
          trend={8}
        />
        <DashboardCard
          title="Overall Rating"
          value={
            <span>
              <AnimatedCounter endValue={Number.isFinite(evaluationAvg) ? evaluationAvg : 0} decimals={1} suffix="/5" />
            </span>
          }
          footer="Based on evaluations"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={5}
        />
        <DashboardCard
          title="Student Feedback"
          value={<AnimatedCounter endValue={Math.round(studentFeedbackAvg * 10) / 10} decimals={1} suffix="/5" />}
          footer="Latest feedback"
          icon={<MessageSquare className="w-6 h-6" />}
          color="yellow"
        />
        <DashboardCard
          title="Peer Reviews"
          value={<AnimatedCounter endValue={peerCompleted} />}
          footer="Completed"
          icon={<Award className="w-6 h-6" />}
          color="red"
        />
        <DashboardCard
          title="Dept Avg Score"
          value={<AnimatedCounter endValue={deptAvg} decimals={1} suffix="/5" />}
          footer="Latest month"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
        />
      </div>
    </div>
  );
}
