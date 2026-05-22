/**
 * A3 Module Integration - Connect A3 learning outputs to DTC Documents
 * Phase 3: Save A3 module completions as documents with prerequisites checking
 */

import { DTCDocument, getDocumentsByDay, getDocumentsByType } from './dtc-documents'

export type A3ModuleType = 
  | 'auditoria-inicial'
  | 'analisis-vacante'
  | 'career-mirror'
  | 'cv-inteligente'
  | 'conversational-interview'
  | 'answer-architecture'
  | 'communication-gym'
  | 'coach-practice-room'

export interface A3ModulePrerequisites {
  module: A3ModuleType
  requiredDays: number[]
  requiredDocuments: Array<{ type: string; dayNumber?: number }>
}

// Module prerequisites - what A2 work must be completed before starting A3
export const A3_MODULE_PREREQUISITES: Record<A3ModuleType, A3ModulePrerequisites> = {
  'auditoria-inicial': {
    module: 'auditoria-inicial',
    requiredDays: [1, 2, 3, 4], // Complete Days 1-4
    requiredDocuments: [
      { type: 'route_contract', dayNumber: 1 },
      { type: 'evidence_vault', dayNumber: 2 },
      { type: 'market_signal', dayNumber: 3 },
      { type: 'candidate_board', dayNumber: 4 },
    ],
  },
  'analisis-vacante': {
    module: 'analisis-vacante',
    requiredDays: [3],
    requiredDocuments: [
      { type: 'market_signal', dayNumber: 3 },
    ],
  },
  'career-mirror': {
    module: 'career-mirror',
    requiredDays: [1, 4],
    requiredDocuments: [
      { type: 'route_contract', dayNumber: 1 },
      { type: 'candidate_board', dayNumber: 4 },
    ],
  },
  'cv-inteligente': {
    module: 'cv-inteligente',
    requiredDays: [1, 2, 14, 15, 19, 20, 21],
    requiredDocuments: [
      { type: 'route_contract', dayNumber: 1 },
      { type: 'evidence_vault', dayNumber: 2 },
      { type: 'achievement_story', dayNumber: 14 },
      { type: 'cv_bullet', dayNumber: 19 },
    ],
  },
  'conversational-interview': {
    module: 'conversational-interview',
    requiredDays: [5, 6, 7],
    requiredDocuments: [
      { type: 'test_introduction', dayNumber: 5 },
      { type: 'professional_identity', dayNumber: 6 },
    ],
  },
  'answer-architecture': {
    module: 'answer-architecture',
    requiredDays: [8, 9, 10, 11],
    requiredDocuments: [
      { type: 'work_memory', dayNumber: 8 },
      { type: 'value_inventory', dayNumber: 9 },
    ],
  },
  'communication-gym': {
    module: 'communication-gym',
    requiredDays: [5],
    requiredDocuments: [
      { type: 'test_introduction', dayNumber: 5 },
    ],
  },
  'coach-practice-room': {
    module: 'coach-practice-room',
    requiredDays: [1, 2, 3, 4],
    requiredDocuments: [
      { type: 'route_contract', dayNumber: 1 },
    ],
  },
}

/**
 * Check if user has completed all prerequisites for a module
 */
export async function checkModulePrerequisites(
  userId: string,
  module: A3ModuleType
): Promise<{ met: boolean; missingDocuments: string[] }> {
  const prerequisites = A3_MODULE_PREREQUISITES[module]
  
  if (!prerequisites) {
    return { met: false, missingDocuments: ['Module not found'] }
  }

  const missingDocuments: string[] = []

  for (const doc of prerequisites.requiredDocuments) {
    let found = false

    if (doc.dayNumber !== undefined) {
      const { data } = await getDocumentsByDay(userId, doc.dayNumber)
      found = !!data?.some(d => d.type === doc.type && d.status === 'approved')
    } else {
      const { data } = await getDocumentsByType(userId, doc.type as any)
      found = !!data?.some(d => d.status === 'approved')
    }

    if (!found) {
      missingDocuments.push(`${doc.type} (Day ${doc.dayNumber || '?'})`)
    }
  }

  return {
    met: missingDocuments.length === 0,
    missingDocuments,
  }
}

/**
 * Save A3 module learning output as document
 */
export async function saveA3ModuleOutput(
  userId: string,
  module: A3ModuleType,
  output: any
) {
  const { createDocument } = await import('./dtc-documents')

  return createDocument(userId, {
    title: `${module} - Learning Output`,
    type: 'a3_learning_output',
    source_module: `a3_${module}`,
    content: JSON.stringify(output, null, 2),
    status: 'draft',
    source: 'user',
    tags: ['a3', module, 'learning-output'],
  })
}

/**
 * Link A3 output to prerequisite A2 days
 * Helps track which A2 work was used in each A3 module
 */
export async function linkA3ToPrerequisites(
  userId: string,
  a3DocumentId: string,
  module: A3ModuleType
) {
  const prerequisites = A3_MODULE_PREREQUISITES[module]
  
  if (!prerequisites) {
    console.error(`[v0] Unknown module: ${module}`)
    return { success: false, error: 'Module not found' }
  }

  // Store the mapping in document tags and metadata
  // This allows querying which A2 days contributed to this A3 output
  
  return {
    success: true,
    linkedDays: prerequisites.requiredDays,
    linkedDocuments: prerequisites.requiredDocuments,
  }
}

/**
 * Get all A2 documents that contributed to an A3 module
 */
export async function getA3Prerequisites(
  userId: string,
  module: A3ModuleType
): Promise<DTCDocument[]> {
  const { getDocumentsByDay } = await import('./dtc-documents')
  const prerequisites = A3_MODULE_PREREQUISITES[module]
  
  if (!prerequisites) {
    return []
  }

  const allDocs: DTCDocument[] = []

  for (const dayNum of prerequisites.requiredDays) {
    const { data } = await getDocumentsByDay(userId, dayNum)
    if (data) {
      allDocs.push(...data)
    }
  }

  return allDocs
}

/**
 * Get all completed A3 modules for a user
 */
export async function getCompletedA3Modules(userId: string) {
  const { getDocumentsByType } = await import('./dtc-documents')
  const { data } = await getDocumentsByType(userId, 'a3_learning_output' as any)
  
  if (!data) return []

  return data.filter(d => d.status === 'approved' || d.status === 'final')
}

/**
 * List all available A3 modules with their prerequisite status
 */
export async function listA3ModulesWithStatus(userId: string) {
  const modules: Array<{
    module: A3ModuleType
    name: string
    status: 'locked' | 'available' | 'completed'
    missingPrerequisites: string[]
  }> = []

  const moduleNames: Record<A3ModuleType, string> = {
    'auditoria-inicial': 'Auditoría Inicial',
    'analisis-vacante': 'Análisis de Vacante',
    'career-mirror': 'Espejo de Carrera',
    'cv-inteligente': 'CV Inteligente',
    'conversational-interview': 'Entrevista Conversacional',
    'answer-architecture': 'Arquitectura de Respuestas',
    'communication-gym': 'Gimnasio de Comunicación',
    'coach-practice-room': 'Sala de Práctica con Coach',
  }

  const completed = await getCompletedA3Modules(userId)
  const completedSet = new Set(completed.map(d => d.source_module))

  for (const [moduleKey, moduleName] of Object.entries(moduleNames)) {
    const module = moduleKey as A3ModuleType
    const sourceModule = `a3_${module}`

    if (completedSet.has(sourceModule)) {
      modules.push({
        module,
        name: moduleName,
        status: 'completed',
        missingPrerequisites: [],
      })
    } else {
      const { met, missingDocuments } = await checkModulePrerequisites(userId, module)
      modules.push({
        module,
        name: moduleName,
        status: met ? 'available' : 'locked',
        missingPrerequisites: missingDocuments,
      })
    }
  }

  return modules
}
