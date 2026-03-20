import {
  User,
  Teacher,
  Student,
  Course,
  EvaluationForm,
  EvaluationResponse,
  EvaluationPeriod,
} from '@/types';

// Empty data placeholders (no seeded/mock data)
export const mockUsers: Record<string, User> = {};

export const currentStudent: Student = {
  id: '',
  name: '',
  email: '',
  role: 'student',
  program: '',
  yearLevel: 0,
  enrolledCourses: [],
};

export const currentTeacher: Teacher = {
  id: '',
  name: '',
  email: '',
  role: 'teacher',
  specialization: '',
  courses: [],
};

export const currentDean: User = {
  id: '',
  name: '',
  email: '',
  role: 'dean',
};

export const mockCourses: Course[] = [];

export const mockEvaluationForm: EvaluationForm = {
  id: '',
  name: '',
  description: '',
  type: 'student-to-teacher',
  criteria: [],
  createdAt: new Date(),
  isPublished: false,
  chedCompliant: false,
};

export const mockEvaluationResponses: EvaluationResponse[] = [];

export const mockEvaluationPeriod: EvaluationPeriod = {
  id: '',
  academicPeriodId: '',
  name: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  isActive: false,
  formId: '',
  status: 'setup',
  completionPercentage: 0,
};

export const mockPendingEvaluations: any[] = [];
export const mockTeacherPerformanceTrend: any[] = [];
export const mockCriteriaBreakdown: any[] = [];
