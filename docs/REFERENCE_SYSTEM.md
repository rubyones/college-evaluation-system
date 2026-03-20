# Reference Faculty Evaluation System — Documentation

> Source: `C:\xampp\htdocs\faculty-evaluation-system`  
> Stack: PHP 8 + MySQL (MariaDB) + AdminLTE + jQuery/AJAX  
> Purpose: Document how this working system operates so our Next.js system can mirror its proven patterns.

---

## Database Schema (11 tables)

### Core Entities

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `academic_list` | Academic periods (semesters) | `year`, `semester`, `is_default`, `status` (0=Pending, 1=Started, 2=Closed) |
| `class_list` | Sections/classes | `curriculum` (e.g. BSIT), `level` (e.g. 1st Year), `section` (e.g. A) |
| `subject_list` | Subjects | `code`, `subject` (name), `description` |
| `faculty_list` | Faculty/teachers | `school_id`, `firstname`, `lastname`, `email`, `password`, `status` |
| `student_list` | Students | `school_id`, `firstname`, `lastname`, `email`, `password`, `class_id` (FK → class_list), `type` (regular/irregular), `status` |
| `users` | Admin accounts | `firstname`, `lastname`, `email`, `password` |

### Evaluation Mechanism

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `restriction_list` | **THE CORE LINK** — assigns faculty+class+subject per academic period | `academic_id`, `faculty_id`, `class_id`, `subject_id`, `type` (regular/irregular), `student_id` (for irregular) |
| `criteria_list` | Evaluation criteria categories | `criteria` (name), `order_by`, `type` (checklist/textfield) |
| `question_list` | Questions under criteria | `academic_id`, `question`, `criteria_id` (FK), `order_by`, `type` |
| `evaluation_list` | Submitted evaluations (one per student-faculty-subject combo) | `academic_id`, `class_id`, `student_id`, `subject_id`, `faculty_id`, `restriction_id`, `date_taken` |
| `evaluation_answers` | Individual question ratings | `evaluation_id` (FK), `question_id` (FK), `rate` (1-5), `comment` |
| `irregular_enrollments` | Per-student enrollment for irregular students | `student_id`, `subject_id`, `class_id`, `faculty_id`, `academic_id`, `restriction_id` |

### Entity Relationships

```
academic_list (1 active at a time via is_default=1)
  ├── restriction_list (N per academic period)
  │     ├── faculty_id → faculty_list
  │     ├── class_id → class_list
  │     └── subject_id → subject_list
  │
  ├── question_list (N per academic period)
  │     └── criteria_id → criteria_list
  │
  ├── evaluation_list (N per academic period)
  │     ├── student_id → student_list
  │     ├── faculty_id → faculty_list
  │     ├── subject_id → subject_list
  │     ├── class_id → class_list
  │     └── restriction_id → restriction_list
  │
  └── irregular_enrollments (N per academic period)
        ├── student_id → student_list
        ├── faculty_id → faculty_list
        ├── subject_id → subject_list
        ├── class_id → class_list
        └── restriction_id → restriction_list

student_list.class_id → class_list (regular students belong to one class)
evaluation_answers.evaluation_id → evaluation_list
evaluation_answers.question_id → question_list
```

---

## How It Works — Complete Flow

### 1. Admin Setup Phase

**Step 1: Create Academic Period**
- Admin creates an entry in `academic_list` (e.g. "2025-2026", semester 1)
- Sets `is_default = 1` to make it the active period
- Status cycle: `0 (Pending)` → `1 (Started)` → `2 (Closed)`
- Only one academic period is "default" at a time — all queries use `WHERE is_default = 1`

**Step 2: Manage Classes**
- Admin creates entries in `class_list`: curriculum + level + section
- Example: `BSIT`, `1st Year`, `A` → displayed as "BSIT 1st Year - A"
- These are reusable across academic periods

**Step 3: Manage Subjects**
- Admin creates entries in `subject_list`: code + name + description
- Example: `IT101`, `Introduction to Computing`, `...`
- Also reusable across periods

**Step 4: Manage Faculty**
- Admin creates faculty accounts with school_id, name, email, password
- Faculty can be activated/deactivated via `status` column

**Step 5: Manage Students**
- Admin creates student accounts
- Each regular student is assigned a `class_id` (their section)
- Students can be `regular` or `irregular` type

**Step 6: Create Questionnaire**
- Admin manages `criteria_list` (e.g. "Teaching Methodology", "Classroom Management")
- Each criteria has ordered questions in `question_list`
- Questions are **tied to an academic period** (`academic_id`) — different periods can have different questions
- Questions support two types: `checklist` (1-5 radio rating) and `textfield` (free-text comment)

**Step 7: Create Restrictions (THE KEY STEP)**
- Admin opens "Manage Restrictions" for an academic period
- Selects: **Faculty** + **Class (section)** + **Subject** → adds to list
- Each restriction row means: "This faculty teaches this subject to this class this semester"
- This is what determines **who evaluates whom**:
  - Regular students evaluate all faculty-subject combos for their assigned class
  - Irregular students are enrolled individually via `irregular_enrollments`

### 2. Evaluation Phase

**Step 8: Admin starts the period**
- Sets `academic_list.status = 1` (Started)
- Students can now submit evaluations

**For Regular Students:**
1. System queries `restriction_list WHERE class_id = student.class_id AND academic_id = active_period`
2. Filters out already-evaluated ones: `WHERE restriction_id NOT IN (SELECT restriction_id FROM evaluation_list WHERE student_id = ...)`
3. Shows faculty carousel — student picks one, answers all questions (rated 1-5 per question)
4. On submit: creates `evaluation_list` row + `evaluation_answers` rows for each question

**For Irregular Students:**
1. System queries `irregular_enrollments` for this student + period
2. Student selects faculty → subject → section from cascading dropdowns
3. System validates the combination exists in restrictions
4. Same question form + submission flow

**Evaluation Record:**
```
evaluation_list:
  evaluation_id (auto)
  academic_id         → which semester
  class_id            → which section
  student_id          → who evaluated
  subject_id          → for which subject
  faculty_id          → which teacher
  restriction_id      → links back to the assignment
  date_taken          → timestamp

evaluation_answers (one per question):
  evaluation_id → parent evaluation
  question_id   → which question
  rate          → 1-5 (or text for textfield type)
  comment       → optional text
```

### 3. Results & Reports

**Faculty view:**
- Faculty sees their evaluation results per academic period
- Average ratings per criteria, per subject
- Anonymous — cannot see which student rated what

**Admin report:**
- Full report per faculty, per academic period
- Aggregated ratings across all students
- Can filter by faculty, class, subject

---

## Key Design Patterns to Adopt

### 1. The "Restriction" Pattern (Assignment Mechanism)
**What it is:** `restriction_list` is the central linking table that assigns faculty+subject+class per academic period. This is the equivalent of our `assignments_json` but properly normalized.

**Why it matters:** Instead of generating evaluations upfront, the reference system determines who should evaluate whom **at query time** by joining restrictions with student class membership.

**Our equivalent mapping:**
| Reference System | Our System |
|----------|-----------|
| `restriction_list` | Should become a proper `evaluation_assignments` table |
| `academic_list` | `academic_periods` (already exists) |
| `class_list` | **Missing** — we derive from `users.course + year_level + section` |
| `subject_list` | `curriculum.ts` (hardcoded) + `courses` table |
| `evaluation_list` | `evaluations` table |
| `evaluation_answers` | `evaluation_responses` table |

### 2. Regular vs Irregular Student Handling
- Regular students: auto-matched to evaluations via their `class_id`
- Irregular students: manually enrolled per subject via `irregular_enrollments`
- Both stored in same student table with a `type` field
- Evaluation page shows different UI based on student type

### 3. Academic Period as Top-Level Scope
- Everything is scoped to the active academic period
- Period stored in session on login (`$_SESSION['academic']`)
- All queries filter by `academic_id`
- Status controls access: Pending (no eval), Started (eval open), Closed (eval locked)

### 4. Question Versioning
- Questions are tied to `academic_id` — each period can have different questions
- Criteria are global but questions under them are period-specific
- This means changing questions doesn't affect past evaluation data

---

## Admin Pages Reference

| Page | Purpose |
|------|---------|
| `admin/home.php` | Dashboard with stats |
| `admin/academic_list.php` | CRUD for academic periods + set default + manage status |
| `admin/class_list.php` | CRUD for classes (curriculum + level + section) |
| `admin/subject_list.php` | CRUD for subjects |
| `admin/faculty_list.php` | CRUD for faculty with activation/deactivation |
| `admin/student_list.php` | CRUD for students with class assignment + type |
| `admin/criteria_list.php` | CRUD for evaluation criteria with drag-reorder |
| `admin/questionnaire.php` | CRUD for questions per criteria per academic period |
| `admin/manage_restriction.php` | **THE KEY PAGE** — assign faculty+class+subject to academic period |
| `admin/manage_irregular_enrollments.php` | Enroll irregular students per subject |
| `admin/evaluation.php` | View submitted evaluations |
| `admin/report.php` | Generate faculty evaluation reports |
| `admin/send_reminders.php` | Send evaluation reminders |

---

## What We Should Copy

1. **`class_list` table concept** — explicit classes instead of deriving from user fields
2. **`restriction_list` pattern** — normalized assignment table (faculty+class+subject+period)
3. **Regular/irregular student dual path** — proven UX pattern
4. **Period status controls** — Pending/Started/Closed gates access
5. **Questions tied to academic period** — allows questionnaire changes without breaking history
6. **Evaluation deduplication** — `NOT IN (SELECT restriction_id FROM evaluation_list ...)` prevents double-evaluation
