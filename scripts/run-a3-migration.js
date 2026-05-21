#!/usr/bin/env node
/**
 * A3 Behavioral System SQL Migration Runner
 * Executes the A3 schema SQL file against Supabase
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Get database URL from environment
const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL or POSTGRES_URL_NON_POOLING environment variable');
  process.exit(1);
}

async function runMigration() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
      sslmode: 'require'
    },
    // Disable certificate verification more aggressively
    sslmode: 'require'
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Read the SQL file
    const sqlFile = path.join(__dirname, '007-enhanced-a3-behavioral-system.sql');
    console.log(`\n📄 Reading SQL file: ${sqlFile}`);
    
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    
    if (!sql.trim()) {
      console.error('❌ SQL file is empty');
      process.exit(1);
    }

    // Split by semicolon and execute statements individually
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`\n⏳ Executing ${statements.length} SQL statements...\n`);

    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < statements.length; i++) {
      try {
        const stmtPreview = statements[i].substring(0, 60).replace(/\n/g, ' ');
        process.stdout.write(`[${i + 1}/${statements.length}] ${stmtPreview}... `);
        
        await client.query(statements[i]);
        console.log('✅');
        successCount++;
      } catch (error) {
        // Skip "already exists" errors
        if (
          error.message.includes('already exists') ||
          error.code === '42P07' || // DUPLICATE_TABLE
          error.code === '42P06' || // DUPLICATE_SCHEMA
          error.code === '42723'    // DUPLICATE_FUNCTION
        ) {
          console.log('⏭️  (already exists)');
          skipCount++;
        } else {
          console.error(`\n❌ Error executing statement ${i + 1}:`);
          console.error(error.message);
          throw error;
        }
      }
    }
    
    console.log(`\n✅ Migration completed successfully!`);
    console.log(`   • Executed: ${successCount} statements`);
    console.log(`   • Skipped: ${skipCount} statements (already exist)`);
    console.log('\n📊 A3 Behavioral System schema created:');
    console.log('   ✓ despega_a3_pre_interview');
    console.log('   ✓ despega_a3_employability');
    console.log('   ✓ despega_a3_behavioral_obs');
    console.log('   ✓ despega_a3_emotional_state');
    console.log('   ✓ despega_a3_difficulty_progress');
    console.log('   ✓ despega_a3_success_signals');
    console.log('   ✓ despega_a3_feedback');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.detail) {
      console.error('   Detail:', error.detail);
    }
    if (error.hint) {
      console.error('   Hint:', error.hint);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ Database connection closed');
  }
}

// Run the migration
runMigration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
