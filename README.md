# College Evaluation System (CITE-ES)

A full-stack evaluation management system for academic institutions, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **MySQL**.

It supports:
- Academic period management (years/semesters)
- Evaluation period scheduling
- Course assignments (instructors ↔ courses)
- User roles (student / teacher / dean)
- Evaluation forms and criteria
- Real-time dashboards and analytics

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Database Setup

1. Ensure MySQL is running.
2. Create a database named `cite_es` (or update `.env.local` accordingly).
3. Run database schema + seed:

```bash
# If the project includes a script for this (check scripts folder or README_DATABASE)
# Example:
node ./scripts/import_sql.js
```

(If you don't have a helper script, run the SQL in `database/schema.sql` manually.)

### 3) Configure Environment

Create/verify `.env.local`:

```env
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cite_es
JWT_SECRET=your_secret_here
```

### 4) Run the Development Server

```bash
npm run dev
```

Then open: **http://localhost:3000**

---

## 🗂 Project Structure

- `app/` - Next.js App Router pages and components
  - `app/dean/academic/page.tsx` - Academic management dashboard
  - `app/dean/forms/page.tsx` - Evaluation forms management
- `app/api/` - Backend API routes
  - `app/api/academic_periods/route.ts` - Academic period CRUD
  - `app/api/evaluation_periods/route.ts` - Evaluation period CRUD
  - `app/api/courses/route.ts` - Course assignment CRUD
- `lib/db.ts` - MySQL database helper
- `database/schema.sql` - Database schema structure
- `scripts/` - Utility scripts (migrations, seeds, tools)

---

## 🧭 Common Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run type-check` | Run TypeScript compiler (
no emit) |

---

## 🧩 Key Features

### Academic Management
- Create/edit academic years & semesters
- Activate a single current period
- View period status and date ranges

### Evaluation Scheduling
- Create evaluation windows tied to academic periods
- Track progress through date-based progress bars
- Mark Active/Scheduled/Closed windows

### Course Assignments
- Assign instructors to courses (teacher_id)
- Filter/search by instructor and semester
- Support multiple academic years and sections

---

## 🔧 Notes & Troubleshooting

- If the dev server cannot start, check for stale `.next/dev/lock` and remove it:

```bash
rm -rf .next/dev/lock
```

- If port 3000 is busy, Next.js will auto-switch to the next port.

---

## 🧠 Tips for Development

- Update UI components under `app/components/ui/
- Add API routes under `app/api/`
- Use `useFetch` hook for consistent API requests

---

If you want, I can also generate a `CONTRIBUTING.md` or help make a DB seed script so the app is ready to run with demo data immediately.