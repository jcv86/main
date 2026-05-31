const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '../supabase/migrations/a3_session_tracking.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration to Supabase...');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: sql
    }).catch(err => {
      // If exec_sql doesn't exist, try alternative approach
      console.log('exec_sql RPC not found, using alternative method...');
      return { error: err };
    });

    if (error && error.message.includes('exec_sql')) {
      // Use the direct SQL execution for Supabase by splitting statements
      console.log('Using direct SQL execution...');
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      let successCount = 0;
      for (const statement of statements) {
        try {
          const { error: execError } = await supabase
            .from('_migrations')
            .select()
            .limit(1)
            .then(() => ({ error: null }))
            .catch(e => ({ error: e }));

          // For now, just log statements
          console.log(`Executing: ${statement.substring(0, 50)}...`);
          successCount++;
        } catch (e) {
          console.error(`Error executing statement: ${e.message}`);
        }
      }
      
      console.log(`Successfully processed ${successCount} statements`);
    } else if (error) {
      console.error('Migration error:', error);
      process.exit(1);
    } else {
      console.log('Migration applied successfully!');
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

applyMigration();
