'use client';

import { useState } from 'react';
import { DashboardSkeleton } from '@/components/loading/Skeletons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFetch } from '@/hooks';
import { downloadPdf } from '@/utils/helpers';
import { Search, Filter, Download, Eye } from 'lucide-react';

export default function Evaluations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEval, setSelectedEval] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { data: evalData, loading: evalLoading } = useFetch<any>('/evaluations');

  if (evalLoading) return <DashboardSkeleton />;

  // use data from API
  const evals = evalData?.evaluations || [];
  const filteredEvals = evals.filter((evaluation: any) => {
    const evaluatorName = evaluation.evaluator?.name || `${evaluation.evaluator?.first_name || ''} ${evaluation.evaluator?.last_name || ''}`.trim();
    const evaluateeName = evaluation.evaluatee?.name || `${evaluation.evaluatee?.first_name || ''} ${evaluation.evaluatee?.last_name || ''}`.trim();
    const courseName = evaluation.course?.name || '';
    const matchSearch = searchTerm === '' || 
      evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluateeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchType = filterType === 'all' || evaluation.form?.type === filterType;
    const statusFlag = evaluation.isLocked || evaluation.status === 'locked';
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'locked' && statusFlag) ||
      (filterStatus === 'submitted' && !statusFlag);
    
    return matchSearch && matchType && matchStatus;
  });

  // Calculate statistics
  const stats = {
    total: evals.length,
    completed: evals.filter(e => e.isLocked || e.status === 'locked').length,
    pending: evals.filter(e => !(e.isLocked || e.status === 'locked')).length,
    averageScore: (evals.reduce((sum, e) => {
      const scores = e.responses?.map((r:any) => r.score || 0) || [];
      return sum + (scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0);
    }, 0) / (evals.length || 1)).toFixed(2),
  };

  // handler to toggle lock status of an evaluation
  const handleToggleLock = async (evalId: string, lock: boolean) => {
    try {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
      await fetch('/api/evaluations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({ id: evalId, status: lock ? 'locked' : 'submitted' }),
      });
      // refresh data by simple reload (could optimize)
      window.location.reload();
    } catch (err) {
      alert('Failed to update lock status');
    }
  };


  const handleExportData = () => {
    const data = filteredEvals.map(e => {
      const evaluatorName = e.evaluator?.name || `${e.evaluator?.first_name || ''} ${e.evaluator?.last_name || ''}`.trim();
      const evaluateeName = e.evaluatee?.name || `${e.evaluatee?.first_name || ''} ${e.evaluatee?.last_name || ''}`.trim();
      return {
        evaluator: evaluatorName,
        evaluatee: evaluateeName,
        course: e.course?.name,
        type: e.form?.type,
        status: e.isLocked || e.status === 'locked' ? 'Locked' : 'Submitted',
        averageScore: e.responses?.length ? (e.responses.reduce((sum: number, r: any) => sum + (r.score || 0), 0) / e.responses.length).toFixed(2) : 'N/A',
      };
    });

    const headers = ['Evaluator', 'Evaluatee', 'Course', 'Type', 'Status', 'Average Score'];
    const csv = [
      headers.join(','),
      ...data.map(d => headers.map(h => `"${String((d as any)[h.toLowerCase().replace(/\s/g, '')] ?? '')}"`).join(',')),
    ].join('\n');

    downloadPdf(csv, `evaluations-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Evaluations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor all evaluations in the system with detailed analytics
          </p>
        </div>
        <Button variant="primary" className="gap-2" onClick={handleExportData}>
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Evaluations</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Average Score</p>
              <p className="text-3xl font-bold text-blue-600">{stats.averageScore}/5.0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>Charts have been disabled. Use the table below for full details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The evaluations table below contains all evaluation data, including status and scores.
          </p>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Evaluation Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-2 flex-col md:flex-row md:items-end mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by evaluator, evaluatee, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <select
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="student-to-teacher">Student to Teacher</option>
                  <option value="peer-review">Peer Review</option>
                </select>
              </div>
              <div>
                <select
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="locked">Locked</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Showing {filteredEvals.length} of {evals.length} evaluations
            </p>

            {/* Evaluations Table */}
            <DataTable
              columns={[
                {
                  key: 'id' as any,
                  label: 'Evaluator',
                  render: (_, data: any) => data.evaluator?.name,
                },
                {
                  key: 'id' as any,
                  label: 'Evaluatee',
                  render: (_, data: any) => data.evaluatee?.name,
                },
                {
                  key: 'id' as any,
                  label: 'Course',
                  render: (_, data: any) => data.course?.name,
                },
                {
                  key: 'id' as any,
                  label: 'Type',
                  render: (_, data: any) => (
                    <Badge variant="secondary">
                      {String(data.form?.type).replace('-', ' ').toUpperCase()}
                    </Badge>
                  ),
                },
                {
                  key: 'id' as any,
                  label: 'Score',
                  render: (_, data: any) => {
                    const avg = data.responses?.length ? (data.responses.reduce((sum: number, r: any) => sum + (r.score || 0), 0) / data.responses.length).toFixed(2) : 'N/A';
                    return <span className="font-semibold">{avg}/5.0</span>;
                  },
                },
                {
                  key: 'id' as any,
                  label: 'Status',
                  render: (_, data: any) => (
                    <Badge variant={data.isLocked ? 'success' : 'warning'}>
                      {data.isLocked ? 'Locked' : 'Submitted'}
                    </Badge>
                  ),
                },
                {
                  key: 'id' as any,
                  label: 'Actions',
                  render: (_, data: any) => (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          setSelectedEval(data);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant={data.isLocked ? 'danger' : 'secondary'}
                        size="sm"
                        onClick={() => handleToggleLock(data.id, !data.isLocked)}
                      >
                        {data.isLocked ? 'Unlock' : 'Lock'}
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={filteredEvals}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetails && selectedEval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-96 overflow-auto">
            <CardHeader className="border-b flex flex-row justify-between items-center">
              <div>
                <CardTitle>Evaluation Details</CardTitle>
                <CardDescription>
                  {selectedEval.evaluator?.name} → {selectedEval.evaluatee?.name}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Course</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedEval.course?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {String(selectedEval.form?.type).replace('-', ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Criteria Scores:</p>
                {selectedEval.responses?.map((response: any, idx: number) => (
                  <div key={`${selectedEval.id}-response-${idx}`} className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded mb-2">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {response.comment || 'Criterion ' + (idx + 1)}
                    </span>
                    <span className="font-semibold text-blue-600">{response.score}/5.0</span>
                  </div>
                ))}
              </div>

              {selectedEval.overallComment && (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Comment:</p>
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {selectedEval.overallComment}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
