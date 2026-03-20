# 🔴 PRIORITY: Evaluation Flow — Implementation Plan

## System State (After Codebase Scan)

**Backend APIs are mostly built.** The primary gap is **frontend wiring** — connecting existing UI to existing API endpoints.

### What's Working ✅
| API Route | CRUD | Notes |
|-----------|------|-------|
| `/api/forms` | Full | Create/read/update/delete `evaluation_forms` |
| `/api/evaluation_periods` | Full | Manage evaluation periods with status |
| `/api/evaluations` | Full | GET/POST/PATCH + `action: 'generate'` for bulk creation |
| `/api/comments` | Full | Entity-based comments with author tracking |
| `/api/criteria` | GET | Reads from `evaluation_criteria` table |
| `/api/courses` | GET | Returns courses with teacher info |
| [lib/db.ts](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/lib/db.ts) | — | Connection pool, [query()](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/lib/db.ts#13-31), [queryOne()](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/lib/db.ts#32-41) helpers |
| `hooks/useFetch` | — | Auto-attaches JWT Bearer token |

### What's Broken / Hardcoded ❌
| File | Problem |
|------|---------|
| [dean/evaluation-setup/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/dean/evaluation-setup/page.tsx) | **Lines 73-90**: JSX syntax error (raw JSX outside component). [saveSetup()](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/dean/evaluation-setup/page.tsx#299-304) and [startEvaluation()](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/dean/evaluation-setup/page.tsx#304-308) are no-ops (`setTimeout` only). Instructor/subject arrays are hardcoded. |
| [dean/dashboard/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/dean/dashboard/page.tsx) | "Create One" button routes to `/dean/academic` instead of `/dean/evaluation-setup` |
| [student/evaluations/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/student/evaluations/page.tsx) | Fetches criteria from `/api/criteria` but not from the admin-created evaluation form for the active period |
| [teacher/dashboard/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/teacher/dashboard/page.tsx) | No anonymous student feedback section |
| [teacher/peer/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/teacher/peer/page.tsx) | UI exists but depends on backend generating peer assignments (bulk generate exists but isn't called by frontned) |

---

## Agent Slices

### 🔵 SLICE 1 — Admin Evaluation Setup (P1 + P2 + m5)
**Scope**: Fix the dean-side setup flow so evaluations can be created end-to-end.

**Files to edit**:
- [app/dean/evaluation-setup/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/dean/evaluation-setup/page.tsx) — Main work
- [app/dean/dashboard/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/dean/dashboard/page.tsx) — Quick route fix (P2)

**Tasks**:
1. **m5**: Remove the stray JSX block (lines 73-90) — it's outside any function and causes build errors
2. **P2**: Change `router.push('/dean/academic')` → `router.push('/dean/evaluation-setup')` on the dean dashboard
3. **P1 — saveSetup()**:
   - POST to `/api/evaluation_periods` (create schedule with `name`, `start_date`, `end_date`, `academic_period_id`)
   - POST to `/api/forms` (persist the evaluation form with criteria JSON)
   - Link: PATCH the evaluation period to set `form_id` to the newly created form's ID
4. **P1 — startEvaluation()**:
   - PATCH `/api/evaluation_periods` with `{ id, status: 'active' }`
   - POST `/api/evaluations` with `{ action: 'generate' }` to bulk-create student→teacher and teacher→teacher assignments
5. **P1 — Live data**:
   - Replace hardcoded `allSubjects` with `useFetch('/courses')`
   - Replace hardcoded instructor list with `useFetch('/api/users?role=teacher')`

**API endpoints used** (all exist): `/api/evaluation_periods`, `/api/forms`, `/api/evaluations`, `/api/users`, `/courses`

---

### 🟢 SLICE 2 — Student Evaluation Flow (P3)
**Scope**: Connect student evaluation UI to admin-created forms.

**Files to edit**:
- [app/student/evaluations/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/student/evaluations/page.tsx) — Main work

**Tasks**:
1. Fetch the **active evaluation period** from `/api/evaluation_periods` (filter by `status === 'active'`)
2. Use the period's `form_id` to load the evaluation form from `/api/forms` and extract its `criteria` JSON
3. Replace the current `useFetch('/api/criteria')` with the form-based criteria
4. On submission, POST to `/api/evaluations` with `{ courseId, evaluationType: 'teacher', responses: [...] }`
5. Optionally POST to `/api/comments` with `{ entity_type: 'evaluation', entity_id: teacherId, content: anonymousComment }` for anonymous feedback

**API endpoints used** (all exist): `/api/evaluation_periods`, `/api/forms`, `/api/evaluations`, `/api/comments`

---

### 🟠 SLICE 3 — Teacher Feedback & Peer Flow (P4 + P5)
**Scope**: Display anonymous feedback on teacher dashboard; wire peer evaluation.

**Files to edit**:
- [app/teacher/dashboard/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/teacher/dashboard/page.tsx) — Add anonymous feedback card (P4)
- [app/teacher/peer/page.tsx](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/teacher/peer/page.tsx) — Wire to real data (P5)

**Tasks**:
1. **P4**: Add a "Student Feedback" card to teacher dashboard
   - Fetch from `/api/comments?entity_type=evaluation&entity_id={teacherId}`
   - Display comments WITHOUT author names (anonymous)
   - Show rating + date only
2. **P5**: Wire peer evaluation page
   - Fetch peer evaluation assignments from `/api/evaluations?type=peer`
   - Submit peer responses via POST `/api/evaluations`
   - Display anonymous peer comments on dashboard alongside student comments

**API endpoints used** (all exist): `/api/comments`, `/api/evaluations`

---

## Dependency Graph

```
m5 (fix JSX syntax) → P1 (wire save/start) → P3 (student forms)
                                             → P5 (peer eval)
                                             → P4 (teacher feedback)
P2 (route fix) → independent
```

**Slices 2 and 3 can run in parallel** once Slice 1 is complete.

---

## Verification Plan

### Per-Slice Testing
- **Slice 1**: Login as dean → go to Evaluation Setup → fill form → Save → Start → verify `evaluation_periods` and `evaluations` tables are populated
- **Slice 2**: Login as student → go to Evaluations → see admin-created form → submit → verify `evaluation_responses` table
- **Slice 3**: Login as teacher → see anonymous student comments on dashboard → go to Peer → see peer assignments → submit peer review
