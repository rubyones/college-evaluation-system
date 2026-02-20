"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { formatDate } from '@/utils/helpers';
import { Download, FileText, Search } from 'lucide-react';
import { mockEvaluationResponses } from '@/data/mock';

export default function StudentHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const [semester, setSemester] = useState('all');
  const [selectedEval, setSelectedEval] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const downloadEvaluationHistory = () => {
    try {
      if (!mockEvaluationResponses || mockEvaluationResponses.length === 0) {
        alert('No history to download');
        return;
      }

      const history = mockEvaluationResponses.map((r) => ({
        Course: r.course?.name || 'Unknown',
        'Course Code': r.course?.code || 'N/A',
        Instructor: r.evaluatee?.name || 'Unknown',
        'Submitted Date': r.submittedAt ? formatDate(new Date(r.submittedAt)) : 'N/A',
        Status: r.isLocked ? 'Locked' : 'Submitted',
        'Response Count': r.responses?.length || 0,
      }));

      const headers = Object.keys(history[0]);
      const csv = [
        headers.join(','),
        ...history.map((h) => headers.map((col) => `"${String((h as any)[col] ?? '')}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evaluation-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Evaluation history downloaded successfully!');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      alert('Failed to download history');
    }
  };

  const downloadEvaluationJSON = () => {
    try {
      const data = {
        generatedAt: new Date().toISOString(),
        totalEvaluations: mockEvaluationResponses.length,
        evaluations: mockEvaluationResponses.map((r) => ({
          courseCode: r.course?.code,
          courseName: r.course?.name,
          instructor: r.evaluatee?.name,
          submittedDate: r.submittedAt,
          status: r.isLocked ? 'Locked' : 'Submitted',
          responseCount: r.responses?.length,
          overallComment: r.overallComment,
        })),
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evaluation-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Evaluation history downloaded successfully!');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      alert('Failed to download history');
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  const semesters = [
    { value: 'all', label: 'All Semesters' },
    { value: '2024-1', label: 'Semester 1 2024' },
    { value: '2024-2', label: 'Semester 2 2024' },
    { value: '2023-1', label: 'Semester 1 2023' },
  ];

  const q = searchTerm.trim().toLowerCase();
  const filteredEvals = mockEvaluationResponses.filter((e) => {
    if (!q) return true;
    return (
      (e.course?.name || '').toLowerCase().includes(q) ||
      (e.course?.code || '').toLowerCase().includes(q) ||
      (e.evaluatee?.name || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📋 Evaluation History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View all your previously submitted evaluations</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadEvaluationHistory} className="gap-2" size="sm">
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={downloadEvaluationJSON} className="gap-2" size="sm">
            <FileText className="w-4 h-4" />
            JSON
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by course name, code, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {semesters.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Evaluations</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{filteredEvals.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Locked Evaluations</p>
            <p className="text-3xl font-bold text-green-600">{filteredEvals.filter((e) => e.isLocked).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Editable</p>
            <p className="text-3xl font-bold text-blue-600">{filteredEvals.filter((e) => !e.isLocked).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Evaluations</CardTitle>
          <CardDescription>All evaluations you have completed</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No evaluations found</p>
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  key: 'course',
                  label: 'Course',
                  render: (_: any, data: any) => (
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{data.course?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{data.course?.code}</p>
                    </div>
                  ),
                },
                {
                  key: 'evaluatee',
                  label: 'Instructor',
                  render: (_: any, data: any) => <span className="text-gray-700 dark:text-gray-300">{data.evaluatee?.name}</span>,
                },
                {
                  key: 'submittedAt',
                  label: 'Submitted',
                  render: (_: any, data: any) => <span className="text-gray-700 dark:text-gray-300">{data.submittedAt ? formatDate(new Date(data.submittedAt)) : 'N/A'}</span>,
                },
                {
                  key: 'isLocked',
                  label: 'Status',
                  render: (_: any, data: any) => <Badge variant={data.isLocked ? 'success' : 'warning'}>{data.isLocked ? '🔒 Locked' : '✏️ Editable'}</Badge>,
                },
                {
                  key: 'actions' as any,
                  label: 'Actions',
                  render: (_: any, data: any) => (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedEval(data.id)}>
                        View
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={filteredEvals.filter((e) => e.submittedAt)}
            />
          )}
        </CardContent>
      </Card>

      {selectedEval && (
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
          <CardHeader className="flex flex-row justify-between items-start">
            <CardTitle>Evaluation Summary</CardTitle>
            <button
              onClick={() => setSelectedEval(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
            >
              ✕
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockEvaluationResponses
              .filter((e) => e.id === selectedEval)
              .map((responseItem) => (
                <div key={responseItem.id} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Course</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{responseItem.course?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Instructor</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{responseItem.evaluatee?.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {responseItem.responses.map((resp, idx) => (
                      <div key={`${responseItem.id}-${resp.criteriaId}-${idx}`} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          {responseItem.form?.criteria.find((c) => c.id === resp.criteriaId)?.name}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{resp.score}/5</span>
                      </div>
                    ))}
                  </div>

                  {responseItem.overallComment && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Comments:</p>
                      <p className="text-gray-900 dark:text-white">{responseItem.overallComment}</p>
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
