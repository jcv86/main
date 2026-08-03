/**
 * Compatibility mapping for the retired A3 module identifiers.
 *
 * The canonical product sequence lives in lib/a3/module-catalog.ts. These
 * identifiers remain only so old bookmarks and completion screens resolve to
 * an active canonical module instead of reopening retired simulations.
 */
export const MODULE_SEQUENCE = [
  'auditoria-inicial',
  'metodo-star',
  'cv-inteligente',
  'analisis-vacante',
  'analisis-multimodal',
  'entrenamiento-guiado',
  'entrenamiento-estructurado',
  'entrenamiento-desafiante',
  'entrenamiento-conversacional',
  'simulacion-real',
] as const

export const MODULE_PATHS = {
  'auditoria-inicial': '/despega/a3/career-mirror',
  'metodo-star': '/despega/a3/value-mining-lab',
  'cv-inteligente': '/despega/a3/cv-builder-studio',
  'analisis-vacante': '/despega/a3/job-decoder',
  'analisis-multimodal': '/despega/a3/answer-architecture',
  'entrenamiento-guiado': '/despega/a3/coach-practice-room',
  'entrenamiento-estructurado': '/despega/a3/first-recruiter-simulation',
  'entrenamiento-desafiante': '/despega/a3/risk-difficult-questions-lab',
  'entrenamiento-conversacional': '/despega/a3/communication-gym',
  'simulacion-real': '/despega/a3/basic-interview-mission',
} as const

export const MODULE_NAMES = {
  'auditoria-inicial': 'Espejo de Carrera',
  'metodo-star': 'Laboratorio de Minería de Valor',
  'cv-inteligente': 'Estudio Constructor de CV',
  'analisis-vacante': 'Decodificador de Ofertas',
  'analisis-multimodal': 'Arquitectura de Respuestas',
  'entrenamiento-guiado': 'Sala de Práctica del Coach',
  'entrenamiento-estructurado': 'Primera Simulación con Reclutador',
  'entrenamiento-desafiante': 'Laboratorio de Preguntas Difíciles',
  'entrenamiento-conversacional': 'Gimnasio de Comunicación',
  'simulacion-real': 'Misión de Entrevista Básica',
} as const

export function getNextModulePath(currentModuleId: string): string | null {
  const currentIndex = MODULE_SEQUENCE.indexOf(currentModuleId as never)
  if (currentIndex === -1 || currentIndex === MODULE_SEQUENCE.length - 1) {
    return null
  }
  const nextModuleId = MODULE_SEQUENCE[currentIndex + 1]
  return MODULE_PATHS[nextModuleId]
}

export function getModuleIndex(moduleId: string): number {
  return MODULE_SEQUENCE.indexOf(moduleId as never)
}

export function isLastModule(moduleId: string): boolean {
  return getModuleIndex(moduleId) === MODULE_SEQUENCE.length - 1
}
