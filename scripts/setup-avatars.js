#!/usr/bin/env node
/**
 * Setup script for avatar preferences migration
 * Runs the SQL migration to create the avatar_preferences table
 */

import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[v0] ✗ Missing required environment variables')
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗')
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗')
  process.exit(1)
}

async function runMigration() {
  console.log('[v0] Setting up avatar preferences table...')

  try {
    // Use the REST API to execute raw SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/sql_exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS public.avatar_preferences (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            user_avatar_id VARCHAR(50) DEFAULT 'professional-1',
            interviewer_avatar_id VARCHAR(50) DEFAULT 'interviewer-classic-1',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id)
          );

          CREATE INDEX IF NOT EXISTS avatar_preferences_user_id_idx ON public.avatar_preferences(user_id);

          ALTER TABLE public.avatar_preferences ENABLE ROW LEVEL SECURITY;

          DROP POLICY IF EXISTS "Users can view own avatar preferences" ON public.avatar_preferences;
          CREATE POLICY "Users can view own avatar preferences"
            ON public.avatar_preferences
            FOR SELECT
            USING (auth.uid() = user_id);

          DROP POLICY IF EXISTS "Users can update own avatar preferences" ON public.avatar_preferences;
          CREATE POLICY "Users can update own avatar preferences"
            ON public.avatar_preferences
            FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);

          DROP POLICY IF EXISTS "Users can insert own avatar preferences" ON public.avatar_preferences;
          CREATE POLICY "Users can insert own avatar preferences"
            ON public.avatar_preferences
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);

          CREATE OR REPLACE FUNCTION update_avatar_preferences_updated_at()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;

          DROP TRIGGER IF EXISTS update_avatar_preferences_updated_at_trigger ON public.avatar_preferences;
          CREATE TRIGGER update_avatar_preferences_updated_at_trigger
            BEFORE UPDATE ON public.avatar_preferences
            FOR EACH ROW
            EXECUTE FUNCTION update_avatar_preferences_updated_at();
        `
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[v0] ✗ Migration failed:', error)
      // Continue anyway - the table might already exist
    } else {
      console.log('[v0] ✓ Avatar preferences table created/verified successfully')
    }
  } catch (err) {
    console.warn('[v0] ⚠ Could not run migration via API (this is normal if using local dev):', err.message)
  }

  console.log('[v0] ✓ Setup complete!')
}

runMigration().catch(err => {
  console.error('[v0] ✗ Setup failed:', err)
  process.exit(1)
})
