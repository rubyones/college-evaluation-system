(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/college_of_information_technology2/data/mock.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currentDean",
    ()=>currentDean,
    "currentStudent",
    ()=>currentStudent,
    "currentTeacher",
    ()=>currentTeacher,
    "mockAcademicPeriod",
    ()=>mockAcademicPeriod,
    "mockAuditLogs",
    ()=>mockAuditLogs,
    "mockCourses",
    ()=>mockCourses,
    "mockCriteriaBreakdown",
    ()=>mockCriteriaBreakdown,
    "mockDepartmentPerformance",
    ()=>mockDepartmentPerformance,
    "mockEvaluationForm",
    ()=>mockEvaluationForm,
    "mockEvaluationPeriod",
    ()=>mockEvaluationPeriod,
    "mockEvaluationResponses",
    ()=>mockEvaluationResponses,
    "mockInstructorRankings",
    ()=>mockInstructorRankings,
    "mockNotifications",
    ()=>mockNotifications,
    "mockPendingEvaluations",
    ()=>mockPendingEvaluations,
    "mockTeacherPerformanceTrend",
    ()=>mockTeacherPerformanceTrend,
    "mockUsers",
    ()=>mockUsers
]);
const mockUsers = {
    'user-student-1': {
        id: 'user-student-1',
        name: 'Ruby Grace Ones',
        email: 'rubygrace.ones@jmc.edu.ph',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby',
        studentId: 'CST-20210001'
    },
    'user-student-2': {
        id: 'user-student-2',
        name: 'Ada Lovelace',
        email: 'ada.lovelace@student.college.edu',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ada',
        studentId: 'CST-20210002'
    },
    'user-teacher-1': {
        id: 'user-teacher-1',
        name: 'Ryan Billera',
        email: 'ryan.billera@jmc.edu.ph',
        role: 'teacher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
        department: 'College of Information Technology',
        employeeId: 'FAC-001'
    },
    'user-teacher-2': {
        id: 'user-teacher-2',
        name: 'Charles Babbage',
        email: 'charles.babbage@college.edu',
        role: 'teacher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charles',
        department: 'College of Information Technology',
        employeeId: 'FAC-002'
    },
    'user-dean-1': {
        id: 'user-dean-1',
        name: 'Ms. Jannete Claro',
        email: 'janette.claro@jmc.edu.ph',
        role: 'dean',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jannete',
        department: 'College of Information Technology',
        employeeId: 'DEAN-001'
    }
};
const currentStudent = {
    ...mockUsers['user-student-1'],
    role: 'student',
    program: 'Bachelor of Science in Information Technology',
    yearLevel: 2,
    enrolledCourses: []
};
const currentTeacher = {
    ...mockUsers['user-teacher-1'],
    role: 'teacher',
    specialization: 'Software Engineering',
    courses: [],
    performanceRating: 4.5
};
const currentDean = mockUsers['user-dean-1'];
const mockCourses = [
    {
        id: 'course-1',
        code: 'IT101',
        name: 'Introduction to Computing',
        instructorId: 'user-teacher-1',
        instructor: mockUsers['user-teacher-1'],
        credits: 3,
        section: 'A',
        semester: '1',
        academicYear: '2024-2025'
    },
    {
        id: 'course-2',
        code: 'CS202',
        name: 'Data Structures',
        instructorId: 'user-teacher-2',
        instructor: mockUsers['user-teacher-2'],
        credits: 3,
        section: 'A',
        semester: '1',
        academicYear: '2024-2025'
    },
    {
        id: 'course-3',
        code: 'IT303',
        name: 'Web Development',
        instructorId: 'user-teacher-1',
        instructor: mockUsers['user-teacher-1'],
        credits: 3,
        section: 'B',
        semester: '2',
        academicYear: '2024-2025'
    },
    {
        id: 'course-4',
        code: 'IT201',
        name: 'Database Management',
        instructorId: 'user-teacher-2',
        instructor: mockUsers['user-teacher-2'],
        credits: 3,
        section: 'A',
        semester: '1',
        academicYear: '2024-2025'
    }
];
const mockEvaluationForm = {
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
            maxScore: 5
        },
        {
            id: 'criteria-2',
            name: 'Subject Mastery',
            description: 'Instructor knowledge and command of subject matter',
            weight: 40,
            maxScore: 5
        },
        {
            id: 'criteria-3',
            name: 'Engagement',
            description: 'How well the instructor engages and motivates students',
            weight: 30,
            maxScore: 5
        }
    ],
    createdAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-02-01'),
    isPublished: true,
    chedCompliant: true
};
const mockEvaluationResponses = [
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
            {
                criteriaId: 'criteria-1',
                score: 5,
                comment: 'Very clear presentations'
            },
            {
                criteriaId: 'criteria-2',
                score: 5,
                comment: 'Excellent mastery'
            },
            {
                criteriaId: 'criteria-3',
                score: 4,
                comment: 'Good engagement'
            }
        ],
        overallComment: 'Very knowledgeable and engaging instructor.',
        submittedAt: new Date(),
        isAnonymous: true,
        isLocked: true
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
            {
                criteriaId: 'criteria-1',
                score: 4,
                comment: 'Clear but could be better'
            },
            {
                criteriaId: 'criteria-2',
                score: 5,
                comment: 'Outstanding knowledge'
            },
            {
                criteriaId: 'criteria-3',
                score: 5,
                comment: 'Very engaging'
            }
        ],
        overallComment: 'Excellent teacher, very well prepared.',
        submittedAt: new Date(),
        isAnonymous: true,
        isLocked: true
    }
];
const mockAcademicPeriod = {
    id: 'period-1',
    academicYear: '2024-2025',
    semester: 1,
    startDate: new Date('2024-08-15'),
    endDate: new Date('2024-12-15'),
    isActive: true
};
const mockEvaluationPeriod = {
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
    completionPercentage: 65
};
const mockPendingEvaluations = [
    {
        id: 'pending-1',
        formId: 'form-1',
        evaluatorId: 'user-student-1',
        evaluateeId: 'user-teacher-2',
        courseId: 'course-2',
        responses: [],
        isAnonymous: true,
        isLocked: false
    },
    {
        id: 'pending-2',
        formId: 'form-1',
        evaluatorId: 'user-student-1',
        evaluateeId: 'user-teacher-1',
        courseId: 'course-3',
        responses: [],
        isAnonymous: true,
        isLocked: false
    }
];
const mockNotifications = [
    {
        id: 'notif-1',
        userId: 'user-student-1',
        type: 'pending-evaluation',
        title: 'Pending Evaluation',
        message: 'You have 2 pending evaluations to complete',
        createdAt: new Date(Date.now() - 3600000)
    },
    {
        id: 'notif-2',
        userId: 'user-student-1',
        type: 'deadline-warning',
        title: 'Evaluation Deadline',
        message: 'Your evaluations are due in 3 days',
        createdAt: new Date(Date.now() - 7200000)
    },
    {
        id: 'notif-3',
        userId: 'user-student-1',
        type: 'result-available',
        title: 'Results Available',
        message: 'Previous semester evaluation results are now available',
        createdAt: new Date(Date.now() - 86400000),
        readAt: new Date(Date.now() - 86000000)
    }
];
const mockAuditLogs = [
    {
        id: 'log-1',
        userId: 'user-student-1',
        user: mockUsers['user-student-1'],
        action: 'Logged in',
        actionType: 'login',
        resourceType: 'authentication',
        resourceId: 'user-student-1',
        timestamp: new Date(Date.now() - 3600000),
        ipAddress: '192.168.1.100'
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
        ipAddress: '192.168.1.100'
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
        ipAddress: '192.168.1.50'
    }
];
const mockInstructorRankings = [
    {
        rank: 1,
        instructorId: 'user-teacher-1',
        instructor: mockUsers['user-teacher-1'],
        overallScore: 4.7,
        department: 'College of Information Technology',
        yearsOfService: 5
    },
    {
        rank: 2,
        instructorId: 'user-teacher-2',
        instructor: mockUsers['user-teacher-2'],
        overallScore: 4.5,
        department: 'College of Information Technology',
        yearsOfService: 3
    }
];
const mockDepartmentPerformance = [
    {
        period: 'Sem 1 2023',
        score: 4.2,
        completionRate: 78
    },
    {
        period: 'Sem 2 2023',
        score: 4.3,
        completionRate: 82
    },
    {
        period: 'Sem 1 2024',
        score: 4.4,
        completionRate: 85
    },
    {
        period: 'Current',
        score: 4.5,
        completionRate: 75
    }
];
const mockTeacherPerformanceTrend = [
    {
        period: 'Sem 1 2023',
        score: 4.1,
        completionRate: 90
    },
    {
        period: 'Sem 2 2023',
        score: 4.3,
        completionRate: 92
    },
    {
        period: 'Sem 1 2024',
        score: 4.5,
        completionRate: 95
    },
    {
        period: 'Current',
        score: 4.6,
        completionRate: 87
    }
];
const mockCriteriaBreakdown = [
    {
        criteriaName: 'Clarity',
        score: 4.8,
        percentage: 30
    },
    {
        criteriaName: 'Subject Mastery',
        score: 4.9,
        percentage: 40
    },
    {
        criteriaName: 'Engagement',
        score: 4.6,
        percentage: 30
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/college_of_information_technology2/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/college_of_information_technology2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/college_of_information_technology2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/college_of_information_technology2/data/mock.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [role, setRoleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('student');
    const [isDemoMode, setIsDemoMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [token, setTokenState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const savedRole = localStorage.getItem('demo-role');
            const savedUserId = localStorage.getItem('current-user-id');
            const savedToken = sessionStorage.getItem('auth_token');
            if (savedToken) {
                setTokenState(savedToken);
            }
            if (savedUserId && __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"][savedUserId]) {
                const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"][savedUserId];
                setUser(currentUser);
                setRoleState(savedRole || currentUser.role);
                setIsDemoMode(!!savedRole);
            }
        }
    }["AuthProvider.useEffect"], []);
    const login = async (userId, _password)=>{
        // Support both demo mode and real API
        // If userId looks like a real ID (number), use mock data fallback
        // Otherwise, use mock user data
        return new Promise((resolve)=>{
            setTimeout(()=>{
                if (__TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"][userId]) {
                    const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$data$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"][userId];
                    setUser(currentUser);
                    setRoleState(currentUser.role);
                    localStorage.setItem('current-user-id', userId);
                    localStorage.removeItem('demo-role');
                    setIsDemoMode(false);
                    resolve();
                } else {
                    // For demo purposes, create a user from the provided ID
                    const demoUser = {
                        id: userId,
                        name: 'Test User',
                        email: 'test@jmc.edu.ph',
                        role: 'student',
                        avatar: '👤'
                    };
                    setUser(demoUser);
                    setRoleState('student');
                    localStorage.setItem('current-user-id', userId);
                    localStorage.removeItem('demo-role');
                    setIsDemoMode(false);
                    resolve();
                }
            }, 500);
        });
    };
    const setUserFromApi = (apiUser)=>{
        const mapped = {
            id: String(apiUser.id ?? apiUser.email ?? 'guest'),
            name: apiUser.name ?? 'API User',
            email: apiUser.email ?? '',
            role: apiUser.role ?? 'student',
            avatar: apiUser.avatar ?? '👤'
        };
        setUser(mapped);
        setRoleState(mapped.role);
        localStorage.setItem('current-user-id', mapped.id);
        setIsDemoMode(false);
    };
    const logout = ()=>{
        setUser(null);
        setRoleState('student');
        setTokenState(null);
        localStorage.removeItem('current-user-id');
        localStorage.removeItem('demo-role');
        sessionStorage.removeItem('auth_token');
        setIsDemoMode(false);
    };
    const setRole = (newRole)=>{
        setRoleState(newRole);
        localStorage.setItem('demo-role', newRole);
        setIsDemoMode(true);
    };
    const setToken = (newToken)=>{
        setTokenState(newToken);
        sessionStorage.setItem('auth_token', newToken);
    };
    const value = {
        user,
        role,
        setRole,
        login,
        setUserFromApi,
        logout,
        isAuthenticated: user !== null,
        isDemoMode,
        token,
        setToken
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/college_of_information_technology2/context/AuthContext.tsx",
        lineNumber: 130,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "AOqrm5JO5NRB5QdGOPqe0LUzNgw=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/college_of_information_technology2/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/college_of_information_technology2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/college_of_information_technology2/node_modules/next-themes/dist/index.module.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/college_of_information_technology2/context/AuthContext.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/college_of_information_technology2/app/providers.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/college_of_information_technology2/app/providers.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Providers;
const __TURBOPACK__default__export__ = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/college_of_information_technology2/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/college_of_information_technology2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/college_of_information_technology2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/college_of_information_technology2/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/college_of_information_technology2/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/college_of_information_technology2/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/college_of_information_technology2/node_modules/next-themes/dist/index.module.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>$,
    "useTheme",
    ()=>y
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/college_of_information_technology2/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
const c = [
    "light",
    "dark"
], i = "(prefers-color-scheme: dark)", d = "undefined" == typeof window, u = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(void 0), h = {
    setTheme: (e)=>{},
    themes: []
}, y = ()=>{
    var e;
    return null !== (e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(u)) && void 0 !== e ? e : h;
}, $ = (r)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(u) ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, r.children) : /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(f, r), v = [
    "light",
    "dark"
], f = ({ forcedTheme: t, disableTransitionOnChange: n = !1, enableSystem: l = !0, enableColorScheme: m = !0, storageKey: d = "theme", themes: h = v, defaultTheme: y = l ? "system" : "light", attribute: $ = "data-theme", value: f, children: w, nonce: T })=>{
    const [E, k] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(()=>S(d, y)), [C, L] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(()=>S(d)), x = f ? Object.values(f) : h, I = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        let t = e;
        if (!t) return;
        "system" === e && l && (t = p());
        const r = f ? f[t] : t, o = n ? b() : null, a = document.documentElement;
        if ("class" === $ ? (a.classList.remove(...x), r && a.classList.add(r)) : r ? a.setAttribute($, r) : a.removeAttribute($), m) {
            const e = c.includes(y) ? y : null, n = c.includes(t) ? t : e;
            a.style.colorScheme = n;
        }
        null == o || o();
    }, []), O = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        k(e);
        try {
            localStorage.setItem(d, e);
        } catch (e) {}
    }, [
        t
    ]), M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const n = p(e);
        L(n), "system" === E && l && !t && I("system");
    }, [
        E,
        t
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const e = window.matchMedia(i);
        return e.addListener(M), M(e), ()=>e.removeListener(M);
    }, [
        M
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const e = (e)=>{
            e.key === d && O(e.newValue || y);
        };
        return window.addEventListener("storage", e), ()=>window.removeEventListener("storage", e);
    }, [
        O
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        I(null != t ? t : E);
    }, [
        t,
        E
    ]);
    const A = (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            theme: E,
            setTheme: O,
            forcedTheme: t,
            resolvedTheme: "system" === E ? C : E,
            themes: l ? [
                ...h,
                "system"
            ] : h,
            systemTheme: l ? C : void 0
        }), [
        E,
        O,
        t,
        C,
        l,
        h
    ]); /*#__PURE__*/ 
    return __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(u.Provider, {
        value: A
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(g, {
        forcedTheme: t,
        disableTransitionOnChange: n,
        enableSystem: l,
        enableColorScheme: m,
        storageKey: d,
        themes: h,
        defaultTheme: y,
        attribute: $,
        value: f,
        children: w,
        attrs: x,
        nonce: T
    }), w);
}, g = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(({ forcedTheme: t, storageKey: n, attribute: r, enableSystem: o, enableColorScheme: a, defaultTheme: s, value: l, attrs: m, nonce: d })=>{
    const u = "system" === s, h = "class" === r ? `var d=document.documentElement,c=d.classList;c.remove(${m.map((e)=>`'${e}'`).join(",")});` : `var d=document.documentElement,n='${r}',s='setAttribute';`, y = a ? c.includes(s) && s ? `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${s}'` : "if(e==='light'||e==='dark')d.style.colorScheme=e" : "", $ = (e, t = !1, n = !0)=>{
        const o = l ? l[e] : e, s = t ? e + "|| ''" : `'${o}'`;
        let m = "";
        return a && n && !t && c.includes(e) && (m += `d.style.colorScheme = '${e}';`), "class" === r ? m += t || o ? `c.add(${s})` : "null" : o && (m += `d[s](n,${s})`), m;
    }, v = t ? `!function(){${h}${$(t)}}()` : o ? `!function(){try{${h}var e=localStorage.getItem('${n}');if('system'===e||(!e&&${u})){var t='${i}',m=window.matchMedia(t);if(m.media!==t||m.matches){${$("dark")}}else{${$("light")}}}else if(e){${l ? `var x=${JSON.stringify(l)};` : ""}${$(l ? "x[e]" : "e", !0)}}${u ? "" : "else{" + $(s, !1, !1) + "}"}${y}}catch(e){}}()` : `!function(){try{${h}var e=localStorage.getItem('${n}');if(e){${l ? `var x=${JSON.stringify(l)};` : ""}${$(l ? "x[e]" : "e", !0)}}else{${$(s, !1, !1)};}${y}}catch(t){}}();`; /*#__PURE__*/ 
    return __TURBOPACK__imported__module__$5b$project$5d2f$college_of_information_technology2$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("script", {
        nonce: d,
        dangerouslySetInnerHTML: {
            __html: v
        }
    });
}, ()=>!0), S = (e, t)=>{
    if (d) return;
    let n;
    try {
        n = localStorage.getItem(e) || void 0;
    } catch (e) {}
    return n || t;
}, b = ()=>{
    const e = document.createElement("style");
    return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), document.head.appendChild(e), ()=>{
        window.getComputedStyle(document.body), setTimeout(()=>{
            document.head.removeChild(e);
        }, 1);
    };
}, p = (e)=>(e || (e = window.matchMedia(i)), e.matches ? "dark" : "light");
;
}),
]);

//# sourceMappingURL=college_of_information_technology2_0938cbfd._.js.map