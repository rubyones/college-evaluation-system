const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async function(){
  try {
    const sqlPath = path.resolve(__dirname, '..', '..', 'database_setup.sql');
    console.log('Reading SQL from', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'college_db',
      multipleStatements: true,
    });

    console.log('Connected to MySQL, dropping existing tables (if any) then executing SQL...');
    // Disable FK checks, drop tables, then re-enable checks to avoid duplicate/constraint issues
      const dropStmt = `SET FOREIGN_KEY_CHECKS=0;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS evaluation_responses;
    DROP TABLE IF EXISTS evaluations;
    DROP TABLE IF EXISTS enrollments;
    DROP TABLE IF EXISTS audit_logs;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS courses;
    DROP TABLE IF EXISTS users;
    SET FOREIGN_KEY_CHECKS=1;`;
    await conn.query(dropStmt);
    await conn.query(sql);
    console.log('IMPORT_OK');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('IMPORT_ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();