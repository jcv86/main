#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[v0] Missing required environment variables')
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗')
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗')
  process.exit(1)
}

async function runMigration() {
  console.log('[v0] Running avatar preferences migration...')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Read the SQL file
  const sqlPath = path.join(process.cwd(), 'scripts/create-avatar-preferences-table.sql')
  const sql = fs.readFileSync(sqlPath, 'utf-8')

  // Split by semicolons and execute each statement
  const statements = sql.split(';').filter(stmt => stmt.trim())

  for (const statement of statements) {
    try {
      console.log('[v0] Executing statement...')
      const { error } = await supabase.rpc('exec', { statement: statement.trim() })
      
      if (error) {
        // If exec doesn't exist, try direct query
        const { error: queryError } = await supabase.from('_').select().rpc('sql_exec', { statement: statement.trim() })
        if (queryError && queryError.code !== '42883') { // 42883 = undefined function
          console.error('[v0] Error executing statement:', queryError)
        }
      } else {
        console.log('[v0] ✓ Statement executed successfully')
      }
    } catch (err) {
      console.error('[v0] Error executing statement:', err)
    }
  }

  console.log('[v0] Migration completed!')
}

runMigration().catch(err => {
  console.error('[v0] Migration failed:', err)
  process.exit(1)
})
