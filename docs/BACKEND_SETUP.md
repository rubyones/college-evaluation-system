# Backend Setup Guide for CITE-ES

## Prerequisites

1. **XAMPP** - Install from https://www.apachefriends.org/download.html
2. **Node.js** - v18 or higher
3. **npm** - Comes with Node.js

## Step 1: Start XAMPP Services

1. Open XAMPP Control Panel
2. Start **Apache** (should run on port 80, 443)
3. Start **MySQL** (should run on port 3306)

## Step 2: Create Database

1. Open **phpMyAdmin** - Navigate to `http://localhost/phpmyadmin`
2. Click on **SQL** tab
3. Create the database by running:
   ```sql
   CREATE DATABASE cite_es;
   ```
4. Import the schema by:
   - Creating a new connection to the `cite_es` database
   - Running the contents of `database/schema.sql`

Or use command line:
```bash
mysql -h localhost -u root -p < database/schema.sql
```

(Password is empty by default for root user in XAMPP)

## Step 3: Install Dependencies

```bash
npm install
```

Key packages needed:
- `mysql2` - MySQL database driver
- `jsonwebtoken` - JWT token generation
- `bcrypt` - Password hashing (for production)

## Step 4: Configure Environment

Update `.env.local`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cite_es
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

## Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth` - Authentication endpoint
  - Action: `google-login` - Google OAuth login
  - Action: `signup` - Create new account
  - Action: `logout` - Sign out user

### User Profile
- `GET /api/users` - Get current user profile
- `PATCH /api/users` - Update user profile

### Courses
- `GET /api/courses` - Get user's courses (student view) or all courses (dean view)

### Evaluations
- `GET /api/evaluations` - Get evaluations for current user
- `POST /api/evaluations` - Submit evaluation responses

### Analytics
- `GET /api/analytics` - Get dashboard analytics

## Database Schema

The design includes:
- **users** - User accounts (student, teacher, dean)
- **sessions** - User sessions with JWT tokens
- **courses** - Course information
- **course_enrollments** - Student enrollments
- **evaluations** - Evaluation instances
- **evaluation_criteria** - Evaluation rubric criteria
- **evaluation_responses** - Student responses
- **academic_periods** - Semester definitions
- **audit_logs** - Security audit trail

## Testing API Endpoints

Use **Postman** or **curl**:

```bash
# Google Login
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "google-login",
    "googleToken": "test-token"
  }'

# Sign Up
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "signup",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@jmc.edu.ph",
    "jmcId": "12345678",
    "password": "SecurePassword123",
    "role": "student"
  }'

# Get User Profile
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/users
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running in XAMPP
- Check credentials in `.env.local`
- Verify database `cite_es` exists

### JWT Token Error
- Ensure `JWT_SECRET` is set in `.env.local`
- Clear browser cache and login again

### CORS Issues
- Add CORS middleware to API routes if accessing from different domain
- For localhost development, this shouldn't be an issue

## Production Deployment

Before deploying to production:

1. Install `bcrypt` for password hashing:
   ```bash
   npm install bcrypt
   ```

2. Update password hashing in signup endpoint

3. Change `JWT_SECRET` to a strong random value

4. Use environment variables from hosting provider

5. Configure MySQL with strong password

6. Enable HTTPS

7. Add rate limiting middleware

8. Setup actual Google OAuth credentials

## Next Steps

1. Run the SQL schema to initialize the database
2. Start the development server
3. Test login with test account (test.user@jmc.edu.ph)
4. Update frontend components to use API endpoints
5. Configure real Google OAuth credentials
