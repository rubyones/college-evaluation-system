import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

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

// request payload used by students/teachers when submitting responses
// we also support optional parameters when creating new evaluation
// records on the fly (courseId, evaluationType, evaluateeId) and an
// admin action to generate assignments in bulk.

type EvalRequest = {
  evaluationId?: string;
  courseId?: string;
  evaluationType?: string; // 'teacher' | 'peer' | 'self'
  evaluateeId?: string;
  responses?: Array<{ criteriaId: string; rating: number; comment?: string }>;
  action?: 'generate'; // for admin bulk operations
};

// GET evaluations for the logged-in user
// support optional query parameters ?type=peer|teacher&status=locked|submitted
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const url = new URL(request.url);
    const filterType = url.searchParams.get('type');
    const filterStatus = url.searchParams.get('status');

    let evaluations: any;
    if (decoded.role === 'dean') {
      // dean sees all evaluations (completed or not) with full response details
      let base =
        `SELECT e.id, e.course_id, e.evaluatee_id, e.evaluator_id, e.evaluation_type, e.status,
                c.name as course_name, c.code as course_code,
                u.name as evaluatee_name,
                ev.name as evaluator_name
         FROM evaluations e
         LEFT JOIN courses c ON e.course_id = c.id
         LEFT JOIN users u ON e.evaluatee_id = u.id
         LEFT JOIN users ev ON e.evaluator_id = ev.id`;
      const conditions: string[] = [];
      const params: any[] = [];
      if (filterType) {
        conditions.push('e.evaluation_type = ?');
        params.push(filterType);
      }
      if (filterStatus) {
        conditions.push('e.status = ?');
        params.push(filterStatus);
      }
      if (conditions.length) {
        base += ' WHERE ' + conditions.join(' AND ');
      }
      base += ' ORDER BY e.created_at DESC';
      evaluations = await query(base, params);
      // attach responses for each
      const withResp = await Promise.all(
        (evaluations || []).map(async (evaluation: any) => {
          const responses: any = await query(
            'SELECT id, criteria_id, score, comment FROM evaluation_responses WHERE evaluation_id = ? ORDER BY id',
            [evaluation.id]
          );
          return {
            ...evaluation,
            responses: responses || [],
            evaluator: { name: evaluation.evaluator_name },
            evaluatee: { name: evaluation.evaluatee_name },
            form: { type: evaluation.evaluation_type },
            course: { name: evaluation.course_name },
            isLocked: evaluation.status === 'locked',
          };
        })
      );
      evaluations = withResp;
    } else {
      // Get evaluations assigned to the user
      let base =
        `SELECT e.id, e.course_id, e.evaluatee_id, e.evaluation_type, e.status,
                c.name as course_name, c.code as course_code,
                u.name as evaluatee_name
         FROM evaluations e
         LEFT JOIN courses c ON e.course_id = c.id
         LEFT JOIN users u ON e.evaluatee_id = u.id
         WHERE e.evaluator_id = ? AND e.status != 'locked'`;
      const params: any[] = [decoded.userId];
      if (filterType) {
        base += ' AND e.evaluation_type = ?';
        params.push(filterType);
      }
      if (filterStatus) {
        base += ' AND e.status = ?';
        params.push(filterStatus);
      }
      base += ' ORDER BY e.created_at DESC';
      evaluations = await query(base, params);
    }

    // Get responses for each evaluation
    const evaluationsWithResponses = await Promise.all(
      (evaluations || []).map(async (evaluation: any) => {
        const responses: any = await query(
          'SELECT id, criteria_id, rating, comment FROM evaluation_responses WHERE evaluation_id = ? ORDER BY id',
          [evaluation.id]
        );
        return {
          ...evaluation,
          responses: responses || [],
        };
      })
    );

    return NextResponse.json({
      success: true,
      evaluations: evaluationsWithResponses,
    });
  } catch (error) {
    console.error('Get evaluations error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

// PATCH evaluation attributes or lock/unlock. Dean may update any evaluation; evaluators
// may only modify their own draft evaluations (e.g. change status back to draft).
export async function PATCH(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded: any = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body: any = await request.json();
    const { id, status, evaluator_id, evaluatee_id, course_id } = body;
    if (!id) {
      return NextResponse.json({ error: 'Evaluation id required' }, { status: 400 });
    }

    // only dean or the evaluator themselves (and not locked) may patch
    const evalRecord: any = await queryOne('SELECT * FROM evaluations WHERE id = ?', [id]);
    if (!evalRecord) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 });
    }

    if (decoded.role !== 'dean') {
      if (evalRecord.evaluator_id !== decoded.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (evalRecord.status === 'locked') {
        return NextResponse.json({ error: 'Evaluation locked' }, { status: 400 });
      }
    }

    const updates: string[] = [];
    const params: any[] = [];
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (evaluator_id !== undefined && decoded.role === 'dean') {
      updates.push('evaluator_id = ?');
      params.push(evaluator_id);
    }
    if (evaluatee_id !== undefined && decoded.role === 'dean') {
      updates.push('evaluatee_id = ?');
      params.push(evaluatee_id);
    }
    if (course_id !== undefined && decoded.role === 'dean') {
      updates.push('course_id = ?');
      params.push(course_id);
    }

    if (updates.length > 0) {
      params.push(id);
      await query(`UPDATE evaluations SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updated = await queryOne('SELECT * FROM evaluations WHERE id = ?', [id]);
    return NextResponse.json({ success: true, evaluation: updated });
  } catch (err) {
    console.error('Evaluation patch error', err);
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
}

// POST evaluation responses
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body: EvalRequest = await request.json();

    // ADMIN BULK GENERATION
    if (body.action === 'generate') {
      if (decoded.role !== 'dean') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      // generate student-to-teacher evaluations for all enrollments
      // ignore duplicates using NOT EXISTS
      await query(
        `INSERT INTO evaluations (id, course_id, evaluatee_id, evaluator_id, evaluation_type, status)
         SELECT UUID(), c.id, c.teacher_id, e.student_id, 'teacher', 'draft'
         FROM courses c
         JOIN course_enrollments e ON e.course_id = c.id
         WHERE NOT EXISTS(
           SELECT 1 FROM evaluations v
           WHERE v.course_id = c.id
             AND v.evaluator_id = e.student_id
             AND v.evaluation_type = 'teacher'
         )`
      );
      // optionally generate peer reviews: each teacher evaluates other teachers in same dept
      await query(
        `INSERT INTO evaluations (id, course_id, evaluatee_id, evaluator_id, evaluation_type, status)
         SELECT UUID(), NULL, t2.id, t1.id, 'peer', 'draft'
         FROM users t1
         JOIN users t2 ON t1.role = 'teacher' AND t2.role = 'teacher' AND t1.id <> t2.id AND t1.department = t2.department
         WHERE NOT EXISTS(
           SELECT 1 FROM evaluations v
           WHERE v.evaluator_id = t1.id
             AND v.evaluatee_id = t2.id
             AND v.evaluation_type = 'peer'
         )`
      );
      return NextResponse.json({ success: true, message: 'Bulk evaluations generated' });
    }

    // regular submission
    // if client provided courseId instead of an evaluationId create one
    let evaluationId = body.evaluationId;
    if (!evaluationId) {
      if (!body.courseId) {
        return NextResponse.json({ error: 'evaluationId or courseId required' }, { status: 400 });
      }
      // determine evaluatee (instructor or specified)
      let evaluatee = body.evaluateeId;
      if (!evaluatee && body.evaluationType === 'teacher') {
        const course: any = await queryOne('SELECT teacher_id FROM courses WHERE id = ?', [body.courseId]);
        evaluatee = course?.teacher_id;
      }
      if (!evaluatee) {
        return NextResponse.json({ error: 'Unable to determine evaluatee' }, { status: 400 });
      }
      evaluationId = uuidv4();
      await query(
        `INSERT INTO evaluations (id, course_id, evaluatee_id, evaluator_id, evaluation_type, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [evaluationId, body.courseId || null, evaluatee, decoded.userId, body.evaluationType || 'teacher', 'draft']
      );
    }

    if (!body.responses || !Array.isArray(body.responses)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Verify evaluation exists and belongs to this user
    const evaluation: any = await queryOne(
      'SELECT id, status FROM evaluations WHERE id = ? AND evaluator_id = ?',
      [evaluationId, decoded.userId]
    );

    if (!evaluation) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 });
    }

    if (evaluation.status === 'locked') {
      return NextResponse.json({ error: 'Evaluation is locked' }, { status: 400 });
    }

    // Insert responses (do NOT overwrite existing ones for now)
    for (const response of body.responses) {
      const responseId = uuidv4();
      await query(
        'INSERT INTO evaluation_responses (id, evaluation_id, criteria_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [responseId, evaluationId, response.criteriaId, response.rating, response.comment || null]
      );
    }

    // Update evaluation status to submitted
    await query(
      'UPDATE evaluations SET status = ?, submitted_at = NOW() WHERE id = ?',
      ['submitted', evaluationId]
    );

    return NextResponse.json({ success: true, message: 'Evaluation submitted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error processing evaluation submission:', err);
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
}

