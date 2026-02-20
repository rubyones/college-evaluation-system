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
]);

//# sourceMappingURL=college_of_information_technology2_b5b62707._.js.map