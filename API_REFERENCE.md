# CITE-ES API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require Bearer token:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### 1. Google Login
**Login with Google OAuth**

```http
POST /auth
Content-Type: application/json

{
  "action": "google-login",
  "googleToken": "string"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@jmc.edu.ph",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (403)**
```json
{
  "error": "Access denied. Please use your official JMC institutional account."
}
```

---

### 2. Sign Up
**Create new student or teacher account**

```http
POST /auth
Content-Type: application/json

{
  "action": "signup",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@jmc.edu.ph",
  "jmcId": "12345678",
  "password": "SecurePassword123",
  "role": "student"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email to verify your account."
}
```

**Error Response (403)**
```json
{
  "error": "Dean accounts cannot be created through signup"
}
```

---

### 3. Logout
**Invalidate user session**

```http
POST /auth
Content-Type: application/json

{
  "action": "logout",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### 1. Get User Profile
**Retrieve authenticated user's information**

```http
GET /users
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200)**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@jmc.edu.ph",
    "role": "student",
    "jmcId": "12345678"
  }
}
```

**Error Response (401)**
```json
{
  "error": "Unauthorized"
}
```

---

### 2. Update User Profile
**Update user's name information**

```http
PATCH /users
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Success Response (200)**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "john.doe@jmc.edu.ph",
    "role": "student"
  }
}
```

---

## Courses Endpoints

### 1. Get Courses
**Get courses based on user role**

```http
GET /courses
Authorization: Bearer <JWT_TOKEN>
```

**Student Response (200)** - Gets enrolled courses
```json
{
  "courses": [
    {
      "id": 1,
      "course_code": "IT-101",
      "course_name": "Introduction to Programming",
      "teacher_name": "Dr. John Smith",
      "semester": 1,
      "year": 2025
    }
  ],
  "total": 1
}
```

**Teacher Response (200)** - Gets taught courses
```json
{
  "courses": [
    {
      "id": 1,
      "course_code": "IT-101",
      "course_name": "Introduction to Programming",
      "semester": 1,
      "year": 2025,
      "description": "Learn programming basics",
      "student_count": 35
    }
  ],
  "total": 1
}
```

**Dean Response (200)** - Gets all courses
```json
{
  "courses": [
    {
      "id": 1,
      "course_code": "IT-101",
      "course_name": "Introduction to Programming",
      "teacher_name": "Dr. John Smith",
      "semester": 1,
      "year": 2025
    }
  ],
  "total": 1
}
```

---

## Evaluations Endpoints

### 1. Get Evaluations
**List evaluations for user**

```http
GET /evaluations?status=pending
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `status` (optional): Filter by status - `pending`, `submitted`, `all`

**Success Response (200)**
```json
{
  "evaluations": [
    {
      "id": 1,
      "course_id": 5,
      "course_name": "Data Structures",
      "teacher_id": 2,
      "teacher_name": "Dr. Smith",
      "status": "pending",
      "created_at": "2025-01-15T10:30:00Z",
      "due_date": "2025-12-25T23:59:59Z",
      "responses_submitted": 2,
      "total_criteria": 3
    }
  ],
  "total": 1
}
```

---

### 2. Submit Evaluation
**Submit evaluation responses**

```http
POST /evaluations
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "evaluationId": 1,
  "responses": [
    {
      "criterionId": 1,
      "score": 4
    },
    {
      "criterionId": 2,
      "score": 5
    },
    {
      "criterionId": 3,
      "score": 3
    }
  ]
}
```

**Success Response (200)**
```json
{
  "success": true,
  "message": "Evaluation submitted successfully"
}
```

**Error Response (404)**
```json
{
  "error": "Evaluation not found"
}
```

---

## Analytics Endpoints

### 1. Get Dashboard Analytics
**Get role-specific dashboard metrics**

```http
GET /analytics
Authorization: Bearer <JWT_TOKEN>
```

**Student Response (200)**
```json
{
  "success": true,
  "analytics": {
    "enrolledCourses": 5,
    "totalEvaluations": 8,
    "completedEvaluations": 6,
    "pendingEvaluations": 2,
    "completionRate": 75
  }
}
```

**Teacher Response (200)**
```json
{
  "success": true,
  "analytics": {
    "classesTaught": 3,
    "totalStudents": 85,
    "evaluationsCreated": 6,
    "evaluationsCompleted": 5,
    "evaluationRate": 83
  }
}
```

**Dean Response (200)**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 250,
    "totalCourses": 32,
    "totalEvaluations": 150,
    "completionRate": 78
  }
}
```

---

## Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login successful, data returned |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Token missing or invalid |
| 403 | Forbidden | Access denied, insufficient permissions |
| 404 | Not Found | User/course/evaluation not found |
| 409 | Conflict | Email or JMC ID already registered |
| 500 | Server Error | Database or server issue |

---

## Common Error Responses

### Invalid Token
```json
{
  "error": "Invalid token"
}
```
Response Code: 401

### Domain Restriction
```json
{
  "error": "Access denied. Please use your official JMC institutional account."
}
```
Response Code: 403

### User Not Found
```json
{
  "error": "User not found"
}
```
Response Code: 404

### Evaluation Not Found
```json
{
  "error": "Evaluation not found"
}
```
Response Code: 404

---

## Testing with curl

### Test Google Login
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "google-login",
    "googleToken": "test-token"
  }'
```

### Test Get User (replace TOKEN)
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/users
```

### Test Get Courses
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/courses
```

### Test Get Evaluations
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3000/api/evaluations?status=pending"
```

### Test Submit Evaluation
```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "evaluationId": 1,
    "responses": [
      {"criterionId": 1, "score": 4}
    ]
  }'
```

### Test Get Analytics
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/analytics
```

---

## Token Format

**JWT Token Structure:**
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": 1,
  "role": "student",
  "iat": 1705329600,
  "exp": 1705416000
}

Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

**Token Expiry:** 24 hours from creation

---

## Rate Limiting

Currently no rate limiting. For production, implement:
- 5 login attempts per minute per IP
- 10 API calls per second per user
- 100 API calls per minute per user

---

## CORS Support

Currently supports `localhost:3000`. For other origins, update CORS headers in API routes.

---

## Webhooks

Currently not implemented. Future feature: Event notifications for evaluation submissions.

---

## API Response Format

All endpoints follow REST conventions:
```
GET    /resource      → Retrieve resource list
POST   /resource      → Create new resource
PATCH  /resource      → Update resource
DELETE /resource      → Delete resource
```

---

## Versioning

Current API Version: **1.0**

No version prefix in URL. Breaking changes will increment major version.

---

Last Updated: January 2025
Status: Production Ready
