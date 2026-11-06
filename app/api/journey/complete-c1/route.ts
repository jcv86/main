import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import {
  C1_ACTOR_HEADER, C1_EXPECTED_ACTOR_HEADER, C1_COMPLETION_ERRORS, c1CompletionDatabaseError, parseC1CompletionInput,
  parseC1CompletionResult, parseC1CompletionStatus, type C1CompletionErrorCode,
} from '@/lib/c1-completion'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' }

function failure(error: C1CompletionErrorCode) {
  const { status, message } = C1_COMPLETION_ERRORS[error]
  return NextResponse.json({ success: false, error, message }, { status, headers: NO_STORE })
}

async function currentActor(): Promise<{ userId: string } | { error: C1CompletionErrorCode }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      const unavailable = error.name === 'AuthRetryableFetchError' || (error.status ?? 0) >= 500
      return { error: unavailable ? 'completion_unavailable' : 'authentication_required' }
    }
    return data.user?.id ? { userId: data.user.id } : { error: 'authentication_required' }
  } catch {
    return { error: 'completion_unavailable' }
  }
}

export async function GET() {
  const actor = await currentActor()
  if ('error' in actor) return failure(actor.error)
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.rpc('get_c1_completion_status', { p_user_id: actor.userId })
    if (error) return failure(c1CompletionDatabaseError(error))
    const status = parseC1CompletionStatus(data)
    if (!status) return failure('completion_unavailable')
    return NextResponse.json(status, { headers: { ...NO_STORE, [C1_ACTOR_HEADER]: actor.userId } })
  } catch {
    return failure('completion_unavailable')
  }
}

export async function POST(request: Request) {
  const actor = await currentActor()
  if ('error' in actor) return failure(actor.error)
  // A browser may have changed accounts in another tab. This is a precondition,
  // never an identity source: every database call still uses verified getUser().
  if (request.headers.get(C1_EXPECTED_ACTOR_HEADER) !== actor.userId) return failure('session_changed')
  let input
  try { input = parseC1CompletionInput(await request.json()) }
  catch { return failure('invalid_answers') }
  if (!input) return failure('invalid_answers')
  try {
    const admin = createAdminClient()
    // Admission, revision comparison and all three writes belong to this one
    // transaction. No owner or response/draft identity comes from the browser.
    const { data, error } = await admin.rpc('complete_c1_atomic', {
      p_user_id: actor.userId,
      p_schema_version: input.schemaVersion,
      p_answers: input.answers,
      p_expected_draft_updated_at: input.expectedDraftUpdatedAt,
    })
    if (error) return failure(c1CompletionDatabaseError(error))
    const result = parseC1CompletionResult(data)
    if (!result) return failure('completion_unavailable')
    return NextResponse.json({ success: true, ...result }, { headers: NO_STORE })
  } catch {
    return failure('completion_unavailable')
  }
}
