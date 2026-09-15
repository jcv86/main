import 'server-only'

import type { SharedJourneyContext } from '@/lib/journey/service'

export interface VeraEvidencePack {
  journey: {
    module: string
    currentA2Day: number
    highestA2DayUnlocked: number
    access: SharedJourneyContext['access']
  }
  a1: Record<string, unknown> | null
  a2: Record<string, unknown> | null
  a3: Array<Record<string, unknown>>
  a4: {
    documents: Array<Record<string, unknown>>
    strategicScore: Record<string, unknown> | null
  }
}

const SENSITIVE_KEY = /(email|phone|telefono|teléfono|rut|address|direccion|dirección|token|secret|password|cookie|user_id|userid)/i

function compactValue(value: unknown, depth = 0): unknown {
  if (depth > 3) return '[omitted]'
  if (value == null || typeof value === 'number' || typeof value === 'boolean') return value
  if (typeof value === 'string') return value.slice(0, 900)
  if (Array.isArray(value)) return value.slice(0, 8).map((item) => compactValue(item, depth + 1))
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, 24)) {
      if (SENSITIVE_KEY.test(key)) continue
      result[key] = compactValue(item, depth + 1)
    }
    return result
  }
  return String(value).slice(0, 300)
}

function compactRecord(value: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!value) return null
  return compactValue(value) as Record<string, unknown>
}

export function buildVeraEvidencePack(context: SharedJourneyContext): VeraEvidencePack {
  return {
    journey: {
      module: context.state.currentModule,
      currentA2Day: context.state.currentA2Day,
      highestA2DayUnlocked: context.state.highestA2DayUnlocked,
      access: context.access,
    },
    a1: compactRecord(context.a1),
    a2: compactRecord(context.a2),
    a3: context.a3.slice(0, 8).map((entry) => compactRecord(entry) ?? {}),
    a4: {
      documents: context.a4.documents.slice(0, 6).map((entry) => compactRecord(entry) ?? {}),
      strategicScore: compactRecord(context.a4.strategicScore),
    },
  }
}

export function evidencePackToPrompt(pack: VeraEvidencePack) {
  return [
    `Recorrido actual: ${pack.journey.module}; día A2 ${pack.journey.currentA2Day}; máximo desbloqueado ${pack.journey.highestA2DayUnlocked}.`,
    `Acceso: ${JSON.stringify(pack.journey.access)}.`,
    pack.a1 ? `Evidencia A1: ${JSON.stringify(pack.a1)}` : 'Evidencia A1: no disponible.',
    pack.a2 ? `Evidencia A2: ${JSON.stringify(pack.a2)}` : 'Evidencia A2: no disponible.',
    pack.a3.length ? `Evidencia A3: ${JSON.stringify(pack.a3)}` : 'Evidencia A3: no disponible.',
    pack.a4.strategicScore || pack.a4.documents.length
      ? `Evidencia A4: ${JSON.stringify(pack.a4)}`
      : 'Evidencia A4: no disponible.',
  ].join('\n')
}
