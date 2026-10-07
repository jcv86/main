import { createAdminClient } from '@/lib/supabase/server'
import { runOpportunityRefreshCron } from '@/lib/opportunities/refresh-catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  return runOpportunityRefreshCron(request, {
    env: process.env,
    createDb: createAdminClient,
  })
}
