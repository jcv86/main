/**
 * Script to set up the superadmin test user
 * Run this via: node scripts/setup-superadmin.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupSuperadmin() {
  try {
    console.log('[v0] Starting superadmin setup for travisdev...')

    // 1. Create or get the user
    const email = 'travisdev@example.com'
    const password = 'TestPassword123!'

    console.log('[v0] Step 1: Creating auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        is_superadmin: true,
        name: 'Travis Dev'
      }
    })

    if (authError && !authError.message?.includes('already exists')) {
      throw authError
    }

    const userId = authData?.user?.id

    if (!userId) {
      console.error('[v0] Failed to get user ID')
      process.exit(1)
    }

    console.log(`[v0] User created/found: ${userId}`)

    // 2. Set user as superadmin in user_roles_extended
    console.log('[v0] Step 2: Setting superadmin role...')
    const { error: roleError } = await supabase
      .from('user_roles_extended')
      .upsert({
        user_id: userId,
        role: 'superadmin',
        all_modules_unlocked: true
      }, {
        onConflict: 'user_id'
      })

    if (roleError) {
      throw roleError
    }

    // 3. Create user progress with max XP
    console.log('[v0] Step 3: Setting user progress...')
    const { error: progressError } = await supabase
      .from('a3_user_progress')
      .upsert({
        user_id: userId,
        total_xp: 999999,
        total_dtc: 999999,
        completed_modules: [
          'auditoria-inicial',
          'metodo-star',
          'cv-inteligente',
          'analisis-vacante',
          'analisis-multimodal',
          'entrenamiento-guiado',
          'entrenamiento-estructurado',
          'entrenamiento-desafiante',
          'entrenamiento-conversacional',
          'simulacion-real'
        ]
      }, {
        onConflict: 'user_id'
      })

    if (progressError) {
      throw progressError
    }

    console.log('[v0] Superadmin setup complete!')
    console.log(`[v0] User: ${email}`)
    console.log(`[v0] Password: ${password}`)
    console.log(`[v0] All modules unlocked with max XP (999999)`)

  } catch (error) {
    console.error('[v0] Error during setup:', error)
    process.exit(1)
  }
}

setupSuperadmin()
