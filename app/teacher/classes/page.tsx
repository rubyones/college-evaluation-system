'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { mockCourses } from '@/data/mock';
import { Download, Eye, FileText, Users, BookOpen, BarChart3, Search } from 'lucide-react';

interface ClassDetail {
  courseId: string;
  expanded: boolean;
}

export default function TeacherClasses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});

  const teacherCourses = mockCourses.filter(c => c.instructorId === 'user-teacher-1');

  const filteredCourses = teacherCourses.filter(c =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (courseId: string) => {
    setExpandedClasses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const downloadClassRoster = (course: any) => {
    try {
      const students = Array.from({ length: 5 }).map((_, idx) => ({
        'Student ID': `STU-${String(idx + 1).padStart(3, '0')}`,
        'Status': 'Active',
        'Evaluation Score': (Math.random() * 2 + 3).toFixed(2),
      }));

      const headers = Object.keys(students[0]);
      const csv = [
        headers.join(','),
        ...students.map(s => headers.map(h => `"${String((s as any)[h])}"` ).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.code}-roster-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Class roster downloaded successfully!');
    } catch (e) {
      alert('Failed to download roster');
    }
  };

  const downloadGradebook = (course: any) => {
    try {
      const data = {
        course: course.code,
        courseName: course.name,
        section: course.section,
        generatedAt: new Date().toISOString(),
        students: Array.from({ length: 5 }).map((_, idx) => ({
          studentId: `STU-${String(idx + 1).padStart(3, '0')}`,
          attendance: Math.floor(Math.random() * 30) + 70,
          participation: (Math.random() * 2 + 3).toFixed(2),
          quizzes: (Math.random() * 2 + 3).toFixed(2),
          midterm: (Math.random() * 2 + 3).toFixed(2),
          final: (Math.random() * 2 + 3).toFixed(2),
          finalGrade: (Math.random() * 2 + 3).toFixed(2),
        })),
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.code}-gradebook-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Gradebook downloaded successfully!');
    } catch (e) {
      alert('Failed to download gradebook');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📚 My Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all your assigned courses, manage classes, and track student performance
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by course code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <BookOpen className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{teacherCourses.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {teacherCourses.reduce((s, c) => s + 35, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Avg Performance</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">4.6/5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No courses found matching your search</p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition">
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                onClick={() => toggleExpand(course.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{course.code} - {course.name}</CardTitle>
                      <Badge variant="secondary">Section {course.section}</Badge>
                    </div>
                    <CardDescription className="mt-2">
                      {course.credits} credits • ~35 students • Fall 2024
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg Score</p>
                    <p className="text-2xl font-bold text-green-600">4.6</p>
                  </div>
                </div>
              </CardHeader>
              
              {expandedClasses[course.id] && (
                <CardContent className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Students</p>
                      <p className="text-xl font-bold text-blue-600">35</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Avg Score</p>
                      <p className="text-xl font-bold text-green-600">4.6/5</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Completion</p>
                      <p className="text-xl font-bold text-purple-600">89%</p>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Class Details</h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p><strong>Time:</strong> MWF 10:00 AM - 11:30 AM</p>
                      <p><strong>Room:</strong> Building A, Room 205</p>
                      <p><strong>Enrolled Students:</strong> 35 active, 0 inactive</p>
                      <p><strong>Evaluations Received:</strong> 28/35 (80%)</p>
                    </div>
                  </div>

                  {/* Student Roster Sample */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Student Enrollment Status</h4>
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={`${course.id}-student-${idx}`} className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Student #{idx + 1}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Enrollment confirmed</p>
                          </div>
                          <Badge variant="success">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => downloadClassRoster(course)}
                    >
                      <Download className="w-4 h-4" />
                      Download Roster
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                      onClick={() => downloadGradebook(course)}
                    >
                      <FileText className="w-4 h-4" />
                      Gradebook
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Attendance
                    </Button>
                    <Button variant="primary" size="sm">
                      View Evaluations
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Summary Table */}
      {filteredCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 All Courses Summary</CardTitle>
            <CardDescription>Quick overview of all your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                {
                  key: 'code' as any,
                  label: 'Course Code',
                  render: (code) => String(code),
                },
                {
                  key: 'name' as any,
                  label: 'Course Name',
                  render: (name) => String(name),
                },
                {
                  key: 'section' as any,
                  label: 'Section',
                  render: (section) => <Badge variant="secondary">{String(section)}</Badge>,
                },
                {
                  key: 'credits' as any,
                  label: 'Credits',
                  render: (credits) => String(credits),
                },
                {
                  key: 'id' as any,
                  label: 'Students',
                  render: () => '35',
                },
                {
                  key: 'id' as any,
                  label: 'Avg Score',
                  render: () => <span className="text-green-600 font-semibold">4.6/5</span>,
                },
                {
                  key: 'id' as any,
                  label: 'Completion',
                  render: () => <Badge variant="success">89%</Badge>,
                },
              ]}
              data={filteredCourses}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
