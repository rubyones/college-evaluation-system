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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded: any = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    if (decoded.role !== 'dean') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const periods: any = await query('SELECT * FROM evaluation_periods ORDER BY start_date DESC');
    return NextResponse.json({ success: true, periods });
  } catch (error) {
    console.error('Eval periods GET error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded: any = await verifyToken(token);
    if (!decoded || decoded.role !== 'dean') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const { name, start_date, end_date, status, form_id, academic_period_id } = body;
    if (!name || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result: any = await query(
      `INSERT INTO evaluation_periods (name, start_date, end_date, status, form_id, academic_period_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, start_date, end_date, status || 'upcoming', form_id || null, academic_period_id || null]
    );
    const inserted = await queryOne('SELECT * FROM evaluation_periods WHERE id = ?', [result.insertId]);
    return NextResponse.json({ success: true, period: inserted });
  } catch (error) {
    console.error('Eval periods POST error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded: any = await verifyToken(token);
    if (!decoded || decoded.role !== 'dean') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return NextResponse.json({ success: true });
    }
    const sets = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => (updates as any)[f]);
    values.push(id);
    await query(`UPDATE evaluation_periods SET ${sets} WHERE id = ?`, values);
    const updated = await queryOne('SELECT * FROM evaluation_periods WHERE id = ?', [id]);
    return NextResponse.json({ success: true, period: updated });
  } catch (error) {
    console.error('Eval periods PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded: any = await verifyToken(token);
    if (!decoded || decoded.role !== 'dean') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id query param required' }, { status: 400 });
    }
    await query('DELETE FROM evaluation_periods WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Eval periods DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}