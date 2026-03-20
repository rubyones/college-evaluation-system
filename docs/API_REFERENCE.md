# CITE-ES API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <JWT_TOKEN>
```

JWT payload: `{ userId, role, id, iat, exp }` — expires in 24 hours.

---

## Endpoints Overview

| Route | Methods | Access |
|-------|---------|--------|
| `/auth` | POST | Public |
| `/auth/me` | GET | Authenticated |
| `/users` | GET, PATCH | Authenticated (dean sees all) |
| `/courses` | GET, PATCH | Authenticated (role-filtered) |
| `/academic_periods` | GET, POST, PATCH, DELETE | Dean only |
| `/evaluation_periods` | GET, POST, PATCH, DELETE | Dean (full), others (active only) |
| `/evaluations` | GET, POST, PATCH, DELETE | Authenticated (role-filtered) |
| `/evaluations/sync` | POST | Student, Teacher |
| `/evaluations/ghost` | POST | Dean only |
| `/forms` | GET, POST, PATCH, DELETE | Dean only |
| `/criteria` | GET | Public |
| `/analytics` | GET | Authenticated (role-filtered) |
| `/comments` | GET, POST, PATCH, DELETE | Authenticated |
| `/audit` | GET | Dean only |

---

## Authentication

### POST /auth
Actions: `email-login`, `google-login`, `signup`, `logout`

**Email Login:**
```json
{ "action": "email-login", "email": "dean@jmc.edu.ph", "password": "admin123" }
```
Returns: `{ success, user, token }`

**Signup:**
```json
{ "action": "signup", "firstName": "John", "lastName": "Doe", "email": "john@jmc.edu.ph", "password": "pass123", "role": "student" }
```

### GET /auth/me
Returns the authenticated user's profile from token.

---

## Users

### GET /users
- **Dean:** returns all users (supports `?role=teacher` filter)
- **Others:** returns own profile

### PATCH /users
Update user fields (name, etc).

---

## Academic Periods

Dean-only. Manages academic years/semesters.

### GET /academic_periods
Returns all periods sorted by start_date DESC.

### POST /academic_periods
```json
{ "name": "1st Sem AY 2025-2026", "academic_year": "2025-2026", "semester": 1, "start_date": "2025-08-01", "end_date": "2025-12-15", "is_active": true }
```
If `is_active: true`, deactivates the current active period and **closes all its evaluation periods**, locking pending evaluations.

### PATCH /academic_periods
```json
{ "id": 1, "is_active": 1 }
```
Same cascade behavior as POST when activating.

### DELETE /academic_periods?id=1

---

## Evaluation Periods

Manages evaluation windows (draft → upcoming → active → closed).

### GET /evaluation_periods
- **Dean:** all periods (supports `?status=active`, `?id=5`)
- **Others:** active periods only
- Returns `form_type` via LEFT JOIN on evaluation_forms

### POST /evaluation_periods
```json
{ "name": "Midterm Eval", "start_date": "2025-10-01", "end_date": "2025-10-15", "status": "draft", "form_id": 1, "academic_period_id": 1, "academic_year": "2025-2026", "semester": "1st Semester", "assignments_json": { "groups": [...] } }
```

### PATCH /evaluation_periods
```json
{ "id": 1, "status": "active", "assignments_json": { "groups": [...] } }
```
- Rejects `form_id` changes on non-draft periods (unless same value)
- Validates status transitions (draft→upcoming→active→closed, active→closed, closed→active)

### DELETE /evaluation_periods?id=1

---

## Evaluations

### GET /evaluations
Query params: `?type=teacher|peer`, `?status=pending|submitted`, `?period_id=1`, `?id=5`, `?role=evaluatee`

- **Dean:** all evaluations with full responses, `is_ghost` flag (true if evaluator is dean)
- **Student:** own evaluations as evaluator (with period_name via JOIN)
- **Teacher:** own evaluations as evaluator; `?role=evaluatee` returns evaluations received

### POST /evaluations
Two modes:

**1. Submit responses:**
```json
{ "evaluationId": 123, "responses": [{ "criteriaId": "q1", "rating": 4, "comment": "Good" }], "comment": "Overall feedback" }
```
- Validates ratings are 1-5
- Checks evaluation period date window (local date comparison)
- Updates status to `submitted`

**2. Bulk generate (Dean):**
```json
{ "action": "generate", "periodId": 1 }
```
- For `student-to-teacher` forms: iterates assignment groups, creates courses, enrollments, and evaluation records
- For `peer-review` forms: generates pairwise evaluations among all active teachers

### PATCH /evaluations
```json
{ "id": 123, "status": "locked" }
```
Dean can lock/unlock any evaluation. Evaluators can only modify own drafts.

### DELETE /evaluations?id=123
Dean-only. Two behaviors:
- **Ghost eval** (evaluator is dean): deletes evaluation + responses entirely
- **Normal eval**: resets to `pending` (clears responses, nullifies submitted_at/score)

---

## Evaluation Sync (JIT Generation)

### POST /evaluations/sync
Called automatically from student/teacher dashboards on mount. No body needed — uses auth token to identify user.

- **Students:** checks active `student-to-teacher` periods, matches user's program/year/section against assignment groups, creates missing evaluation records
- **Teachers:** checks active `peer-review` periods, creates missing pairwise evaluations with all other active teachers

This handles late registrants who enrolled after the dean clicked "Start Evaluation".

---

## Ghost Evaluations

### POST /evaluations/ghost
Dean-only. Creates anonymous evaluations that blend into regular results.
```json
{ "period_id": 1, "evaluatee_id": "user-5", "course_id": 3 }
```
- `course_id` is optional for peer-review periods
- Returns existing evaluation ID if one already exists for this combo
- Evaluation is filled at `/dean/evaluations/fill/[id]`

---

## Forms

Dean-only. Manages evaluation form templates.

### GET /forms
- `?id=1` — returns specific form with criteria and questions
- No params — returns all forms

### POST /forms
```json
{ "name": "Student-Teacher Eval", "description": "...", "type": "student-to-teacher", "criteria": [{ "name": "Teaching", "weight": 30, "questions": [{ "text": "Is the instructor prepared?" }] }] }
```

### PATCH /forms
Update form name, description, criteria, questions.

### DELETE /forms?id=1

---

## Analytics

### GET /analytics
Role-filtered dashboard metrics:
- **Dean:** total users, courses, evaluations, completion rate, top instructors
- **Teacher:** classes taught, student count, average rating, criteria breakdown, performance trends (includes peer evaluations via evaluatee_id)
- **Student:** enrolled courses, evaluation counts, completion rate

---

## Comments

### GET /comments?entity_type=evaluation&entity_id=user-5
Returns anonymous feedback comments for an entity.

### POST /comments
```json
{ "entity_type": "evaluation", "entity_id": "user-5", "content": "Great teacher", "rating": 4.5 }
```

### PATCH /comments
### DELETE /comments?id=abc

---

## Courses

### GET /courses
- **Student:** enrolled courses
- **Teacher:** taught courses with student counts
- **Dean:** all courses

### PATCH /courses
Update course assignments (dean only).

---

## Audit Logs

### GET /audit
Dean-only. Returns action audit trail.

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request / validation error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Server Error |

---

## Evaluation Status Lifecycle

```
pending → draft → submitted → locked
                ↑               ↓
                └───────────────┘  (dean unlock)
```

- `pending`: assigned but not started
- `draft`: in progress (partial responses saved)
- `submitted`: completed by evaluator
- `locked`: locked by dean or by academic period transition

---

Last Updated: March 2026
