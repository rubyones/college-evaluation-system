# 🗄️ Database Setup Guide

## Overview

The College Evaluation System uses **MySQL** with automated migration and seeding tools to manage the database schema and sample data.

**Database:** `cite_es`  
**Configuration:** `.env.local`

---

## Configuration

The database connection is configured in `.env.local`:

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cite_es
```

Update these values based on your MySQL installation.

---

## Database Management Commands

### 1. **Initialize Database (Create Tables + Seed Data)**
```bash
npm run db:init
```

Runs migration and seeding sequentially:
- ✅ Creates all tables if they don't exist
- ✅ Inserts sample data (users, courses, enrollments, etc.)
- ⏩ Safe to run multiple times

**First time setup:**
```bash
npm run db:init
```

### 2. **Migrate Tables Only**
```bash
npm run db:migrate
```

Creates all required tables in the database.
- Skips tables that already exist
- Safe to run multiple times

### 3. **Seed Sample Data**
```bash
npm run db:seed
```

Populates the database with:
- 6 users (3 students, 2 teachers, 1 dean)
- 4 courses
- 7 enrollments
- Sample evaluations
- Academic periods

**Note:** Only runs if tables are empty (prevents duplicate seed)

### 4. **Reset Database (⚠️ Destructive)**
```bash
npm run db:reset
```

**WARNING:** Deletes all data and rebuilds the database!

1. Drops all tables
2. Prompts for confirmation
3. Requires you to type "yes"
4. After reset, run `npm run db:init`

---

## Table Structure

### Users
- `id`: Primary key (UUID)
- `name`, `email`, `password`
- `role`: 'student', 'teacher', 'dean'
- Timestamps: `created_at`, `updated_at`

### Courses
- `id`: Primary key (UUID)
- `code`: Unique course code
- `name`, `description`, `credits`, `semester`
- `instructor_id`: Foreign key to users

### Enrollments
- Links students to courses
- `student_id`, `course_id`
- Unique constraint prevents duplicate enrollments

### Evaluations
- `id`: Primary key (UUID)
- `course_id`, `evaluatee_id`, `evaluator_id`
- `evaluation_type`: 'teacher', 'peer', 'self'
- `status`: 'draft', 'submitted', 'locked'
- Timestamps: `submitted_at`, `locked_at`, `created_at`

### Evaluation Responses
- `evaluation_id`: Foreign key
- `criteria_id`
- `rating`: 1-5 scale
- `comment`: Text feedback

### Supporting Tables
- `academic_periods`: Semester information
- `evaluation_periods`: Evaluation windows
- `evaluation_criteria`: Rating criteria definitions
- `evaluation_forms`: Form templates
- `comments`: Generic comment system
- `audit_logs`: Activity tracking
- `sessions`: Active sessions/tokens

---

## Default Test Users

After seeding, use these credentials to test:

| Role | Email | Password |
|------|-------|----------|
| 👨‍🎓 Student | ruby@jmc.edu.ph | student123 |
| 👩‍🎓 Student | john@jmc.edu.ph | student123 |
| 👩‍🎓 Student | jane@jmc.edu.ph | student123 |
| 👨‍🏫 Teacher | ryan@jmc.edu.ph | teacher123 |
| 👨‍🏫 Teacher | marc@jmc.edu.ph | teacher123 |
| 👨‍💼 Dean | janette@jmc.edu.ph | admin123 |

---

## Schema Files

### Location: `database/schema.sql`

Contains:
- Core table definitions
- Foreign key relationships
- Indexes for performance
- All with `IF NOT EXISTS` conditions

The schema is automatically executed by the migration script.

---

## Migration Scripts

Located in `tools/`:

### `migrate.js`
- Reads `database/schema.sql`
- Executes each statement
- Reports success/failures
- Lists all created tables

### `seed.js`
- Inserts sample data
- Generates UUIDs for consistency
- Checks if data exists (prevents duplicates)
- Displays default test credentials

### `reset.js`
- Drops all tables
- Requires confirmation
- Safely clears database

---

## Workflow Examples

### Fresh Setup
```bash
# Install dependencies
npm install

# Run migrations + seed
npm run db:init

# Start development server
npm run dev
```

### After Schema Changes
```bash
# Update database/schema.sql
# Then run migration
npm run db:migrate
```

### Start Fresh
```bash
# Reset and reinitialize
npm run db:reset
# (Answer "yes" when prompted)
npm run db:init
```

---

## Troubleshooting

### "Connection refused"
- Ensure MySQL is running
- Check `DB_HOST` and port (default 3306)
- Verify credentials in `.env.local`

### "Unknown database 'cite_es'"
- MySQL database doesn't exist
- Manually create: `CREATE DATABASE cite_es;`
- Or it will be auto-created by Next.js on first migration

### "Table already exists"
- Expected message during migration
- Safely skips existing tables
- No action needed

### "Access denied"
- Check `DB_USER` and `DB_PASSWORD`
- Verify MySQL user permissions
- Ensure user can create tables

### Clear Stuck Data
```bash
# Full reset
npm run db:reset
npm run db:init
```

---

## Notes

- ✅ All tools use connection pooling for efficiency
- ✅ Foreign key relationships prevent data corruption
- ✅ UUIDs used for cross-system compatibility
- ✅ Timestamps automatically managed by MySQL
- ✅ Indexes improve query performance
- ✅ Safe to run migration multiple times (idempotent)

---

## Next Steps

1. ✅ Run `npm run db:init`
2. ✅ Run `npm run dev`
3. ✅ Login with test credentials
4. ✅ Start evaluating!

