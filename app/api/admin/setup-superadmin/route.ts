import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/admin/setup-superadmin
 * Creates or updates the travisdev superadmin user
 * Requires ADMIN_SETUP_SECRET for security
 */
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    const secret = request.headers.get('x-admin-secret')
    
    const expectedSecret = process.env.ADMIN_SETUP_SECRET
    
    if (!secret || secret !== expectedSecret) {
      console.warn('[v0] Unauthorized admin setup attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    
    const email = 'travisdev@example.com'
    const password = 'TestPassword123!'

    console.log('[v0] Setting up superadmin user...')

    // 1. Get or create the user via admin API
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        is_superadmin: true,
        name: 'Travis Dev'
      }
    })

    let userId: string

    if (userError) {
      if (userError.message?.includes('already exists')) {
        // User exists, get their ID
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users && Array.isArray(users) ? users.find(u => u.email === email) : undefined
        
        if (!existingUser) {
          return NextResponse.json({ error: 'User exists but cannot be found' }, { status: 500 })
        }
        
        userId = existingUser.id
        console.log('[v0] User already exists:', userId)
      } else {
        throw userError
      }
    } else {
      userId = userData?.user?.id || ''
    }

    if (!userId) {
      return NextResponse.json({ error: 'Failed to get user ID' }, { status: 500 })
    }

    // 2. Set user as superadmin in user_roles_extended
    console.log('[v0] Setting superadmin role...')
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
      console.error('[v0] Failed to set role:', roleError)
      throw roleError
    }

    // 3. Create user progress with max XP and all modules completed
    console.log('[v0] Setting user progress...')
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
        ],
        last_activity_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (progressError) {
      console.error('[v0] Failed to set progress:', progressError)
      throw progressError
    }

    console.log('[v0] Superadmin setup complete for user:', userId)

    return NextResponse.json({
      success: true,
      message: 'Superadmin user configured',
      user: {
        id: userId,
        email,
        password,
        role: 'superadmin',
        xp: 999999,
        all_modules_unlocked: true
      }
    }, { status: 200 })

  } catch (error) {
    console.error('[v0] Error during admin setup:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    )
  }
}
