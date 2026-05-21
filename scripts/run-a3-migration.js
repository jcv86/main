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
    ssl: { rejectUnauthorized: false }
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

    // Execute the SQL
    console.log('\n⏳ Executing SQL...');
    await client.query(sql);
    
    console.log('\n✅ Migration completed successfully!');
    console.log('📊 A3 Behavioral System schema created with:');
    console.log('   • despega_a3_pre_interview_analysis');
    console.log('   • despega_a3_employability_diagnosis');
    console.log('   • despega_a3_behavioral_observations');
    console.log('   • despega_a3_emotional_state');
    console.log('   • despega_a3_difficulty_levels');
    console.log('   • despega_a3_p_success_calculations');
    console.log('   • despega_a3_structured_feedback');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
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
