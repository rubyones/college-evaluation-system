import {
  User,
  Teacher,
  Student,
  Course,
  EvaluationForm,
  EvaluationResponse,
  AcademicPeriod,
  EvaluationPeriod,
  Notification,
  AuditLog,
  InstructorRanking,
} from '@/types';

// Mock Users
export const mockUsers: Record<string, User> = {
  'user-student-1': {
    id: 'user-student-1',
    name: 'Ruby Grace Ones',
    email: 'rubygrace.ones@jmc.edu.ph',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby',
    studentId: 'CST-20210001',
  },
  'user-student-2': {
    id: 'user-student-2',
    name: 'Ada Lovelace',
    email: 'ada.lovelace@student.college.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ada',
    studentId: 'CST-20210002',
  },
  'user-teacher-1': {
    id: 'user-teacher-1',
    name: 'Ryan Billera',
    email: 'ryan.billera@jmc.edu.ph',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    department: 'College of Information Technology',
    employeeId: 'FAC-001',
  },
  'user-teacher-2': {
    id: 'user-teacher-2',
    name: 'Charles Babbage',
    email: 'charles.babbage@college.edu',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charles',
    department: 'College of Information Technology',
    employeeId: 'FAC-002',
  },
  'user-dean-1': {
    id: 'user-dean-1',
    name: 'Ms. Jannete Claro',
    email: 'janette.claro@jmc.edu.ph',
    role: 'dean',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jannete',
    department: 'College of Information Technology',
    employeeId: 'DEAN-001',
  },
};

// Format for easier access
export const currentStudent: Student = {
  ...mockUsers['user-student-1'],
  role: 'student',
  program: 'Bachelor of Science in Information Technology',
  yearLevel: 2,
  enrolledCourses: [],
};

export const currentTeacher: Teacher = {
  ...mockUsers['user-teacher-1'],
  role: 'teacher',
  specialization: 'Software Engineering',
  courses: [],
  performanceRating: 4.5,
};

export const currentDean: User = mockUsers['user-dean-1'];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    code: 'IT101',
    name: 'Introduction to Computing',
    instructorId: 'user-teacher-1',
    instructor: mockUsers['user-teacher-1'] as Teacher,
    credits: 3,
    section: 'A',
    semester: '1',
    academicYear: '2024-2025',
  },
  {
    id: 'course-2',
    code: 'CS202',
    name: 'Data Structures',
    instructorId: 'user-teacher-2',
    instructor: mockUsers['user-teacher-2'] as Teacher,
    credits: 3,
    section: 'A',
    semester: '1',
    academicYear: '2024-2025',
  },
  {
    id: 'course-3',
    code: 'IT303',
    name: 'Web Development',
    instructorId: 'user-teacher-1',
    instructor: mockUsers['user-teacher-1'] as Teacher,
    credits: 3,
    section: 'B',
    semester: '2',
    academicYear: '2024-2025',
  },
  {
    id: 'course-4',
    code: 'IT201',
    name: 'Database Management',
    instructorId: 'user-teacher-2',
    instructor: mockUsers['user-teacher-2'] as Teacher,
    credits: 3,
    section: 'A',
    semester: '1',
    academicYear: '2024-2025',
  },
];

// Mock Evaluation Form
export const mockEvaluationForm: EvaluationForm = {
  id: 'form-1',
  name: 'Student Evaluation of Teaching',
  description: 'Comprehensive evaluation form for student feedback on teaching effectiveness',
  type: 'student-to-teacher',
  criteria: [
    {
      id: 'criteria-1',
      name: 'Clarity',
      description: 'How clearly the instructor presents course materials',
      weight: 30,
      maxScore: 5,
    },
    {
      id: 'criteria-2',
      name: 'Subject Mastery',
      description: 'Instructor knowledge and command of subject matter',
      weight: 40,
      maxScore: 5,
    },
    {
      id: 'criteria-3',
      name: 'Engagement',
      description: 'How well the instructor engages and motivates students',
      weight: 30,
      maxScore: 5,
    },
  ],
  createdAt: new Date('2024-01-15'),
  publishedAt: new Date('2024-02-01'),
  isPublished: true,
  chedCompliant: true,
};

// Mock Evaluation Responses
export const mockEvaluationResponses: EvaluationResponse[] = [
  {
    id: 'eval-1',
    formId: 'form-1',
    form: mockEvaluationForm,
    evaluatorId: 'user-student-1',
    evaluator: mockUsers['user-student-1'],
    evaluateeId: 'user-teacher-1',
    evaluatee: mockUsers['user-teacher-1'],
    courseId: 'course-1',
    course: mockCourses[0],
    responses: [
      { criteriaId: 'criteria-1', score: 5, comment: 'Very clear presentations' },
      { criteriaId: 'criteria-2', score: 5, comment: 'Excellent mastery' },
      { criteriaId: 'criteria-3', score: 4, comment: 'Good engagement' },
    ],
    overallComment: 'Very knowledgeable and engaging instructor.',
    submittedAt: new Date(),
    isAnonymous: true,
    isLocked: true,
  },
  {
    id: 'eval-2',
    formId: 'form-1',
    form: mockEvaluationForm,
    evaluatorId: 'user-student-2',
    evaluator: mockUsers['user-student-2'],
    evaluateeId: 'user-teacher-1',
    evaluatee: mockUsers['user-teacher-1'],
    courseId: 'course-1',
    course: mockCourses[0],
    responses: [
      { criteriaId: 'criteria-1', score: 4, comment: 'Clear but could be better' },
      { criteriaId: 'criteria-2', score: 5, comment: 'Outstanding knowledge' },
      { criteriaId: 'criteria-3', score: 5, comment: 'Very engaging' },
    ],
    overallComment: 'Excellent teacher, very well prepared.',
    submittedAt: new Date(),
    isAnonymous: true,
    isLocked: true,
  },
];

// Mock Academic Period
export const mockAcademicPeriod: AcademicPeriod = {
  id: 'period-1',
  academicYear: '2024-2025',
  semester: 1,
  startDate: new Date('2024-08-15'),
  endDate: new Date('2024-12-15'),
  isActive: true,
};

// Mock Evaluation Period
export const mockEvaluationPeriod: EvaluationPeriod = {
  id: 'eval-period-1',
  academicPeriodId: 'period-1',
  academicPeriod: mockAcademicPeriod,
  name: 'Midterm Evaluation - Semester 1',
  description: 'Student evaluation of teachers during the middle of the first semester',
  startDate: new Date('2024-10-01'),
  endDate: new Date('2024-10-15'),
  isActive: true,
  formId: 'form-1',
  form: mockEvaluationForm,
  status: 'active',
  completionPercentage: 65,
};

// Mock Pending Evaluations
export const mockPendingEvaluations: EvaluationResponse[] = [
  {
    id: 'pending-1',
    formId: 'form-1',
    evaluatorId: 'user-student-1',
    evaluateeId: 'user-teacher-2',
    courseId: 'course-2',
    responses: [],
    isAnonymous: true,
    isLocked: false,
  },
  {
    id: 'pending-2',
    formId: 'form-1',
    evaluatorId: 'user-student-1',
    evaluateeId: 'user-teacher-1',
    courseId: 'course-3',
    responses: [],
    isAnonymous: true,
    isLocked: false,
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    type: 'pending-evaluation',
    title: 'Pending Evaluation',
    message: 'You have 2 pending evaluations to complete',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    type: 'deadline-warning',
    title: 'Evaluation Deadline',
    message: 'Your evaluations are due in 3 days',
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'notif-3',
    userId: 'user-student-1',
    type: 'result-available',
    title: 'Results Available',
    message: 'Previous semester evaluation results are now available',
    createdAt: new Date(Date.now() - 86400000),
    readAt: new Date(Date.now() - 86000000),
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-student-1',
    user: mockUsers['user-student-1'],
    action: 'Logged in',
    actionType: 'login',
    resourceType: 'authentication',
    resourceId: 'user-student-1',
    timestamp: new Date(Date.now() - 3600000),
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-2',
    userId: 'user-student-1',
    user: mockUsers['user-student-1'],
    action: 'Submitted evaluation for IT101',
    actionType: 'submit',
    resourceType: 'evaluation',
    resourceId: 'eval-1',
    timestamp: new Date(Date.now() - 7200000),
    ipAddress: '192.168.1.100',
  },
  {
    id: 'log-3',
    userId: 'user-dean-1',
    user: mockUsers['user-dean-1'],
    action: 'Created new evaluation form',
    actionType: 'create',
    resourceType: 'form',
    resourceId: 'form-1',
    timestamp: new Date('2024-02-01'),
    ipAddress: '192.168.1.50',
  },
];

// Mock Instructor Rankings
export const mockInstructorRankings: InstructorRanking[] = [
  {
    rank: 1,
    instructorId: 'user-teacher-1',
    instructor: mockUsers['user-teacher-1'] as Teacher,
    overallScore: 4.7,
    department: 'College of Information Technology',
    yearsOfService: 5,
  },
  {
    rank: 2,
    instructorId: 'user-teacher-2',
    instructor: mockUsers['user-teacher-2'] as Teacher,
    overallScore: 4.5,
    department: 'College of Information Technology',
    yearsOfService: 3,
  },
];

// Mock Department Performance Data
export const mockDepartmentPerformance = [
  { period: 'Sem 1 2023', score: 4.2, completionRate: 78 },
  { period: 'Sem 2 2023', score: 4.3, completionRate: 82 },
  { period: 'Sem 1 2024', score: 4.4, completionRate: 85 },
  { period: 'Current', score: 4.5, completionRate: 75 },
];

// Mock Teacher Performance Trend
export const mockTeacherPerformanceTrend = [
  { period: 'Sem 1 2023', score: 4.1, completionRate: 90 },
  { period: 'Sem 2 2023', score: 4.3, completionRate: 92 },
  { period: 'Sem 1 2024', score: 4.5, completionRate: 95 },
  { period: 'Current', score: 4.6, completionRate: 87 },
];

// Mock Criteria Breakdown
export const mockCriteriaBreakdown = [
  { criteriaName: 'Clarity', score: 4.8, percentage: 30 },
  { criteriaName: 'Subject Mastery', score: 4.9, percentage: 40 },
  { criteriaName: 'Engagement', score: 4.6, percentage: 30 },
];
