import { createClient } from '@/app/utils/supabase/server'
import { recommendTasksForToday, createCIPTask, completeTask } from '@/lib/cip-task-logic'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  // GET /api/cip/tasks?action=recommendations
  if (action === 'recommendations') {
    try {
      const recommendations = await recommendTasksForToday(user.id)
      return NextResponse.json(recommendations)
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }
  }

  // GET /api/cip/tasks?action=summary - Resumen diario
  if (action === 'summary') {
    const { data } = await supabase
      .from('cip_daily_task_summary')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .single()

    return NextResponse.json(data)
  }

  // GET /api/cip/tasks - Todas las tareas del usuario
  const { data: tasks, error } = await supabase
    .from('cip_tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', new Date().toISOString().split('T')[0])
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ tasks })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, category, estimated_duration, priority, action } = body

  // POST /api/cip/tasks - Crear tarea
  if (action === 'create') {
    try {
      const task = await createCIPTask(
        user.id,
        title,
        category,
        estimated_duration,
        priority
      )
      return NextResponse.json({ task }, { status: 201 })
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }
  }

  // POST /api/cip/tasks - Completar tarea
  if (action === 'complete') {
    try {
      const { task_id, actual_duration, success } = body
      const updated = await completeTask(user.id, task_id, actual_duration, success)
      return NextResponse.json({ task: updated })
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
