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

type EvalRequest = {
  evaluationId?: string;
  responses?: Array<{ criteriaId: string; rating: number; comment?: string }>;
};

// GET evaluations for the logged-in user
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

    // Get evaluations assigned to the user
    const evaluations: any = await query(
      `SELECT e.id, e.course_id, e.evaluatee_id, e.evaluation_type, e.status,
              c.name as course_name, c.code as course_code,
              u.name as evaluatee_name
       FROM evaluations e
       LEFT JOIN courses c ON e.course_id = c.id
       LEFT JOIN users u ON e.evaluatee_id = u.id
       WHERE e.evaluator_id = ? AND e.status != 'locked'
       ORDER BY e.created_at DESC`,
      [decoded.userId]
    );

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

    if (!body || !body.evaluationId || !Array.isArray(body.responses)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Verify evaluation exists and belongs to this user
    const evaluation: any = await queryOne(
      'SELECT id, status FROM evaluations WHERE id = ? AND evaluator_id = ?',
      [body.evaluationId, decoded.userId]
    );

    if (!evaluation) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 });
    }

    if (evaluation.status === 'locked') {
      return NextResponse.json({ error: 'Evaluation is locked' }, { status: 400 });
    }

    // Insert/update responses
    for (const response of body.responses) {
      const responseId = uuidv4();
      await query(
        'INSERT INTO evaluation_responses (id, evaluation_id, criteria_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [responseId, body.evaluationId, response.criteriaId, response.rating, response.comment || null]
      );
    }

    // Update evaluation status to submitted
    await query(
      'UPDATE evaluations SET status = ?, submitted_at = NOW() WHERE id = ?',
      ['submitted', body.evaluationId]
    );

    return NextResponse.json({ success: true, message: 'Evaluation submitted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error processing evaluation submission:', err);
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 });
  }
}

