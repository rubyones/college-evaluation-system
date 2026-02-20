# College Evaluation System - Quick Start Guide

This guide shows you how to set up and run the College Evaluation System locally.

## Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)
  - Or use **XAMPP** for an all-in-one setup - [Download](https://www.apachefriends.org/)

## Step 1: Setup MySQL Database

### Option A: Using XAMPP (Easiest)

1. **Start XAMPP Control Panel**
   - Open XAMPP
   - Click "Start" next to Apache and MySQL

2. **Open phpMyAdmin**
   - Go to http://localhost/phpmyadmin in your browser
   - Default credentials: username=`root`, password=empty

3. **Create the database**
   - Click "New" in the left panel
   - Database name: `college_db`
   - Click "Create"

### Option B: Using MySQL Client

```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE college_db;
```

## Step 2: Clone and Install Dependencies

```bash
# Navigate to the project directory
cd college_of_information_technology2

# Install Node dependencies
npm install
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=college_db
JWT_SECRET=your-secret-key-here
```

**Note:** If your MySQL has a password, update `DB_PASSWORD` accordingly.

## Step 4: Import Database Schema

```bash
# Navigate to the project directory (if not already there)
cd college_of_information_technology2

# Run the importer to create tables and populate sample data
node tools/import_sql.js
```

**Expected output:** `IMPORT_OK`

## Step 5: Start the Development Server

```bash
# Start the Next.js dev server
npm run dev
```

**Expected output:**
```
✓ Ready in 2.3s
- Local:         http://localhost:3002
- Network:       http://192.168.x.x:3002
```

The port may differ (3000, 3001, 3002, etc.) if other services are running.

## Step 6: Access the Application

Open your browser and go to:
```
http://localhost:3002
```

(Replace `3002` with the actual port shown in your terminal)

## Step 7: Login with Test Credentials

The system comes with sample users for testing:

### Student Account
- **Email:** `rubygrace.ones@jmc.edu.ph`
- **Password:** `student123`

### Teacher Account
- **Email:** `ryan.billera@jmc.edu.ph`
- **Password:** `teacher123`

### Dean/Admin Account
- **Email:** `janette.claro@jmc.edu.ph`
- **Password:** `admin123`

## Common Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Run Type Checking
```bash
npx tsc --noEmit
```

### Lint Code
```bash
npm run lint
```

### Re-import Database (clears and recreates all tables)
```bash
node tools/import_sql.js
```

### Verify Database Contents
```bash
node tools/verify_db.js
```

### Test Comment Creation (E2E)
```bash
node tools/e2e_create_comment.js
```

## Project Structure

```
college_of_information_technology2/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── comments/             # Comments CRUD operations
│   │   ├── courses/              # Course management
│   │   ├── evaluations/          # Evaluation endpoints
│   │   └── users/                # User endpoints
│   ├── student/                  # Student routes
│   ├── teacher/                  # Teacher routes
│   └── dean/                     # Dean/Admin routes
├── components/                   # Reusable React components
├── context/                      # Context API (AuthContext)
├── lib/                          # Utility libraries
│   └── db.ts                     # MySQL connection pool
├── tools/                        # Utility scripts
│   ├── import_sql.js            # Database importer
│   ├── verify_db.js             # Database verifier
│   └── e2e_create_comment.js    # E2E test for comments
├── database_setup.sql           # Database schema & sample data
├── .env.local                   # Environment variables (create this)
└── package.json                 # Dependencies
```

## Troubleshooting

### Port Already in Use
If port 3000-3002 is in use:
- The server will automatically use the next available port
- Check your terminal output for the actual port

### MySQL Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solutions:**
- Make sure MySQL is running (check XAMPP Control Panel)
- Verify credentials in `.env.local`
- Check that `college_db` database exists

### Database Import Fails
```bash
# Clear and reimport
node tools/import_sql.js
```

### JWT Token Errors
- Make sure `JWT_SECRET` is set in `.env.local`
- Default value is `'secret'` if not provided

### TypeScript Errors
Run the type checker:
```bash
npx tsc --noEmit
```

This will show all type issues.

## Database Features

### Available Tables
- **users** - User accounts and authentication
- **courses** - Course information and instructor assignments
- **enrollments** - Student enrollment in courses
- **evaluations** - Teacher evaluations
- **evaluation_responses** - Evaluation question responses
- **comments** - Generic comments on courses, evaluations, and users
- **audit_logs** - User activity tracking
- **sessions** - Active user sessions

### Sample Data
The database comes pre-populated with:
- 6 users (3 students, 2 teachers, 1 dean)
- 4 courses
- 7 course enrollments
- 3 evaluations
- 5 evaluation responses
- 3 sample comments

## API Endpoints (Key Routes)

### Authentication
- `POST /api/auth` - Login, signup, logout
  - Actions: `email-login`, `google-login`, `signup`, `logout`

### Comments
- `GET /api/comments?entity_type=course&entity_id=course-1` - List comments
- `POST /api/comments` - Create comment (requires auth)
- `PATCH /api/comments` - Update comment (author or dean only)
- `DELETE /api/comments?id=<id>` - Delete comment (author or dean only)

### Users
- `GET /api/users` - Get current user profile (requires auth)
- `PATCH /api/users` - Update user profile (requires auth)

### Courses
- `GET /api/courses` - List courses for logged-in user

### Evaluations
- `POST /api/evaluations` - Submit evaluation (requires auth)

## Next Steps

1. Explore the student dashboard at `/student/dashboard`
2. Try creating evaluations at `/student/evaluations`
3. Add comments on courses and evaluations
4. Switch roles to explore teacher and dean views
5. Check the database with `npx node tools/verify_db.js`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `.env.local` configuration
3. Verify MySQL is running
4. Check terminal output for error messages
