import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access } from './access-control'
import { getSantiagoCronWindow } from './cron-clock'
import { captureA4DailySnapshotForUser } from './snapshot-capture'

const PAGE_SIZE = 1000
const CONCURRENCY = 5

type AdminClient = ReturnType<typeof createAdminClient>

function safeSecretMatch(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  )
}

function authorizeCron(request: Request):
  | { authorized: true }
  | { authorized: false; response: NextResponse } {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret || secret.length < 16) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'CRON_SECRET no está configurado de forma segura.' },
        { status: 503 },
      ),
    }
  }

  const expected = `Bearer ${secret}`
  const actual = request.headers.get('authorization') || ''
  if (!safeSecretMatch(actual, expected)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    }
  }

  return { authorized: true }
}

async function collectUserIdsFromTable(
  supabase: AdminClient,
  table: 'a4_verified_signals' | 'a4_decision_log',
): Promise<Set<string>> {
  const users = new Set<string>()
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('user_id')
      .order('user_id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    if (error) throw new Error(`Unable to enumerate ${table}: ${error.message}`)
    for (const row of data ?? []) {
      if (typeof row.user_id === 'string' && row.user_id) users.add(row.user_id)
    }
    if (!data || data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return users
}

async function collectCandidateUserIds(supabase: AdminClient): Promise<string[]> {
  const [signalUsers, decisionUsers] = await Promise.all([
    collectUserIdsFromTable(supabase, 'a4_verified_signals'),
    collectUserIdsFromTable(supabase, 'a4_decision_log'),
  ])
  return [...new Set([...signalUsers, ...decisionUsers])].sort()
}

export async function runA4DailySnapshotCron(request: Request) {
  const authorization = authorizeCron(request)
  if (!authorization.authorized) return authorization.response

  const now = new Date()
  const window = getSantiagoCronWindow(now)
  if (!window.shouldRun) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: 'OUTSIDE_SANTIAGO_08_WINDOW',
      localDate: window.date,
      localHour: window.hour,
      localMinute: window.minute,
    })
  }

  try {
    const supabase = createAdminClient()
    const userIds = await collectCandidateUserIds(supabase)
    const result = {
      candidates: userIds.length,
      captured: 0,
      evidenceChanged: 0,
      withoutNewEvidence: 0,
      skippedNoAccess: 0,
      skippedNoEvidence: 0,
      failed: 0,
      summaries: [] as Array<{
        userId: string
        currentDate: string
        previousDate: string
        daysApart: number
        metrics: unknown
        categoryChanges: unknown
      }>,
      failures: [] as Array<{ userId: string; error: string }>,
    }

    for (let index = 0; index < userIds.length; index += CONCURRENCY) {
      const batch = userIds.slice(index, index + CONCURRENCY)
      await Promise.all(
        batch.map(async (userId) => {
          try {
            const access = await checkA4Access(userId, supabase)
            if (!access.canAccess) {
              result.skippedNoAccess += 1
              return
            }

            const capture = await captureA4DailySnapshotForUser({
              userId,
              supabase,
              now,
            })
            if (capture.status === 'no_evidence') {
              result.skippedNoEvidence += 1
              return
            }

            result.captured += 1
            if (capture.evidenceChanged) result.evidenceChanged += 1
            else result.withoutNewEvidence += 1

            if (capture.summary) {
              result.summaries.push({
                userId,
                ...capture.summary,
              })
            }
          } catch (error) {
            result.failed += 1
            result.failures.push({
              userId,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }
        }),
      )
    }

    return NextResponse.json({
      success: result.failed === 0,
      localDate: window.date,
      timezone: 'America/Santiago',
      ...result,
    })
  } catch (error) {
    console.error('[v0] A4 daily snapshot cron error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Cron execution failed',
      },
      { status: 500 },
    )
  }
}
