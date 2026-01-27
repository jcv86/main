import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export interface EmpleadorMatch {
  empleador_id: string
  nombre: string
  logo_url: string
  match_score: number
  razon: string
}

// Obtener empleadores que coinciden con el perfil
export async function getEmpleadorMatches(userId: string): Promise<EmpleadorMatch[]> {
  const { data: userProfile } = await supabase
    .from('despega_perfil_informe')
    .select('perfil_tipo')
    .eq('user_id', userId)
    .single()

  if (!userProfile) return []

  const { data: matches } = await supabase
    .from('a3_user_empleador_match')
    .select(`
      empleador_id,
      match_score,
      a3_empleadores(nombre, logo_url)
    `)
    .eq('user_id', userId)
    .order('match_score', { ascending: false })

  return (matches || []).map(m => ({
    empleador_id: m.empleador_id,
    nombre: m.a3_empleadores?.nombre || 'Desconocido',
    logo_url: m.a3_empleadores?.logo_url || '',
    match_score: m.match_score,
    razon: `Coincidencia con tu perfil ${userProfile.perfil_tipo}`
  }))
}

// Enviar informe a empleador
export async function enviarInformeAEmpleador(
  userId: string,
  empleadorId: string,
  reporteUrl: string
) {
  const { data, error } = await supabase
    .from('a3_user_empleador_match')
    .update({
      reporte_enviado: true,
      reporte_url: reporteUrl,
      fecha_envio: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('empleador_id', empleadorId)
    .select()

  if (error) throw error
  return data
}
