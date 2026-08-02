import type { A2DailyMission } from '@/lib/a2-mission.types'

export type A2RouteCode = 'COLAB_EX' | 'EMPREND' | 'LIDER_EJ' | 'TECH_ESP'

export interface A2RouteAdaptation {
  routeCode: string
  routeName: string
  focus: string
  focusQuestion: string
  evidencePrompt: string
  applicationPrompt: string
  qualitySignals: string[]
}

interface RouteProfile {
  name: string
  focus: string
  focusQuestion: string
  evidencePrompt: string
  applicationPrompt: string
  qualitySignals: string[]
}

const ROUTE_PROFILES: Record<A2RouteCode, RouteProfile> = {
  COLAB_EX: {
    name: 'Colaborador Experto',
    focus: 'Coordinación, confianza y contribución visible',
    focusQuestion:
      '¿Cómo vuelve este trabajo más clara tu contribución y más simple la coordinación con otras personas?',
    evidencePrompt:
      'Incluye acuerdos, mensajes, ejemplos de colaboración, responsabilidades asumidas o resultados compartidos.',
    applicationPrompt:
      'Identifica dónde puede observarse esta contribución en un equipo, proyecto o conversación real.',
    qualitySignals: [
      'Contribución concreta y diferenciada',
      'Coordinación o comunicación observable',
      'Impacto útil para otras personas',
    ],
  },
  EMPREND: {
    name: 'Emprendedor Creativo',
    focus: 'Experimentación, propuesta de valor y narrativa',
    focusQuestion:
      '¿Qué hipótesis, valor o aprendizaje observable deja este trabajo?',
    evidencePrompt:
      'Incluye una hipótesis, versión creada, reacción obtenida, aprendizaje o cambio realizado a partir de evidencia.',
    applicationPrompt:
      'Señala cómo este entregable puede probarse, comunicarse o convertirse en una siguiente versión.',
    qualitySignals: [
      'Hipótesis o propuesta de valor explícita',
      'Experimentación o versión tangible',
      'Aprendizaje que cambia la siguiente acción',
    ],
  },
  LIDER_EJ: {
    name: 'Líder Ejecutivo',
    focus: 'Decisión, alineamiento e impacto',
    focusQuestion:
      '¿Qué decisión, prioridad o alineamiento hace visible este trabajo?',
    evidencePrompt:
      'Incluye criterio de decisión, personas involucradas, prioridad, resultado esperado y señal de impacto.',
    applicationPrompt:
      'Ubica el entregable en una decisión real, una conversación de alineamiento o una situación con responsabilidad.',
    qualitySignals: [
      'Prioridad y criterio de decisión claros',
      'Impacto o resultado esperado explícito',
      'Alineamiento con personas o contexto',
    ],
  },
  TECH_ESP: {
    name: 'Especialista Técnico',
    focus: 'Profundidad, método y evidencia técnica',
    focusQuestion:
      '¿Qué criterio, estándar o evidencia demuestra la calidad de este trabajo?',
    evidencePrompt:
      'Incluye método, supuestos, decisiones técnicas, resultados medibles, comparación o estándar utilizado.',
    applicationPrompt:
      'Conecta el entregable con un problema real, una restricción y una evidencia verificable de calidad.',
    qualitySignals: [
      'Método o razonamiento reproducible',
      'Profundidad técnica relevante',
      'Resultado medible o verificable',
    ],
  },
}

function knownRouteCode(code: string | null | undefined): A2RouteCode | null {
  if (!code) return null
  return code in ROUTE_PROFILES ? (code as A2RouteCode) : null
}

function missionSpecificSignal(mission: A2DailyMission): string {
  switch (mission.missionType) {
    case 'field_action':
      return 'Resultado observado fuera de la plataforma y siguiente acción registrada'
    case 'a3_checkpoint':
      return 'Transferencia del trabajo previo a una práctica de Entrenamiento'
    case 'milestone':
      return 'Síntesis del tramo, cambio observable y aspecto todavía abierto'
    case 'debrief':
      return 'Aprendizaje específico conectado con una modificación concreta'
    case 'performance_drill':
      return 'Práctica repetible con criterio de mejora visible'
    case 'market_intel':
      return 'Señal del contexto conectada con una decisión o hipótesis personal'
    default:
      return 'Entregable conectado con el objetivo y el siguiente paso de la misión'
  }
}

export function buildA2RouteAdaptation(
  route: { code?: string | null; name?: string | null } | null,
  mission: A2DailyMission,
): A2RouteAdaptation {
  const routeCode = knownRouteCode(route?.code)
  const profile = routeCode ? ROUTE_PROFILES[routeCode] : null

  if (!profile) {
    return {
      routeCode: route?.code || 'RUTA_DTC',
      routeName: route?.name || 'Tu Ruta DTC',
      focus: 'Aplicación concreta y evidencia verificable',
      focusQuestion:
        '¿Qué cambio, decisión o evidencia deja esta misión en tu recorrido?',
      evidencePrompt:
        'Incluye el trabajo realizado, una evidencia concreta y el aprendizaje que modifica la siguiente acción.',
      applicationPrompt:
        'Conecta el entregable con una situación real de tu contexto profesional.',
      qualitySignals: [
        'Trabajo concreto y comprensible',
        'Evidencia conectada con el objetivo',
        missionSpecificSignal(mission),
      ],
    }
  }

  return {
    routeCode,
    routeName: profile.name,
    focus: profile.focus,
    focusQuestion: profile.focusQuestion,
    evidencePrompt: profile.evidencePrompt,
    applicationPrompt: profile.applicationPrompt,
    qualitySignals: [
      ...profile.qualitySignals,
      missionSpecificSignal(mission),
    ],
  }
}

export const ACTIVE_A2_ROUTE_CODES = Object.keys(
  ROUTE_PROFILES,
) as A2RouteCode[]
