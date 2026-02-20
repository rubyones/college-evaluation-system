'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Download, FileText, Trash2, Calendar } from 'lucide-react';
import { mockDepartmentPerformance, mockInstructorRankings, mockEvaluationResponses, mockCourses, mockCriteriaBreakdown } from '@/data/mock';
import { ChartCard } from '@/components/ChartCard';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const generateCSVReport = (filename: string, data: any[], headers: string[]) => {
  try {
    const csv = [
      headers.join(','),
      ...data.map(d => headers.map(h => `"${String((d as any)[h] ?? '')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Failed to generate report');
  }
};

const ReportsComponent = () => {
  const [generating, setGenerating] = useState<string | null>(null);
  const [reportHistory, setReportHistory] = useState([
    { id: '1', name: 'Department Report S1 2024', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: 'department' },
    { id: '2', name: 'Instructor Rankings S1 2024', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), type: 'instructor' },
    { id: '3', name: 'Course Evaluations S1', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), type: 'course' },
  ]);
  const [filterDate, setFilterDate] = useState('');

  const handleDepartmentReport = async () => {
    setGenerating('department');
    await new Promise(r => setTimeout(r, 500));
    generateCSVReport(
      `department-report-${new Date().toISOString().split('T')[0]}.csv`,
      mockDepartmentPerformance,
      ['period', 'score', 'completionRate']
    );
    addToHistory('Department Report ' + new Date().toLocaleDateString(), 'department');
    setGenerating(null);
  };

  const handleInstructorReport = async () => {
    setGenerating('instructor');
    await new Promise(r => setTimeout(r, 500));
    generateCSVReport(
      `instructor-report-${new Date().toISOString().split('T')[0]}.csv`,
      mockInstructorRankings.map(r => ({
        name: r.instructor?.name,
        overallScore: r.overallScore,
        yearsOfService: r.yearsOfService,
        department: r.department,
      })),
      ['name', 'overallScore', 'yearsOfService', 'department']
    );
    addToHistory('Instructor Report ' + new Date().toLocaleDateString(), 'instructor');
    setGenerating(null);
  };

  const handleCourseReport = async () => {
    setGenerating('course');
    await new Promise(r => setTimeout(r, 500));
    const courseData = mockCourses.map(c => ({
      code: c.code,
      name: c.name,
      section: c.section,
      credits: c.credits,
    }));
    generateCSVReport(
      `course-report-${new Date().toISOString().split('T')[0]}.csv`,
      courseData,
      ['code', 'name', 'section', 'credits']
    );
    addToHistory('Course Report ' + new Date().toLocaleDateString(), 'course');
    setGenerating(null);
  };

  const handleComplianceReport = async () => {
    setGenerating('compliance');
    await new Promise(r => setTimeout(r, 500));
    const complianceData = [
      { aspect: 'CHED Standards Compliance', compliance: 95 },
      { aspect: 'Data Privacy', compliance: 98 },
      { aspect: 'Evaluation Coverage', compliance: 87 },
      { aspect: 'Form Validation', compliance: 92 },
    ];
    generateCSVReport(
      `compliance-report-${new Date().toISOString().split('T')[0]}.csv`,
      complianceData,
      ['aspect', 'compliance']
    );
    addToHistory('Compliance Report ' + new Date().toLocaleDateString(), 'compliance');
    setGenerating(null);
  };

  const handleCriteriaAnalysis = async () => {
    setGenerating('criteria');
    await new Promise(r => setTimeout(r, 500));
    generateCSVReport(
      `criteria-analysis-${new Date().toISOString().split('T')[0]}.csv`,
      mockCriteriaBreakdown,
      ['criteriaName', 'score', 'percentage']
    );
    addToHistory('Criteria Analysis ' + new Date().toLocaleDateString(), 'criteria');
    setGenerating(null);
  };

  const addToHistory = (name: string, type: string) => {
    setReportHistory([
      { id: String(Date.now()), name, date: new Date(), type },
      ...reportHistory.slice(0, 9),
    ]);
  };

  const deleteReport = (id: string) => {
    setReportHistory(reportHistory.filter(r => r.id !== id));
  };

  const performanceData = mockDepartmentPerformance;
  const criteriaData = mockCriteriaBreakdown;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Generate comprehensive evaluation reports and analytics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Evaluations</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockEvaluationResponses.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Completion Rate</p>
              <p className="text-3xl font-bold text-green-600">87%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Avg Score</p>
              <p className="text-3xl font-bold text-blue-600">4.6/5.0</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Reports Generated</p>
              <p className="text-3xl font-bold text-purple-600">{reportHistory.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Performance Trend"
          description="Department evaluation scores over time"
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[4, 4.6]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Criteria Performance"
          description="Breakdown by evaluation criteria"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={criteriaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="criteriaName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Report</CardTitle>
              <CardDescription>Overall department performance summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Performance trends over time<br />
                • Top performing instructors<br />
                • Improvement areas<br />
                • Completion statistics
              </p>
              <Button variant="primary" className="w-full gap-2" onClick={handleDepartmentReport} disabled={generating === 'department'}>
                <Download className="w-4 h-4" />
                {generating === 'department' ? 'Generating...' : 'Generate & Download'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructor Report</CardTitle>
              <CardDescription>Individual teacher evaluation summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Individual ratings & rankings<br />
                • Strength areas<br />
                • Areas for improvement<br />
                • Year-over-year comparison
              </p>
              <Button variant="primary" className="w-full gap-2" onClick={handleInstructorReport} disabled={generating === 'instructor'}>
                <Download className="w-4 h-4" />
                {generating === 'instructor' ? 'Generating...' : 'Generate & Download'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Report</CardTitle>
              <CardDescription>Course-level evaluation analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Class feedback summary<br />
                • Enrollment data<br />
                • Engagement metrics<br />
                • Course-specific insights
              </p>
              <Button variant="primary" className="w-full gap-2" onClick={handleCourseReport} disabled={generating === 'course'}>
                <Download className="w-4 h-4" />
                {generating === 'course' ? 'Generating...' : 'Generate & Download'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Report</CardTitle>
              <CardDescription>CHED and regulatory compliance status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • CHED standards compliance<br />
                • Data privacy adherence<br />
                • Form validation status<br />
                • Audit readiness
              </p>
              <Button variant="primary" className="w-full gap-2" onClick={handleComplianceReport} disabled={generating === 'compliance'}>
                <Download className="w-4 h-4" />
                {generating === 'compliance' ? 'Generating...' : 'Generate & Download'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criteria Analysis</CardTitle>
              <CardDescription>Detailed evaluation criteria breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Criteria-wise scores<br />
                • Weight distribution<br />
                • Performance patterns<br />
                • Trend analysis
              </p>
              <Button variant="primary" className="w-full gap-2" onClick={handleCriteriaAnalysis} disabled={generating === 'criteria'}>
                <Download className="w-4 h-4" />
                {generating === 'criteria' ? 'Generating...' : 'Generate & Download'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Report</CardTitle>
              <CardDescription>Build your own custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                • Select date range<br />
                • Choose metrics<br />
                • Filter by department<br />
                • Export in multiple formats
              </p>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="w-4 h-4" />
                Open Report Builder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report History */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Report History</CardTitle>
          <CardDescription>Recently generated reports</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {reportHistory.map((report) => (
              <div key={report.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{report.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.date.toLocaleDateString()} {report.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {report.type}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReport(report.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsComponent;
