import { RECOGNITION_OPTIONS } from '@/lib/a1/individual-evidence'
import type { A1ProfessionalReport } from '@/lib/reports/a1-professional-report'

export type A2A1Orientation = ReturnType<typeof buildA2A1Orientation>

/**
 * Presentation boundary for the canonical A1 -> A2 transition.
 * Reuse A1's verified evidence and uncertainty; never turn net preferences into
 * percentages, competencies, career eligibility, or a different set of scales.
 * Only the fields used by the introduction are serialized to the client.
 */
export function buildA2A1Orientation(report: A1ProfessionalReport) {
  const understanding = report.understanding
  const state = report.reviewable
    ? understanding.responseState === 'available' ? 'current' as const : 'historical' as const
    : understanding.readingBlocked || report.scoreEvidence.status === 'invalid'
      ? 'incompatible' as const : 'incomplete' as const
  const canContinue = report.reviewable
  const currentEvidence = canContinue && understanding.responseState === 'available'
  const recognition = currentEvidence
    ? RECOGNITION_OPTIONS.find((option) => option.id === understanding.answers?.recognition) || null
    : null

  const summary = state === 'incompatible'
    ? 'Hay una diferencia entre las respuestas y el resultado guardado. Revisa tu informe antes de continuar.'
    : state === 'incomplete'
      ? 'Falta información de tu evaluación para preparar este inicio. Tu contexto se conserva para que puedas revisarlo.'
      : state === 'historical'
        ? 'Conservamos tu resultado anterior y el contexto que declaraste. Este registro no incluye las respuestas necesarias para reconstruir ejemplos personales.'
        : 'Partimos de lo que elegiste en A1 y del contexto que declaraste. Lo contrastarás con situaciones y acciones durante Tu Ruta.'

  const patternMessage = canContinue && understanding.pattern.status === 'ambiguous'
    ? 'Tus elecciones admiten más de una lectura. Puedes continuar sin que se te asigne una etiqueta por desempate.'
    : null
  const clarificationNotice = understanding.clarificationState === 'stale'
    ? 'Tus aclaraciones anteriores corresponden a otra versión de tus respuestas. Puedes revisarlas en el informe A1.'
    : understanding.clarificationState === 'invalid'
      ? 'No pudimos verificar las aclaraciones guardadas. Puedes revisarlas en el informe A1.'
      : null

  return {
    state,
    canContinue,
    summary,
    patternStatus: canContinue ? understanding.pattern.status : 'unavailable' as const,
    patternMessage,
    context: {
      objective: report.context.objective90Days || null,
      targetRole: report.context.targetRole || null,
      availableTime: report.context.availableTime || null,
    },
    domains: currentEvidence ? understanding.domains.filter((domain) => domain.evidence.length > 0).map((domain) => ({
      id: domain.id,
      title: domain.title,
      reading: domain.reading,
      evidence: domain.evidence.map((item) => ({
        questionId: item.questionId,
        question: item.question,
        more: item.more.text,
        less: item.less.text,
      })),
    })) : [],
    clarifications: currentEvidence ? understanding.clarificationStatements.map((item) => ({ ...item })) : [],
    recognition: recognition ? { ...recognition } : null,
    clarificationNotice,
  }
}
