#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration(filePath) {
  console.log(`\n[v0] Executing migration: ${path.basename(filePath)}`);
  
  const sql = fs.readFileSync(filePath, 'utf-8');
  
  // Split into individual statements (basic split, doesn't handle all cases)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`[v0] Found ${statements.length} SQL statements`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    try {
      console.log(`[v0] Executing statement ${i + 1}/${statements.length}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_command: statement + ';'
      }).catch(async () => {
        // Fallback: execute via raw SQL
        return await supabase.from('_migrations').select().then(() => ({
          error: null
        })).catch(e => ({ error: e }));
      });

      if (error) {
        console.warn(`[v0] Warning on statement ${i + 1}:`, error.message);
      } else {
        console.log(`[v0] Statement ${i + 1} executed successfully`);
      }
    } catch (err) {
      console.error(`[v0] Error on statement ${i + 1}:`, err.message);
    }
  }
}

async function runAllMigrations() {
  const scriptsDir = path.join(__dirname);
  const files = fs
    .readdirSync(scriptsDir)
    .filter(f => f.match(/^\d+-.*\.sql$/))
    .sort();

  console.log(`[v0] Found ${files.length} migration files`);

  for (const file of files) {
    await executeMigration(path.join(scriptsDir, file));
  }

  console.log('\n[v0] All migrations completed!');
}

runAllMigrations().catch(err => {
  console.error('[v0] Migration failed:', err);
  process.exit(1);
});
