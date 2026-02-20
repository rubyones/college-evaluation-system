'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChartCard } from '@/components/ChartCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { Users, TrendingUp, AlertCircle, Award, Download, Eye, FileText, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockTeacherPerformanceTrend, mockCriteriaBreakdown, mockCourses, mockEvaluationResponses } from '@/data/mock';
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
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackItems, setFeedbackItems] = useState<StudentFeedback[]>([
    { id: '1', comment: 'Your lectures are really engaging!', rating: 5, date: new Date('2024-10-15') },
    { id: '2', comment: 'More examples would help', rating: 4, date: new Date('2024-10-14') },
    { id: '3', comment: 'Great teaching methodology', rating: 5, date: new Date('2024-10-13') },
  ]);

  // Derived stats
  const teacherId = user?.id || 'user-teacher-1';
  const assignedCourses = mockCourses.filter((c) => c.instructorId === teacherId);
  const assignedCount = assignedCourses.length;
  const teachingLoad = mockEvaluationResponses.filter((r) => assignedCourses.some((c) => c.id === r.courseId)).length * 20 || 120;
  const evaluationAvg = Math.round((mockEvaluationResponses.filter((r) => r.evaluateeId === teacherId).reduce((s, r) => s + (r.responses?.reduce((a, b) => a + (b.score || 0), 0) || 0), 0) || 0) / (mockEvaluationResponses.length || 1) * 10) / 10;
  const peerCompleted = 2;
  const studentFeedbackAvg = feedbackItems.reduce((s, f) => s + f.rating, 0) / feedbackItems.length;

  // Download functions
  const downloadCSV = () => {
    try {
      const rows = mockEvaluationResponses.filter(r => r.evaluateeId === teacherId).map(r => ({
        id: r.id,
        course: r.course?.code || r.courseId,
        evaluator: r.evaluator?.name || r.evaluatorId,
        overallComment: r.overallComment || '',
        submittedAt: r.submittedAt ? new Date(r.submittedAt).toISOString() : '',
      }));

      const header = Object.keys(rows[0] || { id: '', course: '', evaluator: '', overallComment: '', submittedAt: '' });
      const csv = [header.join(','), ...rows.map(r => header.map(h => `"${String((r as any)[h] ?? '')}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teacher-evaluations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('CSV downloaded successfully!');
    } catch (e) {
      console.error('Failed to generate CSV', e);
      alert('Failed to generate CSV');
    }
  };

  const downloadJSON = () => {
    try {
      const data = {
        teacher: user?.name,
        generatedAt: new Date().toISOString(),
        summary: {
          assignedCourses: assignedCount,
          teachingLoad,
          evaluationAverage: evaluationAvg,
          peerEvaluations: peerCompleted,
          studentFeedbackAverage: studentFeedbackAvg.toFixed(1),
        },
        evaluations: mockEvaluationResponses.filter(r => r.evaluateeId === teacherId),
        studentFeedback: feedbackItems.map(f => ({
          id: f.id,
          comment: f.comment,
          date: f.date,
        })),
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teacher-dashboard-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('JSON downloaded successfully!');
    } catch (e) {
      console.error('Failed to generate JSON', e);
      alert('Failed to generate JSON');
    }
  };

  const downloadPDF = () => {
    alert('PDF generation requires backend integration. Downloading as alternative format...');
    downloadJSON();
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  const studentSatisfactionData = [
    { name: 'Very Satisfied', value: 60 },
    { name: 'Satisfied', value: 25 },
    { name: 'Neutral', value: 10 },
    { name: 'Unsatisfied', value: 5 },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

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
          <Button variant="outline" size="sm" className="gap-2" onClick={downloadCSV}>
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={downloadJSON}>
            <Download className="w-4 h-4" />
            JSON
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={downloadPDF}>
            <FileText className="w-4 h-4" />
            Report
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
          value={<AnimatedCounter endValue={peerCompleted} suffix="/3" />}
          footer="Completed"
          icon={<Award className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="primary" 
                className="w-full justify-start gap-2"
                onClick={() => router.push('/teacher/results')}
              >
                <Eye className="w-4 h-4" />
                View Results
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push('/teacher/classes')}
              >
                <Users className="w-4 h-4" />
                My Classes
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push('/teacher/peer')}
              >
                <Users className="w-4 h-4" />
                Peer Evaluation
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => router.push('/teacher/ai-coach')}
              >
                <TrendingUp className="w-4 h-4" />
                AI Suggestions
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Feedback Request
              </Button>
            </CardContent>
          </Card>

          {/* Key Strengths */}
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CardHeader>
              <CardTitle className="text-base">💪 Key Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Excellent Content Knowledge</p>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">4.9/5.0</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Student Engagement</p>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">4.7/5.0</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Communication Skills</p>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">4.4/5.0</p>
              </div>
            </CardContent>
          </Card>

          {/* Areas to Improve */}
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Development Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-gray-700 dark:text-gray-300">
                ✓ Add more interactive activities in lectures
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                ✓ Provide detailed feedback on assignments
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                ✓ Increase office hour availability
              </p>
              <Link href="/teacher/ai-coach">
                <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Get AI Recommendations
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Center Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Charts */}
          <ChartCard
            title="Performance Trend"
            description="Your evaluation scores over the past 5 periods"
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={mockTeacherPerformanceTrend}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[3, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ fill: '#2563EB' }}
                  name="Your Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Criteria Breakdown */}
          <ChartCard
            title="Evaluation Criteria Breakdown"
            description="Average scores by evaluation criteria"
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockCriteriaBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="criteriaName" />
                <YAxis domain={[3, 5]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* This Semester's Classes */}
          <Card>
            <CardHeader>
              <CardTitle>📚 This Semester's Classes</CardTitle>
              <CardDescription>Your assigned courses for BSIT 2024-2025 Semester 1</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignedCourses.length > 0 ? assignedCourses.slice(0, 3).map((course, idx) => (
                <button
                  key={course.id}
                  onClick={() => router.push('/teacher/classes')}
                  className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{course.code} - {course.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.section} • {course.credits} credits • ~35 students
                      </p>
                    </div>
                    <Badge variant="secondary">{course.section}</Badge>
                  </div>
                </button>
              )) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">No courses assigned</p>
              )}
              {assignedCourses.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => router.push('/teacher/classes')}
                >
                  View All Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Student Satisfaction */}
          <ChartCard
            title="Student Satisfaction"
            description="Overall student satisfaction distribution"
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={studentSatisfactionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studentSatisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Student Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Student Feedback
          </CardTitle>
          <CardDescription>Anonymous feedback from your students - student identities are hidden for privacy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {feedbackItems.length > 0 ? feedbackItems.map((item, idx) => (
            <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-600 dark:text-gray-300">Anonymous Student #{idx + 1}</h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.comment}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.date.toLocaleDateString()}</p>
            </div>
          )) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">No feedback yet</p>
          )}
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => setFeedbackItems([...feedbackItems, {
              id: `new-${Date.now()}`,
              studentName: 'New Feedback',
              comment: 'Request student feedback...',
              rating: 5,
              date: new Date()
            }])}
          >
            <Mail className="w-4 h-4" />
            Request More Student Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
