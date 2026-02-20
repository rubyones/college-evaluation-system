'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Checkbox } from '@/components/ui/Checkbox';
import { mockCourses, mockUsers } from '@/data/mock';
import { Plus, Edit2, Trash2, Clock, CheckCircle } from 'lucide-react';

interface AcademicPeriod {
  id: string;
  academicYear: string;
  semester: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface EvalPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'closed';
  formId: string;
}

interface CourseAssignment {
  id: string;
  courseId: string;
  instructorId: string;
  sectionId: string;
  semester: string;
}

export default function AcademicManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'period' | 'eval' | 'course'>('period');
  const [activeYear, setActiveYear] = useState('2024-2025');
  const [activeSemester, setActiveSemester] = useState('1');

  // Academic Periods State
  const [periods, setPeriods] = useState<AcademicPeriod[]>([
    {
      id: 'period-1',
      academicYear: '2024-2025',
      semester: 1,
      startDate: '2024-08-15',
      endDate: '2024-12-15',
      isActive: true,
    },
    {
      id: 'period-2',
      academicYear: '2024-2025',
      semester: 2,
      startDate: '2025-01-08',
      endDate: '2025-05-15',
      isActive: false,
    },
  ]);

  // Evaluation Periods State
  const [evalPeriods, setEvalPeriods] = useState<EvalPeriod[]>([
    {
      id: 'eval-1',
      name: 'Midterm Evaluation S1',
      startDate: '2024-10-01',
      endDate: '2024-10-15',
      status: 'active',
      formId: 'form-1',
    },
    {
      id: 'eval-2',
      name: 'Final Evaluation S1',
      startDate: '2024-12-01',
      endDate: '2024-12-15',
      status: 'upcoming',
      formId: 'form-1',
    },
  ]);

  // Course Assignments State
  const [courseAssignments, setCourseAssignments] = useState<CourseAssignment[]>(
    mockCourses.map((course, index) => ({
      id: `assign-${index}`,
      courseId: course.id,
      instructorId: course.instructorId,
      sectionId: course.section,
      semester: course.semester,
    }))
  );

  // Form Data
  const [formData, setFormData] = useState<any>({});

  const openModal = (type: 'period' | 'eval' | 'course') => {
    setModalType(type);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleSavePeriod = () => {
    if (!formData.academicYear || !formData.startDate || !formData.endDate) {
      alert('Please fill in all fields');
      return;
    }

    const newPeriod: AcademicPeriod = {
      id: `period-${Date.now()}`,
      academicYear: formData.academicYear,
      semester: parseInt(formData.semester || '1'),
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive || false,
    };

    setPeriods([...periods, newPeriod]);
    alert('Academic period created!');
    setIsModalOpen(false);
  };

  const handleSaveEvalPeriod = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('Please fill in all fields');
      return;
    }

    const newEvalPeriod: EvalPeriod = {
      id: `eval-${Date.now()}`,
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'upcoming',
      formId: 'form-1',
    };

    setEvalPeriods([...evalPeriods, newEvalPeriod]);
    alert('Evaluation period created!');
    setIsModalOpen(false);
  };

  const handleActivatePeriod = (periodId: string) => {
    setPeriods(periods.map(p => ({
      ...p,
      isActive: p.id === periodId,
    })));
    alert('Academic period activated!');
  };

  const handleDeletePeriod = (periodId: string) => {
    if (confirm('Are you sure? This will affect all related evaluations.')) {
      setPeriods(periods.filter(p => p.id !== periodId));
      alert('Period deleted');
    }
  };

  const handleDeleteEvalPeriod = (evalId: string) => {
    if (confirm('Are you sure?')) {
      setEvalPeriods(evalPeriods.filter(e => e.id !== evalId));
      alert('Evaluation period deleted');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'upcoming':
        return <Badge variant="warning">Upcoming</Badge>;
      case 'closed':
        return <Badge variant="default">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDeadlineExtension = (evalId: string, days: number) => {
    setEvalPeriods(evalPeriods.map(e => {
      if (e.id === evalId) {
        const endDate = new Date(e.endDate);
        endDate.setDate(endDate.getDate() + days);
        return { ...e, endDate: endDate.toISOString().split('T')[0] };
      }
      return e;
    }));
    alert(`Deadline extended by ${days} days`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set up academic periods and evaluation schedules
          </p>
        </div>
      </div>

      {/* Academic Periods Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle>Academic Periods</CardTitle>
            <CardDescription>Manage academic years and semesters</CardDescription>
          </div>
          <Button variant="primary" className="gap-2" onClick={() => openModal('period')}>
            <Plus className="w-4 h-4" />
            New Period
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-3">
            {periods.map((period) => (
              <div key={period.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {period.academicYear} - Semester {period.semester}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(period.startDate).toLocaleDateString()} to {new Date(period.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {period.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!period.isActive && (
                    <Button variant="primary" size="sm" onClick={() => handleActivatePeriod(period.id)}>
                      Activate
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => handleDeletePeriod(period.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Periods Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle>Evaluation Periods</CardTitle>
            <CardDescription>Schedule and manage evaluation windows</CardDescription>
          </div>
          <Button variant="primary" className="gap-2" onClick={() => openModal('eval')}>
            <Plus className="w-4 h-4" />
            New Evaluation Period
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-3">
            {evalPeriods.map((evalPeriod) => (
              <div key={evalPeriod.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {evalPeriod.status === 'active' ? (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                      )}
                      {evalPeriod.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(evalPeriod.startDate).toLocaleDateString()} to {new Date(evalPeriod.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>{getStatusBadge(evalPeriod.status)}</div>
                </div>
                <div className="flex gap-2">
                  {evalPeriod.status === 'active' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeadlineExtension(evalPeriod.id, 7)}
                      >
                        Extend 7 Days
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeadlineExtension(evalPeriod.id, 3)}
                      >
                        Extend 3 Days
                      </Button>
                    </>
                  )}
                  <Button variant="danger" size="sm" onClick={() => handleDeleteEvalPeriod(evalPeriod.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Assignments Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle>Course Assignments</CardTitle>
            <CardDescription>View and manage instructor-course assignments</CardDescription>
          </div>
          <Button variant="primary" className="gap-2" onClick={() => openModal('course')}>
            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Course Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Course Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Instructor</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Section</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Semester</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{course.code}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{course.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{course.instructor?.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{course.section}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Semester {course.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Creating/Editing */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalType === 'period'
            ? 'Create Academic Period'
            : modalType === 'eval'
            ? 'Create Evaluation Period'
            : 'Create Course Assignment'
        }
      >
        <div className="space-y-4">
          {modalType === 'period' && (
            <>
              <Input
                label="Academic Year"
                placeholder="e.g., 2024-2025"
                value={formData.academicYear || ''}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Semester
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={formData.semester || '1'}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Summer</option>
                </select>
              </div>
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <Checkbox
                label="Set as Active"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSavePeriod}>Create Period</Button>
              </div>
            </>
          )}

          {modalType === 'eval' && (
            <>
              <Input
                label="Period Name"
                placeholder="e.g., Midterm Evaluation S1"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSaveEvalPeriod}>Create Period</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
