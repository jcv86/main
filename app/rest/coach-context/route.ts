import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * GET /api/despega/get-coach-context?user_id=xxx
 * Obtiene el contexto completo del usuario para que el Coach (Sofia/Dani) tenga visibilidad total
 * Devuelve snapshots del estado actual de A1+A2+A3+A4
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing required parameter: user_id' },
        { status: 400 }
      )
    }

    // Get Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[v0] Missing Supabase credentials')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle error
          }
        },
      },
    })

    console.log(`[v0] Getting coach context for user ${user_id}`)

    // Get latest context snapshot
    const { data: contextSnapshot, error: contextError } = await supabase
      .from('coach_context_snapshots')
      .select('*')
      .eq('user_id', user_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (contextError) {
      console.error('[v0] Error querying coach context:', contextError)
      return NextResponse.json(
        { error: 'Failed to retrieve context' },
        { status: 500 }
      )
    }

    if (!contextSnapshot) {
      // Return empty context for new users WITHOUT inserting (schema cache issue)
      console.log('[v0] Coach context not found for new user:', user_id)
      
      return NextResponse.json({
        success: true,
        context: {
          user_id: user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        message: 'New user context (empty)',
        isNewUser: true,
      })
    }

    console.log(`[v0] Retrieved coach context for user ${user_id}`)

    return NextResponse.json({
      success: true,
      context: contextSnapshot,
    })
  } catch (error) {
    console.error('[v0] Error in get-coach-context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
