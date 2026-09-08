import { createAdminClient, createClient } from '@/lib/supabase/server'
import { loadA1ReportBundle } from '@/lib/reports/user-report-data'
import { handleClarificationUpdate } from '@/lib/a1/clarification-handler'
import { CLARIFICATION_KEY } from '@/lib/a1/individual-understanding'
import { record } from '@/lib/a1/individual-evidence'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PUT(request: Request) {
  return handleClarificationUpdate(request, {
    authenticate: async () => {
      const supabase = await createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return null
      const admin = createAdminClient()
      const { data, error: accessError } = await admin.rpc('resolve_pilot_access', { p_user_id: user.id, p_claim_id: null })
      const access = Array.isArray(data) ? data[0] : data
      if (accessError || !access?.allowed) return null
      return user.id
    },
    load: async (userId) => {
      const bundle = await loadA1ReportBundle(userId)
      if (!bundle?.c2?.responses || !bundle.c2.completed_at || bundle.report.understanding.responseState !== 'available') return null
      return bundle
    },
    persist: async (userId, snapshot, envelope) => {
      if (!snapshot.c2) return false
      const admin = createAdminClient()
      // Compare-and-swap preserves all existing C2 answers and rejects a concurrent writer.
      let update = admin.from('canon_conozcamonos_2_responses')
        .update({ responses: { ...record(snapshot.c2.responses), [CLARIFICATION_KEY]: envelope }, updated_at: envelope.savedAt })
        .eq('user_id', userId).eq('id', snapshot.c2.id)
        .eq('responses', JSON.stringify(snapshot.c2.responses))
      update = snapshot.c2.updated_at ? update.eq('updated_at', snapshot.c2.updated_at) : update.is('updated_at', null)
      const { data, error } = await update.select('id')
      if (error) throw new Error('clarification_write_failed')
      return data?.length === 1
    },
    now: () => new Date().toISOString(),
  })
}
