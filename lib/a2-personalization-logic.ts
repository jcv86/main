import { createClient } from '@/app/utils/supabase/client'

const supabase = createClient()

// Tipos
export type PerfilTipo = 'A' | 'B' | 'C' | 'D'
export type FormatoAccion = 'video' | 'lectura' | 'ejercicio' | 'proyecto' | 'quiz' | 'reflexion' | 'networking'

export interface LearningRoute {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  perfil_ideal: PerfilTipo
  nivel: string
  duracion_dias: number
  icono: string
  color: string
}

export interface MicroAction {
  id: string
  dia: number
  tipo_perfil: PerfilTipo
  titulo: string
  descripcion: string
  formato: FormatoAccion
  duracion_minutos: number
  tareas: any
  objetivos: string[]
}

export interface UserRouteProgress {
  id: string
  route_id: string
  estado: string
  dia_actual: number
  porcentaje_completado: number
  fecha_inicio: string
}

// Configuración de personalización por perfil
export const PERFIL_CONFIG = {
  A: {
    nombre: 'Dominante',
    emoji: '⚡',
    formatos_preferidos: ['proyecto', 'ejercicio', 'video'],
    estilo: 'Rápido, orientado a resultados, con decisiones',
    duracion_max_minutos: 45,
    descripcion_formato: 'Contenido directo, sin relleno, con aplicación inmediata'
  },
  B: {
    nombre: 'Influyente',
    emoji: '🌟',
    formatos_preferidos: ['video', 'networking', 'reflexion'],
    estilo: 'Social, creativo, con compartición',
    duracion_max_minutos: 60,
    descripcion_formato: 'Historias, casos de éxito, oportunidades de compartir'
  },
  C: {
    nombre: 'Cumplidor',
    emoji: '🎯',
    formatos_preferidos: ['lectura', 'ejercicio', 'quiz'],
    estilo: 'Ordenado, validado, paso a paso',
    duracion_max_minutos: 90,
    descripcion_formato: 'Documentación completa, ejercicios estructurados, validaciones'
  },
  D: {
    nombre: 'Estable',
    emoji: '🛡️',
    formatos_preferidos: ['video', 'reflexion', 'lectura'],
    estilo: 'Gradual, con soporte de comunidad',
    duracion_max_minutos: 60,
    descripcion_formato: 'Ritmo tranquilo, apoyo continuo, práctica colaborativa'
  }
}

// Obtener rutas recomendadas según perfil del usuario
export async function getRecommendedRoutes(userId: string, userPerfil: PerfilTipo): Promise<LearningRoute[]> {
  // Obtener todas las rutas
  const { data: routes, error } = await supabase
    .from('a2_learning_routes')
    .select('*')
    .eq('activo', true)
    .order('perfil_ideal')

  if (error || !routes) {
    console.error('[v0] Error obteniendo rutas:', error)
    return []
  }

  // Ordenar por match con perfil (primero las del perfil del usuario)
  return routes.sort((a, b) => {
    if (a.perfil_ideal === userPerfil && b.perfil_ideal !== userPerfil) return -1
    if (b.perfil_ideal === userPerfil && a.perfil_ideal !== userPerfil) return 1
    return 0
  })
}

// Obtener microacciones del día adaptadas al perfil
export async function getDailyMicroActions(
  userId: string,
  routeId: string,
  dia: number,
  userPerfil: PerfilTipo,
  capacidadDisponible: number // minutos disponibles según CIP
): Promise<MicroAction[]> {
  // Buscar acciones del día para el perfil del usuario
  const { data: actions, error } = await supabase
    .from('a2_micro_actions')
    .select(`
      *,
      a2_route_modules!inner(route_id)
    `)
    .eq('a2_route_modules.route_id', routeId)
    .eq('dia', dia)
    .eq('tipo_perfil', userPerfil)
    .order('duracion_minutos')

  if (error) {
    console.error('[v0] Error obteniendo acciones:', error)
    return []
  }

  if (!actions || actions.length === 0) {
    // Generar acciones por defecto si no existen
    return generateDefaultActions(dia, userPerfil, capacidadDisponible)
  }

  // Filtrar según capacidad disponible
  let tiempoAcumulado = 0
  return actions.filter(action => {
    if (tiempoAcumulado + action.duracion_minutos <= capacidadDisponible) {
      tiempoAcumulado += action.duracion_minutos
      return true
    }
    return false
  })
}

// Generar acciones por defecto según perfil
function generateDefaultActions(dia: number, perfil: PerfilTipo, capacidadMinutos: number): MicroAction[] {
  const config = PERFIL_CONFIG[perfil]
  const actions: MicroAction[] = []

  // Distribuir tiempo según formatos preferidos del perfil
  const tiempoPorAccion = Math.floor(capacidadMinutos / 3)

  config.formatos_preferidos.slice(0, 3).forEach((formato, idx) => {
    actions.push({
      id: `default-${dia}-${perfil}-${idx}`,
      dia,
      tipo_perfil: perfil,
      titulo: getTituloByFormato(formato, perfil, dia),
      descripcion: getDescripcionByFormato(formato, perfil),
      formato: formato as FormatoAccion,
      duracion_minutos: tiempoPorAccion,
      tareas: getTareasByFormato(formato, perfil),
      objetivos: [`Completar ${formato} del día ${dia}`]
    })
  })

  return actions
}

function getTituloByFormato(formato: string, perfil: PerfilTipo, dia: number): string {
  const titulos: Record<string, Record<PerfilTipo, string>> = {
    video: {
      A: `Día ${dia}: Resumen ejecutivo en video`,
      B: `Día ${dia}: Historia de éxito inspiradora`,
      C: `Día ${dia}: Tutorial paso a paso`,
      D: `Día ${dia}: Guía visual con ejemplos`
    },
    ejercicio: {
      A: `Día ${dia}: Reto práctico - Resultados rápidos`,
      B: `Día ${dia}: Ejercicio creativo para compartir`,
      C: `Día ${dia}: Práctica estructurada con validación`,
      D: `Día ${dia}: Ejercicio colaborativo`
    },
    proyecto: {
      A: `Día ${dia}: Proyecto de impacto inmediato`,
      B: `Día ${dia}: Proyecto para tu portafolio social`,
      C: `Día ${dia}: Proyecto documentado paso a paso`,
      D: `Día ${dia}: Proyecto en equipo`
    },
    lectura: {
      A: `Día ${dia}: Lectura clave (5 min)`,
      B: `Día ${dia}: Caso de estudio inspirador`,
      C: `Día ${dia}: Documentación completa`,
      D: `Día ${dia}: Guía con ejemplos reales`
    },
    quiz: {
      A: `Día ${dia}: Evaluación rápida`,
      B: `Día ${dia}: Quiz interactivo`,
      C: `Día ${dia}: Validación de conocimientos`,
      D: `Día ${dia}: Autoevaluación con feedback`
    },
    reflexion: {
      A: `Día ${dia}: Reflexión de 5 minutos`,
      B: `Día ${dia}: Comparte tu aprendizaje`,
      C: `Día ${dia}: Análisis de progreso`,
      D: `Día ${dia}: Reflexión guiada`
    },
    networking: {
      A: `Día ${dia}: Conexión estratégica`,
      B: `Día ${dia}: Networking activo`,
      C: `Día ${dia}: Contacto profesional`,
      D: `Día ${dia}: Comunidad de apoyo`
    }
  }
  return titulos[formato]?.[perfil] || `Día ${dia}: ${formato}`
}

function getDescripcionByFormato(formato: string, perfil: PerfilTipo): string {
  const descripciones: Record<PerfilTipo, string> = {
    A: 'Acción directa con resultados medibles',
    B: 'Experiencia social y creativa',
    C: 'Proceso estructurado con documentación',
    D: 'Aprendizaje colaborativo y gradual'
  }
  return descripciones[perfil]
}

function getTareasByFormato(formato: string, perfil: PerfilTipo): any {
  const tareas: Record<PerfilTipo, string[]> = {
    A: ['Completar en tiempo récord', 'Aplicar inmediatamente', 'Medir resultado'],
    B: ['Disfrutar el proceso', 'Compartir con otros', 'Celebrar logro'],
    C: ['Seguir cada paso', 'Validar comprensión', 'Documentar aprendizaje'],
    D: ['Avanzar a tu ritmo', 'Pedir ayuda si necesitas', 'Reflexionar sobre progreso']
  }
  return { pasos: tareas[perfil] }
}

// Marcar acción como completada
export async function completeAction(userId: string, actionId: string, tiempoReal: number, calificacion?: number): Promise<boolean> {
  const { error } = await supabase
    .from('a2_user_actions_completed')
    .insert({
      user_id: userId,
      action_id: actionId,
      tiempo_real_minutos: tiempoReal,
      calificacion
    })

  if (error) {
    console.error('[v0] Error completando acción:', error)
    return false
  }

  return true
}

// Obtener progreso del usuario en una ruta
export async function getUserRouteProgress(userId: string, routeId: string): Promise<UserRouteProgress | null> {
  const { data, error } = await supabase
    .from('a2_user_route_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('route_id', routeId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[v0] Error obteniendo progreso:', error)
  }

  return data
}

// Iniciar una ruta para el usuario
export async function startRoute(userId: string, routeId: string): Promise<UserRouteProgress | null> {
  const { data, error } = await supabase
    .from('a2_user_route_progress')
    .insert({
      user_id: userId,
      route_id: routeId,
      estado: 'activo',
      dia_actual: 1,
      porcentaje_completado: 0
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error iniciando ruta:', error)
    return null
  }

  return data
}

// Actualizar día actual del usuario
export async function updateUserDay(userId: string, routeId: string, newDay: number, porcentaje: number): Promise<boolean> {
  const { error } = await supabase
    .from('a2_user_route_progress')
    .update({
      dia_actual: newDay,
      porcentaje_completado: porcentaje,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('route_id', routeId)

  if (error) {
    console.error('[v0] Error actualizando día:', error)
    return false
  }

  return true
}
