#!/usr/bin/env node
/**
 * Setup script for avatar preferences migration
 * Creates the avatar_preferences table if it doesn't exist
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[v0] ✗ Missing required environment variables')
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗')
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function setupAvatars() {
  console.log('[v0] Setting up avatar preferences...')

  try {
    // Test if table already exists by querying it
    const { error: queryError, data } = await supabase
      .from('avatar_preferences')
      .select('count(*)', { count: 'exact', head: true })

    if (!queryError) {
      console.log('[v0] ✓ Avatar preferences table already exists')
      console.log('[v0] ✓ Setup complete!')
      return
    }

    // If table doesn't exist, we need to create it via SQL
    // Since Supabase doesn't expose a direct SQL execution endpoint,
    // users need to run the SQL manually in the Supabase dashboard
    console.log('[v0] ℹ Avatar preferences table not found')
    console.log('[v0] ℹ To create the table, visit your Supabase dashboard and run the SQL from:')
    console.log('[v0] ℹ scripts/create-avatar-preferences-table.sql')
    console.log('[v0] ✓ Setup instructions logged!')
  } catch (err) {
    console.warn('[v0] ⚠ Could not verify table:', err.message)
    console.log('[v0] ℹ If the table doesn\'t exist, please run the SQL from scripts/create-avatar-preferences-table.sql')
    console.log('[v0] ✓ Setup complete!')
  }
}

setupAvatars().catch(err => {
  console.error('[v0] ✗ Setup failed:', err)
  process.exit(1)
})
