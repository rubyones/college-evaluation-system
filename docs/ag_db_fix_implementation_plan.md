# Data Consolidation & Course-Subject Fix — Implementation Plan

## The Problem

There are **3 conflicting definitions** of "courses/subjects" in this project, which is why the evaluation setup can't find matching data.

### Conflict Map

| Source | Table | ID Type | Teacher Column | Extra Columns | Has Data? |
|--------|-------|---------|----------------|---------------|-----------|
| [cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql) (live DB) | `courses` | `int(11)` auto-inc | `teacher_id` | `section`, `academic_year` | ✅ via [seed.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/seed.js) |
| [schema.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/schema.sql) (migration) | `courses` | `VARCHAR(36)` UUID | `instructor_id` | `credits` | ❌ empty |
| [subjects.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/subjects.sql) (standalone) | `subjects` | `VARCHAR(36)` UUID | *(none)* | `course_program`, `year_level` | ❌ never imported |

### Why it breaks

1. **[seed.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/seed.js)** inserts courses with `teacher_id` and `int` IDs (matching [cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql))
2. **`/api/courses` GET (student role)** queries `c.instructor_id` (matching [schema.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/schema.sql)) — **column doesn't exist** in the live DB
3. **`/api/subjects`** queries a `subjects` table that **doesn't exist** in the live DB (never imported)
4. **[schema.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/schema.sql)** and **[cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql)** define the `courses` table with **incompatible column names and ID types**

---

## Tools Audit

| Tool | What it does | Uses |
|------|-------------|------|
| [migrate.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/migrate.js) | Runs [database/schema.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/schema.sql) statement-by-statement | [schema.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/schema.sql) |
| [seed.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/seed.js) | Runs [cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql) bulk, then inserts courses + enrollments | [cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql) |
| [reset.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/reset.js) | Drops ALL tables (with confirmation prompt) | — |
| [import_sql.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/import_sql.js) | Drops specific tables, imports an external SQL file | Legacy, references `../../database_setup.sql` (doesn't exist) |
| [verify_db.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/verify_db.js) | Reads sample users + comments | Diagnostic |
| [inspectUsers.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/inspectUsers.js) | Reads all users | Diagnostic |
| [e2e_create_comment.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/e2e_create_comment.js) | Creates a test comment | E2E test |
| [generateToken.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/generateToken.js) | Generates a JWT | Utility |

> [!WARNING]
> [migrate.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/migrate.js) creates tables from [schema.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/schema.sql), but [seed.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/seed.js) uses [cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql) which creates its **own** table definitions. Running both causes conflicts because they define the same tables differently.

---

## Proposed Fix

### Strategy: **cite_es.sql is truth → align everything to it**

The [cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql) dump came from the actual running database, so its table definitions represent the real state. We should:

1. **Update [schema.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/schema.sql)** to match [cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql)'s `courses` table (use `teacher_id`, `int` IDs, add `section`/`academic_year`)
2. **Delete [subjects.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/subjects.sql)** — it's a dead file never imported into the DB
3. **Delete `/api/subjects` route** — it queries a non-existent table; the eval-setup already uses `/api/courses`
4. **Fix `/api/courses` GET (student role)** — change `instructor_id` → `teacher_id` in the SQL query
5. **Delete [import_sql.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/import_sql.js)** — references a non-existent file, redundant with [seed.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/seed.js)
6. **Update [seed.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/seed.js)** — add curriculum metadata fields (`course_program`, `year_level`) to course inserts so courses can be filtered by program/year in the eval-setup UI

---

## Detailed Changes

### 1. [database/schema.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/schema.sql) — Align `courses` table

```diff
 CREATE TABLE IF NOT EXISTS courses (
-  id VARCHAR(36) PRIMARY KEY,
+  id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   code VARCHAR(50) UNIQUE NOT NULL,
-  instructor_id VARCHAR(36),
+  teacher_id VARCHAR(36),
   description TEXT,
-  credits INT DEFAULT 3,
-  semester VARCHAR(50),
+  section VARCHAR(10) DEFAULT NULL,
+  academic_year VARCHAR(10) DEFAULT NULL,
+  semester INT DEFAULT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
+  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
+  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
 );
```

Also update `course_enrollments` to use `INT` for `course_id`:
```diff
 CREATE TABLE IF NOT EXISTS course_enrollments (
-  id VARCHAR(36) PRIMARY KEY,
+  id INT AUTO_INCREMENT PRIMARY KEY,
   student_id VARCHAR(36) NOT NULL,
-  course_id VARCHAR(36) NOT NULL,
+  course_id INT NOT NULL,
```

---

### 2. [app/api/courses/route.ts](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/api/courses/route.ts) — Fix student query

```diff
 // Student query — line 67
-  c.instructor_id,
-  u.name as instructor_name
+  c.teacher_id,
+  u.name as instructor_name
 FROM courses c
 INNER JOIN course_enrollments e ON c.id = e.course_id
-LEFT JOIN users u ON c.instructor_id = u.id
+LEFT JOIN users u ON c.teacher_id = u.id
```

---

### 3. Delete dead files

- ❌ [database/subjects.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/subjects.sql) — never imported, table doesn't exist
- ❌ [app/api/subjects/route.ts](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/app/api/subjects/route.ts) — queries non-existent `subjects` table
- ❌ [tools/import_sql.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/import_sql.js) — references non-existent `../../database_setup.sql`

---

### 4. [tools/seed.js](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/tools/seed.js) — Add curriculum metadata to courses

Add `course_program` and `year_level` columns to course inserts. This requires first adding the columns to [cite_es.sql](file:///c:/Users/eirmo/Documents/freelance_systems/college-evaluation-system/database/cite_es.sql)'s courses table via an ALTER in seed.js:

```sql
ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS course_program ENUM('BSIT','BSEMC') DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS year_level INT DEFAULT NULL;
```

Then update the INSERT to include program/year:

```sql
INSERT IGNORE INTO courses (code, name, description, teacher_id, section, academic_year, semester, course_program, year_level)
VALUES
  ('IT101', 'Introduction to Computing', '...', 'teacher-1', 'A', '2025-2026', 2, 'BSIT', 1),
  ('EMC101', 'Game Design', '...', 'af950cb1-...', 'A', '2025-2026', 2, 'BSEMC', 2),
  -- etc
```

---

## Agent Slice Updates

This changes the previous plan — **Slice 1 must start with this data fix first** before any UI wiring.

| Order | Task | Slice |
|-------|------|-------|
| 0 | **Fix schema/data conflicts** (this plan) | Pre-slice (do first) |
| 1 | Wire eval-setup Save/Start buttons | 🔵 Slice 1 |
| 2 | Student eval form from active period | 🟢 Slice 2 |
| 3 | Teacher anonymous feedback + peer eval | 🟠 Slice 3 |

---

## Verification

After applying these changes:
1. `npm run db:reset` → `npm run db:init` should complete without errors
2. `SELECT * FROM courses` should show 8 courses with `teacher_id`, `course_program`, `year_level`
3. Login as dean → Evaluation Setup should show real courses from DB
4. Login as student → `/api/courses` should return enrolled courses (no SQL error)
