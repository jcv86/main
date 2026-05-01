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

    // Use generateLink to create a magic link session for demo user
    const { data, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    })

    if (linkError) {
      console.error('[v0] Error generating link:', linkError)
      return NextResponse.json(
        { error: 'Error creating demo session' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to generate demo session' },
        { status: 500 }
      )
    }

    // Extract session from the generated link
    const { user, session } = data

    if (!user || !session) {
      return NextResponse.json(
        { error: 'Failed to create demo session' },
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
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
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
