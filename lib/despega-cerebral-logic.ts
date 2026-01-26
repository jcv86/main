// Tipos de Perfil Despega Cerebral
export type PerfilType = 'A' | 'B' | 'C' | 'D'

export interface RespuestaTest {
  question_id: string
  answer_score: {
    A: number
    B: number
    C: number
    D: number
  }
  question_type: 'conversational' | 'multiple_choice' | 'scale'
}

export interface PerfilDescubierto {
  tipo: PerfilType
  puntuaciones: {
    A: number
    B: number
    C: number
    D: number
  }
  descripcion: string
  fortalezas: string[]
  areas_mejora: string[]
  empleos_ideales: string[]
  compatibilidad: Record<PerfilType, number>
}

// Definiciones de cada perfil
const PERFILES_DEFINICION: Record<PerfilType, any> = {
  A: {
    nombre: 'El Visionario (Dominancia)',
    descripcion:
      'Líder natural, orientado a resultados, decisivo y competitivo. Impulsa el cambio y busca estar en control.',
    fortalezas: [
      'Toma de decisiones rápida',
      'Liderazgo natural',
      'Orientación a resultados',
      'Iniciativa y emprendimiento',
      'Confianza en sí mismo',
    ],
    areas_mejora: [
      'Escucha activa',
      'Delegación efectiva',
      'Trabajo en equipo',
      'Paciencia',
      'Empatía',
    ],
    empleos_ideales: [
      'CEO/Director Ejecutivo',
      'Emprendedor',
      'Sales Manager',
      'Product Manager',
      'Estratega Empresarial',
    ],
  },
  B: {
    nombre: 'El Influenciador (Influencia)',
    descripcion:
      'Carismático, optimista y orientado a las personas. Busca conexión, reconocimiento y trabajar en equipo.',
    fortalezas: [
      'Comunicación excelente',
      'Entusiasmo contagioso',
      'Trabajo en equipo',
      'Creatividad',
      'Motivación',
    ],
    areas_mejora: [
      'Detalles y seguimiento',
      'Análisis profundo',
      'Organización',
      'Responsabilidad',
      'Planificación',
    ],
    empleos_ideales: [
      'Community Manager',
      'Sales Executive',
      'Marketing Manager',
      'Trainer/Coach',
      'HR Manager',
    ],
  },
  C: {
    nombre: 'El Analista (Cumplimiento)',
    descripcion:
      'Meticuloso, preciso y orientado a procesos. Busca exactitud, datos y comprensión profunda.',
    fortalezas: [
      'Análisis profundo',
      'Atención al detalle',
      'Precisión',
      'Calidad',
      'Consistencia',
    ],
    areas_mejora: [
      'Decisión rápida',
      'Flexibilidad',
      'Delegación',
      'Comunicación',
      'Iniciativa',
    ],
    empleos_ideales: [
      'Data Analyst',
      'Quality Assurance',
      'Auditor',
      'Investigador',
      'Ingeniero',
    ],
  },
  D: {
    nombre: 'El Estabilizador (Estabilidad)',
    descripcion:
      'Confiable, paciente y orientado a las personas. Busca armonía, estabilidad y seguridad.',
    fortalezas: [
      'Lealtad',
      'Paciencia',
      'Estabilidad',
      'Empatía',
      'Apoyo a otros',
    ],
    areas_mejora: [
      'Iniciativa',
      'Adaptabilidad',
      'Decisión',
      'Innovación',
      'Assertividad',
    ],
    empleos_ideales: [
      'Customer Support',
      'HR Specialist',
      'Counselor',
      'Maestro',
      'Nurse Manager',
    ],
  },
}

// Matriz de compatibilidad entre perfiles
const COMPATIBILIDAD_PERFILES: Record<PerfilType, Record<PerfilType, number>> = {
  A: { A: 70, B: 85, C: 60, D: 50 },
  B: { A: 85, B: 75, C: 65, D: 80 },
  C: { A: 60, B: 65, C: 70, D: 75 },
  D: { A: 50, B: 80, C: 75, D: 85 },
}

/**
 * Calcula el tipo de perfil basado en respuestas del test
 * @param respuestas Array de respuestas del test
 * @returns PerfilDescubierto con tipo y análisis
 */
export async function calcularPerfilDescubierto(
  respuestas: RespuestaTest[]
): Promise<PerfilDescubierto> {
  // Sumar puntuaciones por dimensión
  const puntuaciones = { A: 0, B: 0, C: 0, D: 0 }

  for (const respuesta of respuestas) {
    puntuaciones.A += respuesta.answer_score.A || 0
    puntuaciones.B += respuesta.answer_score.B || 0
    puntuaciones.C += respuesta.answer_score.C || 0
    puntuaciones.D += respuesta.answer_score.D || 0
  }

  // Encontrar tipo dominante
  const tipo = (
    Object.entries(puntuaciones).sort((a, b) => b[1] - a[1])[0][0]
  ) as PerfilType

  const definicion = PERFILES_DEFINICION[tipo]

  return {
    tipo,
    puntuaciones,
    descripcion: definicion.descripcion,
    fortalezas: definicion.fortalezas,
    areas_mejora: definicion.areas_mejora,
    empleos_ideales: definicion.empleos_ideales,
    compatibilidad: COMPATIBILIDAD_PERFILES[tipo],
  }
}

/**
 * Genera descripciones personalizadas basadas en puntuaciones
 */
export function generarDescripcionPersonalizada(
  perfil: PerfilDescubierto
): string {
  const total = Object.values(perfil.puntuaciones).reduce((a, b) => a + b, 0)
  const porcentajeA = Math.round((perfil.puntuaciones.A / total) * 100)
  const porcentajeB = Math.round((perfil.puntuaciones.B / total) * 100)
  const porcentajeC = Math.round((perfil.puntuaciones.C / total) * 100)
  const porcentajeD = Math.round((perfil.puntuaciones.D / total) * 100)

  return `Tu perfil es principalmente ${perfil.tipo} (${porcentajeA}% Dominancia, ${porcentajeB}% Influencia, ${porcentajeC}% Cumplimiento, ${porcentajeD}% Estabilidad). ${perfil.descripcion}`
}
