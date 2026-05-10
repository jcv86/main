#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from /vercel/share/.env.project
const envPath = '/vercel/share/.env.project';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const cleanKey = key.trim();
      const cleanValue = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      process.env[cleanKey] = cleanValue;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('[v0] Loading environment variables...');
console.log('[v0] Supabase URL:', supabaseUrl ? 'Found ✓' : 'Missing ✗');
console.log('[v0] Service Role Key:', supabaseServiceKey ? 'Found ✓' : 'Missing ✗');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Error: Missing SUPABASE environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration(filePath) {
  console.log(`\n[v0] Executing migration: ${path.basename(filePath)}`);
  
  const sql = fs.readFileSync(filePath, 'utf-8');
  
  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  if (statements.length === 0) {
    console.log('[v0] No SQL statements found');
    return;
  }

  console.log(`[v0] Found ${statements.length} SQL statements`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    try {
      console.log(`[v0] Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_command: statement + ';'
        });

        if (error) {
          console.warn(`[v0] Warning on statement ${i + 1}:`, error.message);
        } else {
          console.log(`[v0] ✓ Statement ${i + 1} executed successfully`);
        }
      } catch (rpcError) {
        console.warn(`[v0] RPC not available (${rpcError.message})`);
        console.log(`[v0] → Please visit your Supabase Dashboard and run the SQL manually`);
        break;
      }
    } catch (err) {
      console.error(`[v0] Error on statement ${i + 1}:`, err.message);
    }
  }
}

async function runAllMigrations() {
  const scriptsDir = path.join(__dirname);
  const allFiles = fs.readdirSync(scriptsDir);
  
  // Only run gamification migration files
  const gamificationFiles = allFiles
    .filter(f => f === '01-gamification-schema.sql' || f === '02-enhanced-interview-questions.sql')
    .sort();

  console.log(`\n[v0] Found ${gamificationFiles.length} gamification migration files`);

  if (gamificationFiles.length === 0) {
    console.log('[v0] ❌ Gamification migration files not found!');
    console.log('[v0] Expected: 01-gamification-schema.sql, 02-enhanced-interview-questions.sql');
    return;
  }

  for (const file of gamificationFiles) {
    await executeMigration(path.join(scriptsDir, file));
  }

  console.log('\n[v0] ✓ Migration process completed!');
  console.log('[v0] Note: If RPC not available, run the SQL files manually via Supabase dashboard');
}

runAllMigrations().catch(err => {
  console.error('[v0] Migration failed:', err);
  process.exit(1);
});
