import type { createAdminClient } from '@/lib/supabase/server'
import { resolveA2PracticePath } from '@/lib/a2/practice-path'

export async function loadA2PracticePath(userId: string, supabase: ReturnType<typeof createAdminClient>) {
  const { data, error } = await supabase.from('despega_user_profiles')
    .select('camino_foco,camino_persona_active,camino_profesional_active')
    .eq('user_id', userId).maybeSingle()
  if (error) throw error
  return resolveA2PracticePath(data)
}
