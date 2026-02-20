'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockAuditLogs } from '@/data/mock';
import { formatDateTime } from '@/utils/helpers';
import { Search, Download, Filter } from 'lucide-react';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'secondary';
      case 'submit':
        return 'success';
      case 'create':
        return 'warning';
      case 'delete':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Filter logs
  const filteredLogs = mockAuditLogs.filter(log => {
    const matchSearch = searchTerm === '' ||
      log.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchAction = filterAction === 'all' || log.actionType === filterAction;
    const matchUser = filterUser === 'all' || log.user?.id === filterUser;
    
    return matchSearch && matchAction && matchUser;
  });

  const exportLogs = () => {
    const data = filteredLogs.map(log => ({
      timestamp: formatDateTime(log.timestamp),
      user: log.user?.name,
      action: log.action,
      actionType: log.actionType,
      resourceType: log.resourceType,
      ipAddress: log.ipAddress,
    }));

    const headers = ['Timestamp', 'User', 'Action', 'Type', 'Resource', 'IP Address'];
    const csv = [
      headers.join(','),
      ...data.map(d => headers.map(h => `"${String((d as any)[h.toLowerCase().replace(/\s/g, '')] ?? '')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const uniqueUsers = [...new Set(mockAuditLogs.map(log => log.user?.id))].filter(Boolean);
  const uniqueActions = [...new Set(mockAuditLogs.map(log => log.actionType))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track all system activities and user actions
          </p>
        </div>
        <Button variant="primary" className="gap-2" onClick={exportLogs}>
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Activities</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockAuditLogs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Logins</p>
              <p className="text-3xl font-bold text-blue-600">
                {mockAuditLogs.filter(l => l.actionType === 'login').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Submissions</p>
              <p className="text-3xl font-bold text-green-600">
                {mockAuditLogs.filter(l => l.actionType === 'submit').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Deletions</p>
              <p className="text-3xl font-bold text-red-600">
                {mockAuditLogs.filter(l => l.actionType === 'delete').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>All system activities sorted by timestamp</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-2 flex-col md:flex-row md:items-center flex-wrap">
              <div className="flex-1 min-w-48 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by user or action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
              >
                <option value="all">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>
                    {String(action).toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredLogs.length} of {mockAuditLogs.length} activities
            </p>

            {/* Logs Table */}
            <DataTable
              columns={[
                {
                  key: 'timestamp' as any,
                  label: 'Timestamp',
                  render: (timestamp: any) => formatDateTime(timestamp),
                },
                {
                  key: 'user' as any,
                  label: 'User',
                  render: (_, data: any) => (
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.user?.name}
                    </span>
                  ),
                },
                {
                  key: 'action' as any,
                  label: 'Action',
                  render: (action: any) => (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {action}
                    </span>
                  ),
                },
                {
                  key: 'actionType' as any,
                  label: 'Type',
                  render: (type) => (
                    <Badge variant={getActionColor(String(type))}>
                      {String(type).toUpperCase()}
                    </Badge>
                  ),
                },
                {
                  key: 'resourceType' as any,
                  label: 'Resource',
                  render: (resource: any) => (
                    <Badge variant="outline">
                      {String(resource).toUpperCase()}
                    </Badge>
                  ),
                },
                {
                  key: 'ipAddress' as any,
                  label: 'IP Address',
                  render: (ip: any) => (
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                      {ip}
                    </span>
                  ),
                },
              ]}
              data={filteredLogs.map((log) => ({ ...log, id: log.id }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
