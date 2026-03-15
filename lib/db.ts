import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'college_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, values?: any[]) {
  try {
    const connection = await pool.getConnection();
    try {
      const [results] = values
        ? await connection.execute(sql, values)
        : await connection.execute(sql);
      return results;
    } finally {
      connection.release();
    }
  } catch (error) {
    // If the database is unavailable, fall back to empty results.
    // This allows the app to run without a database while still rendering.
    console.warn('DB query failed, returning empty result:', error);
    return [];
  }
}

export async function queryOne(sql: string, values?: any[]) {
  try {
    const results = await query(sql, values);
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  } catch (error) {
    console.warn('DB queryOne failed, returning null:', error);
    return null;
  }
}

export default pool;
