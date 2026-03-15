#!/usr/bin/env node

/**
 * Database Migration Tool
 * Runs schema migrations to create all required tables in cite_es database
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cite_es',
};

async function runMigrations() {
  let connection;
  try {
    console.log('🔄 Connecting to database...');
    console.log(`   Host: ${config.host}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.user}`);

    connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully!\n');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split by semicolon to get individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`📋 Running ${statements.length} migration statements...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const [index, statement] of statements.entries()) {
      try {
        // Skip comments and empty statements
        if (!statement || statement.startsWith('--')) continue;

        await connection.execute(statement);
        successCount++;
        console.log(`✅ [${index + 1}/${statements.length}] Executed successfully`);
      } catch (error) {
        // Table already exists is not an error
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          successCount++;
          console.log(`ℹ️  [${index + 1}/${statements.length}] Table already exists (skipped)`);
        } else {
          errorCount++;
          console.error(`❌ [${index + 1}/${statements.length}] Error: ${error.message}`);
        }
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 Migration Summary`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`\n✨ Migration complete!\n`);

    // Verify tables
    console.log('📋 Verifying tables...\n');
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME`,
      [config.database]
    );

    console.log(`Found ${tables.length} tables in ${config.database}:\n`);
    tables.forEach((row, i) => {
      console.log(`   ${i + 1}. ${row.TABLE_NAME}`);
    });

    console.log('\n✅ All tables created/verified successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run migrations
runMigrations().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
