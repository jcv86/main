// Sistema de Progreso y Recompensas basado en microacciones completadas
// Niveles: Bronze, Silver, Gold, Platinum (según acciones completadas)
// Recompensas: Puntos, Badges, Unlocks según dificultad

// Tipos de dificultad de microacciones
export type DificultadAccion = 'facil' | 'intermedia' | 'dificil' | 'experto'

// Configuración de niveles
export const NIVELES = {
  BRONZE: { nombre: 'Bronze', min_acciones: 0, max_acciones: 9, color: '#CD7F32', icono: '🥉' },
  SILVER: { nombre: 'Silver', min_acciones: 10, max_acciones: 24, color: '#C0C0C0', icono: '🥈' },
  GOLD: { nombre: 'Gold', min_acciones: 25, max_acciones: 49, color: '#FFD700', icono: '🥇' },
  PLATINUM: { nombre: 'Platinum', min_acciones: 50, max_acciones: Infinity, color: '#E5E4E2', icono: '💎' }
}

// Puntos por dificultad
export const PUNTOS_POR_DIFICULTAD: Record<DificultadAccion, number> = {
  facil: 10,
  intermedia: 25,
  dificil: 50,
  experto: 100
}

// Badges disponibles
export const BADGES = {
  PRIMER_DIA: { id: 'primer_dia', nombre: 'Primer Paso', descripcion: 'Completa tu primera microacción', icono: '🚀' },
  SEMANA_COMPLETA: { id: 'semana_completa', nombre: 'Semana Consistente', descripcion: '7 días de acciones completadas', icono: '📅' },
  DOMADOR: { id: 'domador', nombre: 'Domador de Dificultades', descripcion: 'Completa 5 acciones de nivel experto', icono: '🎯' },
  RACHA_FUEGO: { id: 'racha_fuego', nombre: 'Racha de Fuego', descripcion: '15 días sin faltar', icono: '🔥' },
  MAESTRO: { id: 'maestro', nombre: 'Maestro del Aprendizaje', descripcion: 'Completa 50 acciones', icono: '👑' },
  ATERRIZAJE_EXITOSO: { id: 'aterrizaje_exitoso', nombre: 'Aterrizaje Exitoso', descripcion: 'Completa ruta y consigue oferta de empleo', icono: '🎓' }
}

// Calcular nivel actual basado en acciones completadas
export function calcularNivel(accionesCompletadas: number): string {
  if (accionesCompletadas >= NIVELES.PLATINUM.min_acciones) return 'PLATINUM'
  if (accionesCompletadas >= NIVELES.GOLD.min_acciones) return 'GOLD'
  if (accionesCompletadas >= NIVELES.SILVER.min_acciones) return 'SILVER'
  return 'BRONZE'
}

// Calcular progreso dentro del nivel actual
export function calcularProgresoNivel(accionesCompletadas: number) {
  const nivel = calcularNivel(accionesCompletadas)
  const nivelConfig = NIVELES[nivel as keyof typeof NIVELES]
  const min = nivelConfig.min_acciones
  const max = nivel === 'PLATINUM' ? accionesCompletadas + 10 : nivelConfig.max_acciones
  const progreso = accionesCompletadas - min
  const total = max - min
  
  return {
    nivel,
    progreso,
    total,
    porcentaje: Math.min(100, Math.round((progreso / total) * 100))
  }
}

// Calcular puntos totales por acciones
export function calcularPuntosTotales(acciones: Array<{ dificultad: DificultadAccion }>) {
  return acciones.reduce((total, accion) => total + PUNTOS_POR_DIFICULTAD[accion.dificultad], 0)
}

// Generar recomendaciones de recompensas basado en desempeño
export function generarRecompensas(
  accionesCompletadas: number,
  accionesExpertoCompletadas: number,
  diasConsecutivos: number,
  accionesCompletadasPorDificultad: Record<DificultadAccion, number>
) {
  const recompensas = []
  
  // Primer día
  if (accionesCompletadas === 1) {
    recompensas.push(BADGES.PRIMER_DIA)
  }
  
  // Semana completa
  if (diasConsecutivos >= 7) {
    recompensas.push(BADGES.SEMANA_COMPLETA)
  }
  
  // Domador de dificultades
  if (accionesExpertoCompletadas >= 5) {
    recompensas.push(BADGES.DOMADOR)
  }
  
  // Racha de fuego
  if (diasConsecutivos >= 15) {
    recompensas.push(BADGES.RACHA_FUEGO)
  }
  
  // Maestro del aprendizaje
  if (accionesCompletadas >= 50) {
    recompensas.push(BADGES.MAESTRO)
  }
  
  return recompensas
}

// Calcular ranking global (percentil)
export function calcularPercentil(puntosUsuario: number, puntosPromedio: number) {
  if (puntosPromedio === 0) return 50
  return Math.min(100, Math.round((puntosUsuario / puntosPromedio) * 100))
}

// Interfaz de progreso consolidado
export interface ProgresoDespega {
  accionesCompletadas: number
  accionesCompletadasPorDificultad: Record<DificultadAccion, number>
  puntosTotales: number
  nivel: string
  progresoNivel: {
    porcentaje: number
    proxima_accion_para_subir: number
  }
  diasConsecutivos: number
  diasTotalesActivos: number
  badges: typeof BADGES[keyof typeof BADGES][]
  percentilGlobal: number
  rutas_completadas: number
  ofertas_laborales: number
}

// Función principal de cálculo de progreso
export function calcularProgresoCompleto(
  accionesCompletadas: number,
  accionesCompletadasPorDificultad: Record<DificultadAccion, number>,
  diasConsecutivos: number,
  diasTotalesActivos: number,
  rutasCompletadas: number,
  ofertasLaborales: number,
  puntosPromedio: number
): ProgresoDespega {
  const puntosTotales = Object.entries(accionesCompletadasPorDificultad).reduce(
    (total, [dificultad, cantidad]) => total + (PUNTOS_POR_DIFICULTAD[dificultad as DificultadAccion] * cantidad),
    0
  )
  
  const nivel = calcularNivel(accionesCompletadas)
  const progresoNivel = calcularProgresoNivel(accionesCompletadas)
  const accionesExpertoCompletadas = accionesCompletadasPorDificultad.experto || 0
  const badges = generarRecompensas(accionesCompletadas, accionesExpertoCompletadas, diasConsecutivos, accionesCompletadasPorDificultad)
  
  return {
    accionesCompletadas,
    accionesCompletadasPorDificultad,
    puntosTotales,
    nivel,
    progresoNivel: {
      porcentaje: progresoNivel.porcentaje,
      proxima_accion_para_subir: (progresoNivel.total + 1) - progresoNivel.progreso
    },
    diasConsecutivos,
    diasTotalesActivos,
    badges,
    percentilGlobal: calcularPercentil(puntosTotales, puntosPromedio),
    rutas_completadas: rutasCompletadas,
    ofertas_laborales: ofertasLaborales
  }
}
