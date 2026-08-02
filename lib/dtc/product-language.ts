export type InternalJourneyStage = 'A1' | 'A2' | 'A3' | 'A4'

export interface ProductStageLanguage {
  internalId: InternalJourneyStage
  name: string
  shortDescription: string
  actionLabel: string
  href: string
}

/**
 * Public and authenticated UI language.
 * Internal IDs remain available for persistence, analytics and access control,
 * but should not be presented as product names to users.
 */
export const PRODUCT_STAGES: Record<InternalJourneyStage, ProductStageLanguage> = {
  A1: {
    internalId: 'A1',
    name: 'Despega Cerebral',
    shortDescription: 'Tu diagnóstico, patrones y perfil profesional.',
    actionLabel: 'Abrir mi diagnóstico',
    href: '/despega/a1-report',
  },
  A2: {
    internalId: 'A2',
    name: 'Tu Ruta',
    shortDescription: 'Tu misión diaria y avance secuencial.',
    actionLabel: 'Continuar mi ruta',
    href: '/despega/a2',
  },
  A3: {
    internalId: 'A3',
    name: 'Entrenamiento',
    shortDescription: 'Práctica de entrevistas y habilidades aplicadas.',
    actionLabel: 'Abrir entrenamiento',
    href: '/despega/a3',
  },
  A4: {
    internalId: 'A4',
    name: 'Radar Estratégico',
    shortDescription: 'Señales del mercado, contexto y oportunidades.',
    actionLabel: 'Abrir radar estratégico',
    href: '/despega/a4',
  },
}

export const PRODUCT_STAGE_ORDER: InternalJourneyStage[] = ['A1', 'A2', 'A3', 'A4']
