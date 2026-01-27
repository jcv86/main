import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export interface EntrevistaPregunta {
  id: string
  titulo: string
  descripcion: string
  tipo: 'educacion' | 'asistencia' | 'transicion'
  preguntas: string[]
  duracion_estimada: number
}

// Obtener entrevistas disponibles
export async function getEntrevistasDisponibles(userId: string) {
  const { data: profile } = await supabase
    .from('despega_perfil_informe')
    .select('perfil_tipo')
    .eq('user_id', userId)
    .single()

  if (!profile) return []

  const { data: entrevistas } = await supabase
    .from('a3_entrevistas')
    .select('*')
    .eq('perfil_ideal', profile.perfil_tipo)
    .order('orden')

  return entrevistas || []
}

// Guardar respuestas de entrevista
export async function guardarRespuestasEntrevista(
  userId: string,
  entrevistaId: string,
  respuestas: string[]
) {
  const { data, error } = await supabase
    .from('a3_user_entrevistas')
    .insert({
      user_id: userId,
      entrevista_id: entrevistaId,
      respuestas,
      completado_en: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Obtener progreso del usuario en A3
export async function getUserA3Progress(userId: string) {
  const { data: progress } = await supabase
    .from('a3_user_progreso')
    .select('*')
    .eq('user_id', userId)
    .single()

  return progress
}

// Actualizar progreso A3
export async function updateA3Progress(
  userId: string,
  dia: number,
  entrevistasCompletadas: number
) {
  const { data, error } = await supabase
    .from('a3_user_progreso')
    .update({
      dia_actual: dia,
      entrevistas_completadas: entrevistasCompletadas,
      porcentaje_completado: (entrevistasCompletadas / 6) * 100,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
