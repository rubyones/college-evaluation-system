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
  if (!authHeader?.startsWith('Bearer ')) {
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

    // Get courses for the user based on their role
    let courses: any;
    
    if (decoded.role === 'teacher') {
      // Teachers see their own courses
      courses = await query(
        `SELECT c.id, c.course_code, c.course_name, c.semester, c.year,
                COUNT(ce.id) as student_count
         FROM courses c
         LEFT JOIN course_enrollments ce ON c.id = ce.course_id
         WHERE c.teacher_id = ?
         GROUP BY c.id`,
        [decoded.userId]
      );
    } else {
      // Students see their enrolled courses
      courses = await query(
        `SELECT c.id, c.course_code, c.course_name, c.semester, c.year,
                COUNT(ce.id) as student_count,
                u.first_name, u.last_name
         FROM courses c
         INNER JOIN course_enrollments ce ON c.id = ce.course_id
         LEFT JOIN users u ON c.teacher_id = u.id
         WHERE ce.user_id = ?
         GROUP BY c.id`,
        [decoded.userId]
      );
    }

    // Format response
    const formattedCourses = (courses || []).map((c: any) => ({
      id: c.id,
      course_code: c.course_code,
      course_name: c.course_name,
      teacher_name: c.first_name && c.last_name ? `${c.first_name} ${c.last_name}` : 'Unknown',
      semester: c.semester,
      year: c.year,
      student_count: c.student_count || 0,
    }));

    return NextResponse.json({
      success: true,
      courses: formattedCourses,
    });  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}