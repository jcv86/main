import { runA4DailySnapshotCron } from '@/lib/a4/daily-snapshot-cron'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  return runA4DailySnapshotCron(request)
}
