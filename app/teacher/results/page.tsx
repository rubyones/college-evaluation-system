'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DashboardCard } from '@/components/DashboardCard';
import { ChartCard } from '@/components/ChartCard';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { TrendingUp, Download, FileText, Share2, Printer } from 'lucide-react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { mockCriteriaBreakdown, mockTeacherPerformanceTrend } from '@/data/mock';

const sentimentData = [
  { name: 'Positive', value: 65, fill: '#10B981' },
  { name: 'Neutral', value: 25, fill: '#F59E0B' },
  { name: 'Negative', value: 10, fill: '#EF4444' },
];

export default function TeacherResults() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const courseResults = [
    { id: 1, code: 'IT101', name: 'Intro to Computing', section: 'A', responses: 45, avgScore: 4.8, status: 'Completed' },
    { id: 2, code: 'IT303', name: 'Web Development', section: 'B', responses: 38, avgScore: 4.6, status: 'Completed' },
    { id: 3, code: 'IT201', name: 'Database Management', section: 'A', responses: 37, avgScore: 4.7, status: 'Completed' },
  ];

  const downloadPDF = () => {
    alert('PDF generation requires backend. Downloading as alternative format...');
    downloadJSON();
  };

  const downloadCSV = () => {
    try {
      const data = courseResults.map(c => ({
        'Course Code': c.code,
        'Course Name': c.name,
        'Section': c.section,
        'Responses': c.responses,
        'Average Score': c.avgScore,
        'Status': c.status,
      }));

      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(','),
        ...data.map(d => headers.map(h => `"${String((d as any)[h])}"` ).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teacher-results-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('CSV downloaded successfully!');
    } catch (e) {
      alert('Failed to download CSV');
    }
  };

  const downloadJSON = () => {
    try {
      const data = {
        generatedAt: new Date().toISOString(),
        summary: {
          overallRating: 46,
          completionRate: 89,
          departmentRank: 2,
          totalResponses: 120,
        },
        courseResults,
        sentimentAnalysis: sentimentData,
        criteriaBreakdown: mockCriteriaBreakdown,
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teacher-results-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('JSON downloaded successfully!');
    } catch (e) {
      alert('Failed to download JSON');
    }
  };

  const downloadExcel = () => {
    alert('Excel generation requires backend. Downloading as CSV instead...');
    downloadCSV();
  };

  const printResults = () => {
    window.print();
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Evaluation Results',
        text: 'Check out my evaluation results!',
        url: window.location.href,
      }).catch(() => {
        alert('Results copied to clipboard for sharing');
      });
    } else {
      alert('Results summary copied. Share the link with your department head.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Evaluation Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your comprehensive evaluation results and detailed analytics
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Button variant="outline" size="sm" className="gap-2" onClick={printResults}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={shareResults}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Overall Rating"
          value={
            <span>
              <AnimatedCounter endValue={46} decimals={1} suffix="/50" />
            </span>
          }
          footer="Based on 120 responses"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={4}
        />
        <DashboardCard
          title="Completion Rate"
          value={<AnimatedCounter endValue={89} suffix="%" />}
          footer="Students evaluated"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
          trend={2}
        />
        <DashboardCard
          title="Department Rank"
          value="#2"
          footer="Out of 15 instructors"
          icon={<TrendingUp className="w-6 h-6" />}
          color="yellow"
        />
        <DashboardCard
          title="Avg Course Score"
          value="4.7"
          footer="Across all courses"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={3}
        />
      </div>

      {/* Performance Trend Chart */}
      <ChartCard
        title="Performance Over Time"
        description="Your evaluation scores across multiple periods"
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
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
              name="Your Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Criteria Scores */}
        <ChartCard
          title="Criteria Performance"
          description="Your average score by evaluation criteria"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockCriteriaBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="criteriaName" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="score" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sentiment Distribution */}
        <ChartCard
          title="Feedback Sentiment"
          description="Distribution of positive, neutral, and negative comments"
        >
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Detailed Results by Course */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Results by Course</CardTitle>
          <CardDescription>Detailed breakdown of evaluation results for each course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courseResults.map((course) => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{course.code} - {course.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Section {course.section} • {course.responses} responses
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{course.avgScore}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">/5.0</p>
                  </div>
                  <Badge variant="success" className="ml-4">{course.status}</Badge>
                </div>
                {selectedCourse === course.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <p><strong>Course Code:</strong> {course.code}</p>
                    <p><strong>Student Responses:</strong> {course.responses}</p>
                    <p><strong>Average Score:</strong> {course.avgScore}/5.0</p>
                    <p><strong>Completion Status:</strong> {course.status}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Detailed Report
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export & Download Results
          </CardTitle>
          <CardDescription>Download your evaluation results in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="gap-2 justify-start"
              onClick={downloadCSV}
            >
              <FileText className="w-4 h-4" />
              Download CSV
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 justify-start"
              onClick={downloadJSON}
            >
              <FileText className="w-4 h-4" />
              Download JSON
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 justify-start"
              onClick={downloadExcel}
            >
              <FileText className="w-4 h-4" />
              Download Excel
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 justify-start"
              onClick={downloadPDF}
            >
              <FileText className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-base">💡 Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            ✓ Your overall rating of 4.6/5.0 is above the department average of 4.2
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            ✓ Students particularly value your course organization and content knowledge
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            ✓ Consider increasing interactive activities based on student feedback
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            ✓ IT303 (Web Development) has the highest engagement score at 4.8/5.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
