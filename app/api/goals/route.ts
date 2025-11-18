import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')

    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: goals, error } = await supabase
      .from('career_goals')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching goals:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ goals: goals || [] })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, title, description, category, priority, targetDate, timeframe } = body

    if (!userEmail || !title) {
      return NextResponse.json(
        { error: 'User email and title required' },
        { status: 400 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: goal, error } = await supabase
      .from('career_goals')
      .insert({
        user_id: profile.id,
        title,
        description,
        category: category || timeframe || 'development',
        priority: priority || 'medium',
        target_date: targetDate,
        status: 'active',
        progress: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating goal:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ goal })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { goalId, progress, status } = body

    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    
    if (progress !== undefined) updateData.progress = progress
    if (status) updateData.status = status

    const { data: goal, error } = await supabase
      .from('career_goals')
      .update(updateData)
      .eq('id', goalId)
      .select()
      .single()

    if (error) {
      console.error('Error updating goal:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ goal })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
