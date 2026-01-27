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

// Colores oficiales Despega Cerebral (basado en metodologia de perfiles)
export const PERFIL_COLORES = {
  A: { primary: '#DC2626', bg: '#FEE2E2', border: '#FECACA' }, // Rojo - Dominancia
  B: { primary: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' }, // Amarillo - Influencia
  C: { primary: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE' }, // Azul - Cumplimiento
  D: { primary: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0' }, // Verde - Estabilidad
}

// Definiciones de cada perfil Despega Cerebral
const PERFILES_DEFINICION: Record<PerfilType, any> = {
  A: {
    nombre: 'El Visionario (Dominancia)',
    color: PERFIL_COLORES.A,
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
 * Versión simplificada para el test actual
 */
export function calculateCerebralProfile(responses: Record<string, any>): any {
  // Mapear respuestas a scores
  const scores = {
    analisis: 0,
    intuicion: 0,
    impacto: 0,
  }

  // Análisis simple de respuestas
  const respuestasArray = Object.entries(responses)
  const tiposScore = { A: 0, B: 0, C: 0, D: 0 }

  // Lógica simple para categorizar
  for (const [key, value] of respuestasArray) {
    if (typeof value === 'string') {
      const valorLower = value.toLowerCase()
      
      if (valorLower.includes('análisis') || valorLower.includes('data') || valorLower.includes('preciso')) {
        tiposScore.C += 2
        scores.analisis += 20
      } else if (valorLower.includes('rápido') || valorLower.includes('decisión') || valorLower.includes('acción')) {
        tiposScore.A += 2
        scores.impacto += 20
      } else if (valorLower.includes('personas') || valorLower.includes('comunicación') || valorLower.includes('equipo')) {
        tiposScore.B += 2
        scores.intuicion += 20
      } else if (valorLower.includes('estabilidad') || valorLower.includes('seguridad') || valorLower.includes('confianza')) {
        tiposScore.D += 2
      }
    } else if (typeof value === 'number') {
      // Para escalas
      if (key === 'pace_preference') {
        if (value >= 4) tiposScore.A += 2
        else if (value <= 2) tiposScore.C += 2
      }
    }
  }

  // Determinar tipo dominante
  const tipoEntrada = Object.entries(tiposScore).sort((a, b) => b[1] - a[1])[0][0]
  const tiposMap = { A: 'A', B: 'B', C: 'C', D: 'D' }
  const tipo = tiposMap[tipoEntrada as keyof typeof tiposMap] || 'C'

  // Normalizar scores
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 100
  const normalizedScores = {
    analisis: Math.min(100, (scores.analisis / totalScore) * 100),
    intuicion: Math.min(100, (scores.intuicion / totalScore) * 100),
    impacto: Math.min(100, (scores.impacto / totalScore) * 100),
  }

  return {
    tipo,
    scores: normalizedScores,
    tiposScore,
  }
}

/**
 * Genera el contenido del informe basado en perfil
 */
export function generateInformeContent(profile: any, userProfile: any): any {
  const tiposDescripcion = {
    A: { nombre: 'El Visionario', emoji: '⚡' },
    B: { nombre: 'El Influenciador', emoji: '🌟' },
    C: { nombre: 'El Analista', emoji: '🎯' },
    D: { nombre: 'El Estabilizador', emoji: '🛡️' },
  }

  const tiposFortalezas = {
    A: [
      'Toma de decisiones rápida y decisiva',
      'Liderazgo natural y orientado a resultados',
      'Capacidad de iniciativa y emprendimiento',
    ],
    B: [
      'Comunicación excelente y carismática',
      'Trabajo efectivo en equipo',
      'Creatividad e innovación',
    ],
    C: [
      'Análisis profundo y detallado',
      'Precisión y atención al detalle',
      'Consistencia y confiabilidad',
    ],
    D: [
      'Lealtad y confiabilidad',
      'Paciencia y empatía',
      'Apoyo efectivo a otros',
    ],
  }

  const tiposDesarrollo = {
    A: ['Escucha activa', 'Delegación efectiva', 'Trabajo colaborativo'],
    B: ['Seguimiento de detalles', 'Análisis profundo', 'Organización'],
    C: ['Decisión rápida', 'Flexibilidad', 'Iniciativa'],
    D: ['Adaptabilidad', 'Assertividad', 'Innovación'],
  }

  const tipo = profile.tipo || 'C'
  const info = tiposDescripcion[tipo as keyof typeof tiposDescripcion]

  return {
    resumen: `Eres ${info.nombre}, un profesional con características únicas que te hacen valioso en el mercado laboral.`,
    fortalezas: tiposFortalezas[tipo as keyof typeof tiposFortalezas] || tiposFortalezas.C,
    areas_desarrollo: tiposDesarrollo[tipo as keyof typeof tiposDesarrollo] || tiposDesarrollo.C,
  }
}
