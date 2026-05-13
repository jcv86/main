import { NextRequest, NextResponse } from 'next/server'

interface TaskCompletion {
  taskId: string
  day: number
  type: string
  xpEarned: number
  completedAt: string
}

// In-memory store (in production, use database)
const completedTasks: Map<string, TaskCompletion[]> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, day, type, xpEarned, userId } = body

    if (!taskId || !day || !type || !userId) {
      return NextResponse.json(
        { error: 'taskId, day, type, and userId required' },
        { status: 400 }
      )
    }

    const completion: TaskCompletion = {
      taskId,
      day,
      type,
      xpEarned: xpEarned || 50,
      completedAt: new Date().toISOString()
    }

    if (!completedTasks.has(userId)) {
      completedTasks.set(userId, [])
    }

    const userTasks = completedTasks.get(userId)!
    userTasks.push(completion)

    console.log(`[v0] Task completed: ${taskId} for user ${userId}`)

    return NextResponse.json({
      success: true,
      data: {
        completion,
        totalTasksCompleted: userTasks.length,
        totalXpEarned: userTasks.reduce((sum, t) => sum + t.xpEarned, 0)
      }
    })
  } catch (error) {
    console.error('[v0] Error completing task:', error)
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      )
    }

    const userTasks = completedTasks.get(userId) || []

    return NextResponse.json({
      success: true,
      data: {
        userId,
        completedTasks: userTasks,
        totalTasksCompleted: userTasks.length,
        totalXpEarned: userTasks.reduce((sum, t) => sum + t.xpEarned, 0)
      }
    })
  } catch (error) {
    console.error('[v0] Error fetching completed tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch completed tasks' },
      { status: 500 }
    )
  }
}
