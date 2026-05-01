import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch user by email from auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('[v0] Error listing users:', listError)
      return NextResponse.json(
        { error: 'Error fetching user' },
        { status: 500 }
      )
    }

    const user = users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create a session directly (admin bypass for demo)
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      userId: user.id,
    })

    if (sessionError) {
      console.error('[v0] Error creating session:', sessionError)
      return NextResponse.json(
        { error: 'Error creating session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      session: {
        access_token: sessionData.session?.access_token,
        refresh_token: sessionData.session?.refresh_token,
        expires_at: sessionData.session?.expires_at,
      },
    })
  } catch (error) {
    console.error('[v0] Demo login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
