import { createClient } from '@/lib/supabase'

interface Interview0Status {
  environment_check?: { passed: boolean; score: number }
  presence_check?: { passed: boolean; score: number }
  audio_check?: { passed: boolean; score: number }
  preparation_check?: { passed: boolean; score: number }
  interview_0_completed?: boolean
  interview_0_score?: number
  interview_0_status?: 'not_started' | 'in_progress' | 'completed'
}

export async function saveInterview0Status(data: Interview0Status) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user authenticated')

    const { error } = await supabase
      .from('a3_entrevista_0')
      .upsert({
        user_id: user.id,
        interview_0_completed: data.interview_0_completed ?? null,
        interview_0_score: data.interview_0_score ?? null,
        interview_0_status: data.interview_0_status ?? 'in_progress',
        environment_check: data.environment_check ?? null,
        presence_check: data.presence_check ?? null,
        audio_check: data.audio_check ?? null,
        preparation_check: data.preparation_check ?? null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error
    console.log('[v0] Interview 0 status saved')
  } catch (err) {
    console.error('[v0] Failed to save interview 0 status:', err)
    throw err
  }
}

export async function getInterview0Status() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('a3_entrevista_0')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    
    return data || null
  } catch (err) {
    console.error('[v0] Failed to get interview 0 status:', err)
    return null
  }
}

export async function completeInterview0(finalScore: number) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user authenticated')

    const { error } = await supabase
      .from('a3_entrevista_0')
      .update({
        interview_0_completed: true,
        interview_0_score: finalScore,
        interview_0_status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (error) throw error
    console.log('[v0] Interview 0 completed')
  } catch (err) {
    console.error('[v0] Failed to complete interview 0:', err)
    throw err
  }
}
