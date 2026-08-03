import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getSantiagoCronWindow } from '../lib/a4/cron-clock'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const winterAtEight = getSantiagoCronWindow(
  new Date('2026-08-03T12:00:00.000Z'),
)
assert.equal(winterAtEight.date, '2026-08-03')
assert.equal(winterAtEight.hour, 8)
assert.equal(winterAtEight.shouldRun, true)

const winterEarly = getSantiagoCronWindow(
  new Date('2026-08-03T11:00:00.000Z'),
)
assert.equal(winterEarly.hour, 7)
assert.equal(winterEarly.shouldRun, false)

const summerAtEight = getSantiagoCronWindow(
  new Date('2026-01-05T11:00:00.000Z'),
)
assert.equal(summerAtEight.hour, 8)
assert.equal(summerAtEight.shouldRun, true)

const summerLate = getSantiagoCronWindow(
  new Date('2026-01-05T12:00:00.000Z'),
)
assert.equal(summerLate.hour, 9)
assert.equal(summerLate.shouldRun, false)

const vercel = source('vercel.json')
const cron = source('lib/a4/daily-snapshot-cron.ts')
const capture = source('lib/a4/snapshot-capture.ts')
const clock = source('lib/a4/cron-clock.ts')
const route11 = source('app/api/cron/a4-daily-snapshots-utc11/route.ts')
const route12 = source('app/api/cron/a4-daily-snapshots-utc12/route.ts')
const manualRoute = source('app/api/a4/snapshots/route.ts')
const history = source('components/a4/daily-snapshot-history.tsx')
const workflow = source('.github/workflows/typecheck.yml')

assert.ok(vercel.includes('/api/cron/a4-daily-snapshots-utc11'))
assert.ok(vercel.includes('"schedule": "0 11 * * *"'))
assert.ok(vercel.includes('/api/cron/a4-daily-snapshots-utc12'))
assert.ok(vercel.includes('"schedule": "0 12 * * *"'))

assert.ok(clock.includes("timeZone: 'America/Santiago'"))
assert.ok(clock.includes('shouldRun: hour === 8'))
assert.ok(cron.includes('process.env.CRON_SECRET'))
assert.ok(cron.includes('timingSafeEqual'))
assert.ok(cron.includes('secret.length < 16'))
assert.ok(cron.includes("reason: 'OUTSIDE_SANTIAGO_08_WINDOW'"))
assert.ok(cron.includes("collectUserIdsFromTable(supabase, 'a4_verified_signals')"))
assert.ok(cron.includes("collectUserIdsFromTable(supabase, 'a4_decision_log')"))
assert.ok(cron.includes('checkA4Access(userId, supabase)'))
assert.ok(cron.includes("capture.status === 'no_evidence'"))
assert.ok(cron.includes('if (capture.summary)'))
assert.ok(cron.includes('withoutNewEvidence'))
assert.ok(!cron.includes('request.json()'))

assert.ok(capture.includes('latestEvidenceUpdatedAt > previousSnapshot.updated_at'))
assert.ok(capture.includes('const summary = evidenceChanged && comparison'))
assert.ok(capture.includes("status: 'no_evidence'"))
assert.ok(capture.includes("onConflict: 'user_id,snapshot_date'"))
assert.ok(capture.includes('dailySnapshotFromPulse(pulse)'))
assert.ok(!capture.includes('userId: body'))

assert.ok(route11.includes('runA4DailySnapshotCron(request)'))
assert.ok(route12.includes('runA4DailySnapshotCron(request)'))
assert.ok(route11.includes('maxDuration = 60'))
assert.ok(route12.includes('maxDuration = 60'))

assert.ok(manualRoute.includes('captureA4DailySnapshotForUser'))
assert.ok(manualRoute.includes("reason: 'NO_EVIDENCE'"))
assert.ok(history.includes('El servidor captura el corte diario a las 08:00 de Chile'))
assert.ok(history.includes('if (payload.skipped)'))
assert.ok(
  workflow.includes('A4 cron clock runtime logic and source contract'),
)

console.log(
  JSON.stringify({
    evidenceLevel: 'mixed_runtime_and_source_contract',
    runtimeValidated: [
      'America/Santiago winter 08:00 window',
      'America/Santiago summer 08:00 window',
      'winter and summer off-hour rejection',
    ],
    sourceContractsChecked: [
      'dual UTC Vercel schedules',
      'CRON_SECRET and constant-time comparison wiring',
      'A4 access gate wiring',
      'no-evidence skip wiring',
      'conditional summary wiring',
      'user-date upsert wiring',
    ],
    liveCronInvocationInThisScript: false,
    liveDatabaseCheckedInThisScript: false,
  }),
)
