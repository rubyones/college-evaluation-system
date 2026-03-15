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
    const forms: any = await query('SELECT * FROM evaluation_forms ORDER BY created_at DESC');
    return NextResponse.json({ success: true, forms });
  } catch (error) {
    console.error('Forms GET error:', error);
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
    const { name, description, type, criteria } = body;
    if (!name || !type || !criteria) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result: any = await query(
      `INSERT INTO evaluation_forms (name, description, type, criteria) VALUES (?, ?, ?, ?)`,
      [name, description || '', type, JSON.stringify(criteria)]
    );
    const inserted = await queryOne('SELECT * FROM evaluation_forms WHERE id = ?', [result.insertId]);
    return NextResponse.json({ success: true, form: inserted });
  } catch (error) {
    console.error('Forms POST error:', error);
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
    const values = fields.map(f => {
      if (f === 'criteria') return JSON.stringify((updates as any)[f]);
      return (updates as any)[f];
    });
    values.push(id);
    await query(`UPDATE evaluation_forms SET ${sets} WHERE id = ?`, values);
    const updated = await queryOne('SELECT * FROM evaluation_forms WHERE id = ?', [id]);
    return NextResponse.json({ success: true, form: updated });
  } catch (error) {
    console.error('Forms PATCH error:', error);
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
    await query('DELETE FROM evaluation_forms WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forms DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
