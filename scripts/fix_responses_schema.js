const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cite_es',
  });

  try {
    console.log('Checking evaluation_responses table structure...');
    
    // Check if FK exists
    const [constraints] = await connection.query(
      `SELECT CONSTRAINT_NAME 
       FROM information_schema.KEY_COLUMN_USAGE 
       WHERE TABLE_NAME = 'evaluation_responses' 
       AND COLUMN_NAME = 'criteria_id' 
       AND TABLE_SCHEMA = ?`,
      [process.env.DB_NAME || 'cite_es']
    );

    for (const constraint of constraints) {
      if (constraint.CONSTRAINT_NAME !== 'PRIMARY') {
        console.log(`Dropping FK constraint: ${constraint.CONSTRAINT_NAME}`);
        await connection.query(`ALTER TABLE evaluation_responses DROP FOREIGN KEY ${constraint.CONSTRAINT_NAME}`);
      }
    }

    console.log('Modifying criteria_id column to VARCHAR(36)...');
    await connection.query(`ALTER TABLE evaluation_responses MODIFY COLUMN criteria_id VARCHAR(36) NOT NULL`);

    console.log('Migration successful: evaluation_responses table updated.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

main();
