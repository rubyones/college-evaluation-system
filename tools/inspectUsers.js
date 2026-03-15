const mysql = require('mysql2/promise');
(async()=>{
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'college_db',
  });
  const [rows] = await pool.query('SELECT id,name,email,password,role FROM users');
  console.log(rows);
  pool.end();
})();