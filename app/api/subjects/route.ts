import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const course_program = searchParams.get('course_program');
  const year_level = searchParams.get('year_level');
  const semester = searchParams.get('semester');

  if (!course_program || !year_level || !semester) {
    return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
  }

  // Query the subjects table for matching subjects
  const subjects = await query(
    `SELECT subject_id, subject_name FROM subjects WHERE course_program = ? AND year_level = ? AND semester = ?`,
    [course_program, year_level, semester]
  );

  return NextResponse.json({ subjects });
}