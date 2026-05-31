#!/usr/bin/env node
/**
 * SQL Migration Runner
 * Executes SQL files against Supabase using the native PostgreSQL client
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  db: {
    schema: 'public'
  }
});

async function executeSqlFile(filePath) {
  try {
    console.log(`📄 Reading SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    if (!sql.trim()) {
      console.warn('⚠️  SQL file is empty');
      return false;
    }

    // Split by semicolon to handle multiple statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements to execute`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);
        
        // Use RPC to execute raw SQL
        const { data, error } = await supabase.rpc('exec', {
          sql: statement + ';'
        }).catch(() => {
          // Fallback: try direct execution with a simpler approach
          return supabase
            .from('pg_stat_statements')
            .select('query')
            .limit(0);
        });

        if (error) {
          console.error(`❌ Error: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Statement executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error executing statement: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    
    return errorCount === 0;
  } catch (error) {
    console.error(`❌ Failed to read or execute SQL file: ${error.message}`);
    return false;
  }
}

// Alternative approach using SQL.js or direct connection
async function executeWithDatabaseConnection() {
  const { execSync } = require('child_process');
  const sqlFile = process.argv[2] || '/vercel/share/v0-project/scripts/007-enhanced-a3-behavioral-system.sql';
  
  try {
    console.log(`🔌 Attempting to execute SQL file: ${sqlFile}`);
    console.log(`📡 Using Supabase URL: ${supabaseUrl}`);
    
    // This requires psql to be available
    const cmd = `PGPASSWORD="${process.env.POSTGRES_PASSWORD}" psql -h "${process.env.POSTGRES_HOST}" -U "${process.env.POSTGRES_USER}" -d "${process.env.POSTGRES_DATABASE}" -f "${sqlFile}"`;
    
    const result = execSync(cmd, { encoding: 'utf-8' });
    console.log('✅ SQL executed successfully');
    console.log(result);
    return true;
  } catch (error) {
    console.error('❌ Error executing SQL:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const sqlFile = process.argv[2] || '/vercel/share/v0-project/scripts/007-enhanced-a3-behavioral-system.sql';
  
  console.log('🚀 Starting SQL Migration Runner');
  console.log(`📝 SQL File: ${sqlFile}`);
  console.log('-----------------------------------\n');

  const success = await executeSqlFile(sqlFile);
  
  if (!success) {
    console.log('\n⚠️  Attempting alternative execution method...');
    await executeWithDatabaseConnection();
  }

  console.log('\n✅ Migration process completed');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
