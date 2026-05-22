/**
 * Module navigation mapping for Pillar 3 10-module sequential flow
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
  'auditoria-inicial': '/despega/interview-0',
  'metodo-star': '/despega/a3/metodo-star',
  'cv-inteligente': '/despega/a3/cv-inteligente',
  'analisis-vacante': '/despega/a3/analisis-vacante',
  'analisis-multimodal': '/despega/a3/analisis-multimodal',
  'entrenamiento-guiado': '/despega/a3/entrenamiento-guiado',
  'entrenamiento-estructurado': '/despega/a3/entrenamiento-estructurado',
  'entrenamiento-desafiante': '/despega/a3/entrenamiento-desafiante',
  'entrenamiento-conversacional': '/despega/a3/entrenamiento-conversacional',
  'simulacion-real': '/despega/a3/simulacion-real',
} as const

export const MODULE_NAMES = {
  'auditoria-inicial': 'Auditoría Inicial',
  'metodo-star': 'Método STAR',
  'cv-inteligente': 'CV Inteligente',
  'analisis-vacante': 'Análisis de Vacante',
  'analisis-multimodal': 'Análisis Multimodal',
  'entrenamiento-guiado': 'Entrenamiento Guiado',
  'entrenamiento-estructurado': 'Entrenamiento Estructurado',
  'entrenamiento-desafiante': 'Entrenamiento Desafiante',
  'entrenamiento-conversacional': 'Entrenamiento Conversacional',
  'simulacion-real': 'Simulación Real',
} as const

export function getNextModulePath(currentModuleId: string): string | null {
  const currentIndex = MODULE_SEQUENCE.indexOf(currentModuleId as any)
  if (currentIndex === -1 || currentIndex === MODULE_SEQUENCE.length - 1) {
    return null // No next module (end of Pillar 3)
  }
  const nextModuleId = MODULE_SEQUENCE[currentIndex + 1]
  return MODULE_PATHS[nextModuleId]
}

export function getModuleIndex(moduleId: string): number {
  return MODULE_SEQUENCE.indexOf(moduleId as any)
}

export function isLastModule(moduleId: string): boolean {
  return getModuleIndex(moduleId) === MODULE_SEQUENCE.length - 1
}
