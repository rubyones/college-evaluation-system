import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

let jwt: any = null;

async function loadJWT() {
  if (!jwt) {
    const jwtModule = await import('jsonwebtoken');
    jwt = jwtModule.default || jwtModule;
  }
  return jwt;
}

function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ') ) {
    return null;
  }
  return authHeader.substring(7);
}

async function verifyToken(token: string) {
  try {
    const jwtLib = await loadJWT();
    const decoded = jwtLib.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded: any = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get analytics based on user role
    let analytics: any = {};

    if (decoded.role === 'student') {
      // Student analytics
      const enrolledCoursesResult: any = await query(
        'SELECT COUNT(*) as count FROM enrollments WHERE student_id = ?',
        [decoded.userId]
      );
      const enrolledCourses = enrolledCoursesResult[0]?.count || 0;

      const evaluationsResult: any = await query(
        'SELECT COUNT(*) as count FROM evaluations WHERE evaluator_id = ?',
        [decoded.userId]
      );
      const totalEvaluations = evaluationsResult[0]?.count || 0;

      const submittedResult: any = await query(
        'SELECT COUNT(*) as count FROM evaluations WHERE evaluator_id = ? AND status = "submitted"',
        [decoded.userId]
      );
      const submittedEvaluations = submittedResult[0]?.count || 0;

      const completionRate = totalEvaluations > 0 
        ? Math.round((submittedEvaluations / totalEvaluations) * 100 * 10) / 10 
        : 0;

      analytics = {
        enrolledCourses,
        totalEvaluations,
        submittedEvaluations,
        pendingEvaluations: totalEvaluations - submittedEvaluations,
        completionRate,
      };
    } else if (decoded.role === 'teacher') {
      // Teacher analytics
      const classesResult: any = await query(
        'SELECT COUNT(*) as count FROM courses WHERE instructor_id = ?',
        [decoded.userId]
      );
      const classesTaught = classesResult[0]?.count || 0;

      const studentsResult: any = await query(
        'SELECT COUNT(DISTINCT e.student_id) as count FROM courses c INNER JOIN enrollments e ON c.id = e.course_id WHERE c.instructor_id = ?',
        [decoded.userId]
      );
      const totalStudents = studentsResult[0]?.count || 0;

      const evaluationsCreatedResult: any = await query(
        'SELECT COUNT(*) as count FROM evaluations e INNER JOIN courses c ON e.course_id = c.id WHERE c.instructor_id = ? AND e.evaluation_type = "teacher"',
        [decoded.userId]
      );
      const evaluationsCreated = evaluationsCreatedResult[0]?.count || 0;

      const evaluationsSubmittedResult: any = await query(
        'SELECT COUNT(*) as count FROM evaluations e INNER JOIN courses c ON e.course_id = c.id WHERE c.instructor_id = ? AND e.status = "submitted"',
        [decoded.userId]
      );
      const evaluationsSubmitted = evaluationsSubmittedResult[0]?.count || 0;

      const evaluationRate = evaluationsCreated > 0 
        ? Math.round((evaluationsSubmitted / evaluationsCreated) * 100 * 10) / 10 
        : 0;

      analytics = {
        classesTaught,
        totalStudents,
        evaluationsCreated,
        evaluationsSubmitted,
        evaluationRate,
      };
    } else if (decoded.role === 'dean' || decoded.role === 'admin') {
      // System-wide analytics
      const totalUsersResult: any = await query('SELECT COUNT(*) as count FROM users');
      const totalUsers = totalUsersResult[0]?.count || 0;

      const totalCoursesResult: any = await query('SELECT COUNT(*) as count FROM courses');
      const totalCourses = totalCoursesResult[0]?.count || 0;

      const totalEvaluationsResult: any = await query('SELECT COUNT(*) as count FROM evaluations');
      const totalEvaluations = totalEvaluationsResult[0]?.count || 0;

      const submittedEvaluationsResult: any = await query('SELECT COUNT(*) as count FROM evaluations WHERE status = "submitted"');
      const submittedEvaluations = submittedEvaluationsResult[0]?.count || 0;

      const evaluationRate = totalEvaluations > 0 
        ? Math.round((submittedEvaluations / totalEvaluations) * 100 * 10) / 10 
        : 0;

      analytics = {
        totalUsers,
        totalCourses,
        totalEvaluations,
        submittedEvaluations,
        evaluationRate,
      };
    }

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
