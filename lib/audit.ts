import { query } from './db';

export interface AuditLogEntry {
  userId?: number;
  action: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed' | 'pending';
}

export async function logAuditTrail(entry: AuditLogEntry) {
  try {
    await query(
      `INSERT INTO audit_logs (user_id, action, description, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entry.userId || null,
        entry.action,
        entry.description || null,
        entry.ipAddress || null,
        entry.userAgent || null,
        entry.status,
      ]
    );
  } catch (error) {
    console.error('Failed to log audit trail:', error);
  }
}

export async function getAuditLogs(filters?: {
  userId?: number;
  action?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  let sql = 'SELECT * FROM audit_logs WHERE 1=1';
  const values: any[] = [];

  if (filters?.userId) {
    sql += ' AND user_id = ?';
    values.push(filters.userId);
  }

  if (filters?.action) {
    sql += ' AND action = ?';
    values.push(filters.action);
  }

  if (filters?.status) {
    sql += ' AND status = ?';
    values.push(filters.status);
  }

  sql += ' ORDER BY created_at DESC';

  if (filters?.limit) {
    sql += ' LIMIT ?';
    values.push(filters.limit);
  }

  if (filters?.offset) {
    sql += ' OFFSET ?';
    values.push(filters.offset);
  }

  return await query(sql, values);
}
