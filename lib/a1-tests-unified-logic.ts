/**
 * Lógica unificada para gestionar tests A1
 * Incluye: validación de requisitos, cálculo de perfiles, generación de reportes
 */

export interface A1TestResult {
  id: string
  userId: string
  testType: 'cerebral' | 'inteligencia_emocional' | 'mapa_personalidad' | '5_dimensiones' | 'brujula_vocacional' | 'competencias'
  testName: string
  responses: Record<string, any>
  score?: number
  profileType?: string
  resultadoTexto?: string
  completedAt: Date
}

export interface A1Progress {
  userId: string
  testsCompleted: number
  cerebralCompleted: boolean
  inteligenciaEmocionalCompleted: boolean
  mapaPersonalidadCompleted: boolean
  cincoDimensionesCompleted: boolean
  brujolaVocacionalCompleted: boolean
  competenciasCompleted: boolean
  unifiedProfile: Record<string, any>
}

// Requisitos entre tests
const TEST_REQUIREMENTS: Record<string, string[]> = {
  mapa_personalidad: ['cerebral'],
  cinco_dimensiones: ['cerebral', 'inteligencia_emocional'],
  brujula_vocacional: ['mapa_personalidad'],
  competencias: ['cinco_dimensiones', 'brujula_vocacional'],
}

// Información de tests
export const TESTS_INFO = {
  cerebral: {
    name: 'Despega Cerebral™',
    description: 'Descubre tu estilo de comportamiento y preferencias de comunicación',
    duration: '10-15 min',
    questions: 15,
    category: 'Personalidad',
    level: 'Principiante',
    requires: [],
  },
  inteligencia_emocional: {
    name: 'Inteligencia Emocional Despega™',
    description: 'Evalúa tu capacidad para reconocer, entender y gestionar emociones',
    duration: '10-15 min',
    questions: 20,
    category: 'Inteligencia',
    level: 'Principiante',
    requires: [],
  },
  mapa_personalidad: {
    name: 'Mapa de Personalidad Despega™',
    description: 'Identifica tus preferencias psicológicas y tipo de personalidad',
    duration: '15-20 min',
    questions: 25,
    category: 'Personalidad',
    level: 'Intermedio',
    requires: ['cerebral'],
  },
  cinco_dimensiones: {
    name: '5 Dimensiones Despega™',
    description: 'Evaluación integral que cubre cinco dimensiones del comportamiento',
    duration: '15-20 min',
    questions: 30,
    category: 'Personalidad',
    level: 'Intermedio',
    requires: ['cerebral', 'inteligencia_emocional'],
  },
  brujula_vocacional: {
    name: 'Brújula Vocacional Despega™',
    description: 'Descubre tus intereses profesionales y carreras alineadas',
    duration: '12-18 min',
    questions: 36,
    category: 'Carrera',
    level: 'Intermedio',
    requires: ['mapa_personalidad'],
  },
  competencias: {
    name: 'Competencias Despega™',
    description: 'Evalúa tus habilidades interpersonales y competencias profesionales',
    duration: '15-20 min',
    questions: 30,
    category: 'Habilidades',
    level: 'Avanzado',
    requires: ['cinco_dimensiones', 'brujula_vocacional'],
  },
}

/**
 * Verifica si un test puede ser completado basado en requisitos
 */
export function canCompleteTest(testType: string, completedTests: Set<string>): boolean {
  const requirements = TEST_REQUIREMENTS[testType] || []
  return requirements.every((req) => completedTests.has(req))
}

/**
 * Obtiene estado de cada test para el usuario
 */
export function getTestsStatus(completedTests: Record<string, boolean>): Record<string, 'locked' | 'available' | 'completed'> {
  const completed = new Set(Object.entries(completedTests).filter(([_, v]) => v).map(([k, _]) => k))
  
  return {
    cerebral: completedTests.cerebral ? 'completed' : 'available',
    inteligencia_emocional: completedTests.inteligencia_emocional ? 'completed' : 'available',
    mapa_personalidad: canCompleteTest('mapa_personalidad', completed) 
      ? (completedTests.mapa_personalidad ? 'completed' : 'available')
      : 'locked',
    cinco_dimensiones: canCompleteTest('cinco_dimensiones', completed)
      ? (completedTests.cinco_dimensiones ? 'completed' : 'available')
      : 'locked',
    brujula_vocacional: canCompleteTest('brujula_vocacional', completed)
      ? (completedTests.brujula_vocacional ? 'completed' : 'available')
      : 'locked',
    competencias: canCompleteTest('competencias', completed)
      ? (completedTests.competencias ? 'completed' : 'available')
      : 'locked',
  }
}

/**
 * Calcula progreso general en A1
 */
export function calculateA1Progress(completedTests: Record<string, boolean>): number {
  const completed = Object.values(completedTests).filter(Boolean).length
  const total = Object.keys(completedTests).length
  return Math.round((completed / total) * 100)
}

/**
 * Genera informe unificado de A1
 */
export function generateUnifiedReport(results: A1TestResult[], isPremium: boolean): Record<string, any> {
  const report: Record<string, any> = {
    version: isPremium ? 'premium' : 'free',
    completedTests: results.length,
    generatedAt: new Date().toISOString(),
  }

  // Procesar cada test completado
  for (const result of results) {
    switch (result.testType) {
      case 'cerebral':
        report.discProfile = result.profileType
        break
      case 'inteligencia_emocional':
        report.emotionalIntelligence = result.score
        break
      case 'mapa_personalidad':
        report.personalityMap = result.resultadoTexto
        break
      case '5_dimensiones':
        report.fiveDimensions = result.responses
        break
      case 'brujula_vocacional':
        report.vocationalInterests = result.resultadoTexto
        break
      case 'competencias':
        report.competencies = result.responses
        break
    }
  }

  return report
}
