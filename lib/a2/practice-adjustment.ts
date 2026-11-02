import { z } from 'zod'

export const A2_BARRIERS = {
  time: { label: 'Me faltó tiempo', suggestion: 'Reduce la acción a un paso de 10 minutos y reserva un momento concreto.' },
  unclear: { label: 'No estaba claro qué hacer', suggestion: 'Escribe qué resultado necesitas y pide un ejemplo o una aclaración antes de repetir.' },
  resources: { label: 'Me faltó un recurso o apoyo', suggestion: 'Identifica el recurso mínimo o una persona a quien puedas pedir ayuda; conserva lo que ya tienes.' },
  energy: { label: 'No tenía energía disponible', suggestion: 'Reduce el alcance o cambia el momento de la práctica según tu disponibilidad.' },
  goal_changed: { label: 'La acción ya no encaja con mi objetivo', suggestion: 'Elige otra acción que apoye tu objetivo actual y especifica qué evidencia conservarás.' },
  other: { label: 'Otra barrera', suggestion: 'Describe la barrera y cambia una condición para que el siguiente intento sea viable.' },
} as const

export type A2Barrier = keyof typeof A2_BARRIERS
export const adjustmentRequestSchema = z.object({
  requestId: z.uuid(),
  dayNumber: z.number().int().min(1).max(90),
  outcome: z.enum(['could_not', 'change']),
  barrier: z.enum(['time', 'unclear', 'resources', 'energy', 'goal_changed', 'other']),
  retainedWork: z.string().trim().min(1).max(4_000),
  nextAction: z.string().trim().min(1).max(2_000),
  reviewDate: z.iso.date(),
  draft: z.object({
    summary: z.string().max(8_000), evidence: z.string().max(8_000), reflection: z.string().max(8_000),
    metrics: z.string().max(8_000), artifactUrl: z.string().max(2_000),
    completedInstructions: z.array(z.number().int().min(0).max(99)).max(100),
  }).optional(),
}).strict()

export type A2AdjustmentRequest = z.infer<typeof adjustmentRequestSchema>

export function adjustmentContent(input: A2AdjustmentRequest) {
  return {
    version: 1,
    dayNumber: input.dayNumber,
    outcome: input.outcome,
    barrier: input.barrier,
    retainedWork: input.retainedWork,
    nextAction: input.nextAction,
    reviewDate: input.reviewDate,
    suggestion: A2_BARRIERS[input.barrier].suggestion,
    ...(input.draft ? { draft: input.draft } : {}),
  }
}

export function readAdjustmentContent(raw: unknown): ReturnType<typeof adjustmentContent> | null {
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!value || typeof value !== 'object' || value.version !== 1) return null
    // Stored envelopes deliberately exclude the request id and include server guidance.
    const { version: _version, suggestion: _suggestion, ...fields } = value || {}
    const checked = adjustmentRequestSchema.safeParse({ ...fields, requestId: '00000000-0000-4000-8000-000000000000' })
    return checked.success ? adjustmentContent(checked.data) : null
  } catch { return null }
}
