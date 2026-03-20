# Database Setup & Management Guide

## Overview
The College Evaluation System uses **MySQL** (via XAMPP) with automated tools for schema management and data population.

**Database Name:** `cite_es`
**Driver:** `mysql2/promise` with connection pooling (10 connections, cached on `globalThis` to survive Next.js HMR)
**Configuration:** `.env.local`

---

## Configuration
Ensure your database credentials are set in `.env.local`:
```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cite_es
JWT_SECRET=your_jwt_secret
```

---

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run db:init` | Full setup: runs `db:migrate` then `db:seed`. |
| `npm run db:migrate` | Creates all tables from `database/schema.sql`. |
| `npm run db:seed` | Populates sample data from `database/cite_es.sql`. |
| `npm run db:admin` | Seeds a default admin account (`admin@jmc.edu.ph` / `admin123`). |
| `npm run db:truncate` | Wipes all row data but **keeps schema intact**. |
| `npm run db:reset` | **Drops all tables** after confirmation (destructive). |
| `npm run db:fix` | Applies incremental schema fixes (`tools/migrate_schema_fixes.js`). |

### Common workflows
```bash
# Fresh install
npm run db:init

# Wipe data only (keep tables), then re-seed
npm run db:truncate && npm run db:seed

# Full nuclear reset (drops tables, recreates, seeds)
npm run db:reset && npm run db:init
```

---

## Default Test Credentials
After running `db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Dean | janette@jmc.edu.ph | admin123 |
| Admin | admin@jmc.edu.ph | admin123 |
| Teacher | ryan@jmc.edu.ph | teacher123 |
| Teacher | marc@jmc.edu.ph | teacher123 |
| Student | ruby@jmc.edu.ph | student123 |
| Student | john@jmc.edu.ph | student123 |
| Student | jane@jmc.edu.ph | student123 |

---

## Table Structure (13 tables)

Defined in `database/schema.sql`:

| Table | Purpose |
|-------|---------|
| `users` | Authentication, roles (student/teacher/dean), program/year/section |
| `academic_periods` | Academic years & semesters (one active at a time) |
| `courses` | Subject-instructor-section assignments per academic term |
| `course_enrollments` | Student-to-course mappings |
| `evaluation_periods` | Evaluation windows with status (draft/upcoming/active/closed), linked to forms and academic periods. Stores assignment groups in `assignments_json`. |
| `evaluations` | Individual evaluation records: who evaluates whom, for which course/period. Status: pending/draft/submitted/locked. |
| `evaluation_forms` | Form templates (student-to-teacher or peer-review) |
| `evaluation_criteria` | Criteria within forms (name, weight, max score) |
| `evaluation_questions` | Questions within criteria |
| `evaluation_responses` | Rating answers (1-5) per question per evaluation |
| `comments` | Anonymous feedback comments (entity-based) |
| `audit_logs` | Action audit trail |
| `sessions` | User session tokens |

### Key relationships
- `evaluation_periods` → `academic_periods` (which semester)
- `evaluation_periods` → `evaluation_forms` (which form template)
- `evaluations` → `evaluation_periods` + `courses` + `users` (evaluator/evaluatee)
- `evaluation_responses` → `evaluations` + `evaluation_questions`
- Cascade deletes: deleting a user cascades to their evaluations; deleting a period cascades to its evaluations.

---

## Connection Pooling (HMR Fix)

`lib/db.ts` stores the MySQL pool on `globalThis` to prevent connection leaks during Next.js hot module reloading. Without this, every file save creates a new pool, eventually hitting MySQL's `max_connections` limit (default 151).

If you see `Too many connections` errors in XAMPP/phpMyAdmin:
1. Stop and restart MySQL in XAMPP
2. Restart the dev server (`npm run dev`)

---

## Troubleshooting

### Connection Errors
- Verify MySQL is running in XAMPP
- Check credentials in `.env.local`
- Ensure the database exists: `CREATE DATABASE IF NOT EXISTS cite_es;`

### "Too many connections"
- Restart MySQL in XAMPP to clear leaked connections
- The `globalThis` pool cache in `lib/db.ts` prevents this from recurring

### Schema out of sync
- Run `npm run db:fix` to apply incremental schema patches
- Or `npm run db:reset && npm run db:init` for a full rebuild
