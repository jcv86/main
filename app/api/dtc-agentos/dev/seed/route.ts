import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { seedDemoData, inspectUserState, isDevModeUser } from '@/lib/dtc-agentos/dev/dev-mode'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is allowed to use dev mode
    const isDevUser = await isDevModeUser(user.id)
    if (!isDevUser) {
      return NextResponse.json(
        { error: 'Dev mode not available for this user' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      includeC1 = true,
      includeA1 = true,
      includeC2 = true,
      includeA2Days = true,
      includeA3Progress = true,
      includeA4Documents = true,
    } = body

    const result = await seedDemoData(user.id, {
      includeC1,
      includeA1,
      includeC2,
      includeA2Days,
      includeA3Progress,
      includeA4Documents,
    })

    return NextResponse.json({
      success: true,
      status: result.status,
      seededData: result.data,
    })
  } catch (error) {
    console.error('[v0] Error seeding dev data:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is allowed to use dev mode
    const isDevUser = await isDevModeUser(user.id)
    if (!isDevUser) {
      return NextResponse.json(
        { error: 'Dev mode not available for this user' },
        { status: 403 }
      )
    }

    const state = await inspectUserState(user.id)

    return NextResponse.json({
      success: true,
      isDevMode: true,
      state,
    })
  } catch (error) {
    console.error('[v0] Error inspecting dev state:', error)
    return NextResponse.json({ error: 'Failed to inspect state' }, { status: 500 })
  }
}
