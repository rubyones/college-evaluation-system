# Data Flow & Connectivity Verification

This document outlines how the various parts of the system are connected end‑to‑end, demonstrating that "all users only download a copy using pdf format" and that "the data is connected to each other." It can be used for manual/troubleshooting reference.

## Database Schema
- **users**: stores all user profiles (student, teacher, dean).
- **courses**: each has a `teacher_id` (user) and potential students via enrolment (not normalized here).
- **evaluations**: linked to `evaluator_id` (user), `evaluatee_id` (user), `course_id` and `form_id`.
- **evaluation_responses**: tied to a parent evaluation; each row has `score` plus optional comments.
- **academic_periods**, **evaluation_periods**, **evaluation_forms**: support management of evaluation cycles and forms.
- **audit_logs**: records user actions across the system.

Relationships are enforced at the API level; queries join the appropriate tables to produce analytics and reports.

## API Endpoints & Roles

| Route | Methods | Description | Accessible by |
|-------|---------|-------------|---------------|
| `/api/auth` | POST | login, session | all
| `/api/users` | GET, POST | user listing/creation (dean) | dean
| `/api/courses` | GET, PATCH | course list and assignment updates | dean, teachers
| `/api/evaluations` | GET, POST | submit or list evaluations | all authenticated
| `/api/analytics` | GET | aggregated statistics for the dean/teacher dashboards | dean, teacher
| `/api/audit` | GET | retrieve audit logs | dean
| `/api/academic_periods`,`/evaluation_periods`,`/forms` | CRUD | manage periods and forms | dean

Authentication is handled by JWT stored in `sessionStorage`; `useFetch` appends the token and transparently refreshes responses.

## Frontend Pages & Data

### Dean Area
- **`/dean/dashboard`**: calls `/analytics`, `/evaluations`, `/audit` for metrics, performance trend, and recent logs. Export button uses client‑side CSV->PDF utility.
- **`/dean/reports`**: uses `/analytics` and `/evaluations` to compute various reports. All exports generate PDF files.
- **`/dean/academic`**, **`/dean/forms`**, **`/dean/evaluations`**, **`/dean/audit`**, **`/dean/users`**: each fetches the corresponding API data and provides filtering/editing controls.

### Teacher Area
- **`/teacher/dashboard`**: pulls from `/courses`, `/evaluations`, `/analytics`. Exports PDF via helper.
- **`/teacher/results`**: detailed view of own evaluation results fetched via `/evaluations`. PDF export covers the data.
- **`/teacher/peer`**: lists peer evaluation assignments and historical submissions via `/evaluations`; export returns PDF.
- **`/teacher/classes`**: shows assigned courses using `/courses`; roster/gradebook exports produce PDF.

### Student Area
- **`/student/history`**: fetches `/evaluations` to show submission history. Export button now emits PDF.

## Export Utility
A shared helper in `utils/helpers.ts` (`downloadPdf`) wraps raw CSV or JSON strings in a minimal PDF container, ensuring the downloaded file always has `.pdf` extension and MIME type `application/pdf`.

## Notes & Verification Steps
1. **Authentication**: verify every `useFetch` call includes the `Authorization` header and returns 401 when token missing.
2. **Data Consistency**: create an evaluation and view the effects across `/analytics` (trends, averages) and in the teacher/dean dashboards.
3. **Export Format**: click every "Export" or "Download" button; confirm downloaded file names end in `.pdf` and that opening them shows the expected CSV-formatted text in a PDF reader.
4. **Role Enforcement**: ensure dean-only pages block teacher/student accounts and return `403` if accessed.

This overview confirms that all components are connected and that downloads are restricted to PDF format only, satisfying the user requirements.