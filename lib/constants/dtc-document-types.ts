// Mapping de tipos de documentos A4 con nombres y descripciones en español
export const DOCUMENT_TYPE_MAP: Record<string, {
  label: string
  category: string
  icon: string
  description: string
  color: string
}> = {
  cv: {
    label: 'CV',
    category: 'Documentos Profesionales',
    icon: 'FileText',
    description: 'Currículum Vitae',
    color: 'bg-blue-500'
  },
  cover_letter: {
    label: 'Carta de Presentación',
    category: 'Documentos Profesionales',
    icon: 'Mail',
    description: 'Carta de presentación personalizada',
    color: 'bg-purple-500'
  },
  elevator_pitch: {
    label: 'Elevator Pitch',
    category: 'Presentación',
    icon: 'Mic',
    description: 'Presentación de 30-60 segundos',
    color: 'bg-orange-500'
  },
  linkedin_summary: {
    label: 'LinkedIn Summary',
    category: 'Redes Profesionales',
    icon: 'Users',
    description: 'Resumen para LinkedIn',
    color: 'bg-blue-600'
  },
  career_roadmap: {
    label: 'Ruta de Carrera',
    category: 'Planificación',
    icon: 'Map',
    description: 'Plan de desarrollo profesional',
    color: 'bg-green-500'
  },
  interview_prep: {
    label: 'Preparación para Entrevista',
    category: 'Entrevistas',
    icon: 'MessageCircle',
    description: 'Material de preparación para entrevistas',
    color: 'bg-red-500'
  }
}

// Especialidades/áreas por tag
export const SPECIALTY_MAP: Record<string, {
  label: string
  color: string
}> = {
  datos: { label: 'Data Engineer', color: 'bg-cyan-100 text-cyan-800' },
  ingeniería: { label: 'Ingeniería', color: 'bg-blue-100 text-blue-800' },
  marketing: { label: 'Marketing', color: 'bg-pink-100 text-pink-800' },
  growth: { label: 'Growth', color: 'bg-rose-100 text-rose-800' },
  diseño: { label: 'Diseño UX/UI', color: 'bg-purple-100 text-purple-800' },
  product: { label: 'Product Manager', color: 'bg-amber-100 text-amber-800' },
  pm: { label: 'Product Manager', color: 'bg-amber-100 text-amber-800' },
  cloud: { label: 'Cloud Architect', color: 'bg-indigo-100 text-indigo-800' },
  fullstack: { label: 'Full Stack', color: 'bg-green-100 text-green-800' },
  liderazgo: { label: 'Liderazgo', color: 'bg-yellow-100 text-yellow-800' },
  startup: { label: 'Startup', color: 'bg-orange-100 text-orange-800' }
}

// Fases del programa
export const PHASE_NAMES: Record<string, string> = {
  'A1': 'Identidad Profesional',
  'A2': 'Inventario de Valor',
  'A3': 'Comportamientos y Entrevista',
  'A4': 'Documentos y Posicionamiento'
}

// Nombres de actividades por fase
export const ACTIVITY_NAMES: Record<string, string> = {
  'A1': 'Despega Cerebral',
  'A2': 'Inventario de Valor',
  'A3': 'Simulaciones de Entrevista',
  'A4': 'Documentos Profesionales'
}

// Función para obtener el nombre legible de un documento basado en su tipo y especialidad
export function getDocumentLabel(type: string, tags?: string[]): string {
  const docType = DOCUMENT_TYPE_MAP[type]
  if (!docType) return type

  // Si hay especialidad en los tags, añadirla
  if (tags && tags.length > 0) {
    const specialty = tags.find(tag => SPECIALTY_MAP[tag])
    if (specialty) {
      return `${docType.label} - ${SPECIALTY_MAP[specialty].label}`
    }
  }

  return docType.label
}

// Función para obtener la categoría de un documento
export function getDocumentCategory(type: string): string {
  return DOCUMENT_TYPE_MAP[type]?.category || 'Otros'
}

// Función para obtener el icono de un documento
export function getDocumentIcon(type: string): string {
  return DOCUMENT_TYPE_MAP[type]?.icon || 'File'
}
