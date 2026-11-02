export const CV_BUILDER_DRAFT_KEY = 'dtc:a3:cv-builder-studio:draft:v1'

export const CV_BUILDER_ATS_ITEMS = [
  { id: 'format', label: 'Formato simple, sin tablas ni columnas complejas', critical: true },
  { id: 'fonts', label: 'Tipografía estándar y legible', critical: true },
  { id: 'keywords', label: 'Palabras clave relevantes sólo cuando describen habilidades reales', critical: true },
  { id: 'sections', label: 'Secciones con títulos claros', critical: true },
  { id: 'file', label: 'Documento final con texto seleccionable', critical: true },
  { id: 'contact', label: 'Datos de contacto fuera de encabezados o pies', critical: true },
  { id: 'dates', label: 'Fechas con un formato consistente', critical: false },
  { id: 'length', label: 'Extensión objetivo de una a dos páginas', critical: false },
] as const

export const CV_BUILDER_CRITICAL_ATS_IDS = CV_BUILDER_ATS_ITEMS
  .filter((item) => item.critical)
  .map((item) => item.id)

export interface CvBuilderState {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  targetRole: string
  targetKeywords: string
  professionalSummary: string
  experienceTitle: string
  experienceCompany: string
  experienceDates: string
  achievement1: string
  achievement2: string
  achievement3: string
  skills: string
  education: string
  atsChecklist: string[]
  evidenceKind: 'experience' | 'project' | 'education'
  pendingFacts: string
  factsConfirmed: boolean
}

export const EMPTY_CV_BUILDER_STATE: CvBuilderState = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  targetRole: '',
  targetKeywords: '',
  professionalSummary: '',
  experienceTitle: '',
  experienceCompany: '',
  experienceDates: '',
  achievement1: '',
  achievement2: '',
  achievement3: '',
  skills: '',
  education: '',
  atsChecklist: [],
  evidenceKind: 'experience',
  pendingFacts: '',
  factsConfirmed: false,
}

export function splitCvList(value: unknown): string[] {
  if (typeof value !== 'string') return []
  return Array.from(
    new Set(
      value
        .split(/[;,\n]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  )
}

export function normalizeCvBuilderState(value: unknown): CvBuilderState {
  const record =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  const text = (key: keyof CvBuilderState) =>
    typeof record[key] === 'string' ? String(record[key]) : ''

  return {
    evidenceKind: record.evidenceKind === 'project' || record.evidenceKind === 'education' ? record.evidenceKind : 'experience',
    pendingFacts: text('pendingFacts'),
    factsConfirmed: record.factsConfirmed === true || record.factsConfirmed === 'true',
    fullName: text('fullName'),
    email: text('email'),
    phone: text('phone'),
    location: text('location'),
    linkedin: text('linkedin'),
    targetRole: text('targetRole'),
    targetKeywords: text('targetKeywords'),
    professionalSummary: text('professionalSummary'),
    experienceTitle: text('experienceTitle'),
    experienceCompany: text('experienceCompany'),
    experienceDates: text('experienceDates'),
    achievement1: text('achievement1'),
    achievement2: text('achievement2'),
    achievement3: text('achievement3'),
    skills: text('skills'),
    education: text('education'),
    atsChecklist: Array.isArray(record.atsChecklist)
      ? record.atsChecklist.filter((item): item is string => typeof item === 'string')
      : splitCvList(record.atsChecklist),
  }
}

export function buildCvBuilderDeliverable(
  state: CvBuilderState,
): Record<string, string> {
  return {
    evidenceKind: state.evidenceKind,
    pendingFacts: state.pendingFacts.trim(),
    factsConfirmed: String(state.factsConfirmed),
    fullName: state.fullName.trim(),
    email: state.email.trim(),
    phone: state.phone.trim(),
    location: state.location.trim(),
    linkedin: state.linkedin.trim(),
    targetRole: state.targetRole.trim(),
    targetKeywords: splitCvList(state.targetKeywords).join(', '),
    professionalSummary: state.professionalSummary.trim(),
    experienceTitle: state.experienceTitle.trim(),
    experienceCompany: state.experienceCompany.trim(),
    experienceDates: state.experienceDates.trim(),
    achievement1: state.achievement1.trim(),
    achievement2: state.achievement2.trim(),
    achievement3: state.achievement3.trim(),
    skills: splitCvList(state.skills).join(', '),
    education: state.education.trim(),
    atsChecklist: Array.from(new Set(state.atsChecklist)).join(', '),
  }
}

export function buildCvBuilderResponses(state: CvBuilderState): string[] {
  return [
    `Rol objetivo: ${state.targetRole}. Palabras clave: ${state.targetKeywords}.`,
    state.professionalSummary,
    [state.achievement1, state.achievement2, state.achievement3]
      .filter(Boolean)
      .join('\n'),
    `Competencias: ${state.skills}.`,
    `Validaciones ATS: ${state.atsChecklist.join(', ')}.`,
  ]
}

/** Exact, user-authored facts only. Pending notes and UI examples never reach the export. */
export function buildCvPreviewText(state: CvBuilderState): string {
  const lines = [
    state.fullName.trim(),
    state.targetRole.trim(),
    [state.email, state.phone, state.location, state.linkedin].map((text) => text.trim()).filter(Boolean).join(' · '),
  ].filter(Boolean)
  const section = (title: string, content: string[]) => {
    const entries = content.map((text) => text.trim()).filter(Boolean)
    if (entries.length) lines.push('', title, ...entries)
  }
  section('Resumen', [state.professionalSummary])
  section(state.evidenceKind === 'project' ? 'Proyectos' : 'Experiencia', [
    [state.experienceTitle, state.experienceCompany, state.experienceDates].map((text) => text.trim()).filter(Boolean).join(' · '),
    ...[state.achievement1, state.achievement2, state.achievement3].filter((text) => text.trim()).map((text) => `• ${text.trim()}`),
  ])
  section('Competencias', [splitCvList(state.skills).join(', ')])
  section('Formación', [state.education])
  return `${lines.join('\n')}\n`
}

export function buildCvPlainText(state: CvBuilderState): string {
  if (!state.factsConfirmed) throw new Error('Revisa y confirma los hechos incluidos antes de exportar.')
  return buildCvPreviewText(state)
}
