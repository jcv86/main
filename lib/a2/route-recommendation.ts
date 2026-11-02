/**
 * Compatibility response for the retired DISC-only route recommender.
 * A preference score cannot establish a personal/professional route or a match
 * probability. Old consumers receive an explicit, unscored canonical handoff.
 */
export interface RouteRecommendation {
  status: 'requires_context'
  recommendedRoute: null
  confidence: null
  reasoning: string
  altRoutes: []
  focusAreas: []
  nextPath: '/despega/a2-routes'
}

/** @deprecated Read the canonical A1 evidence and the person's stated objective. */
export function recommendRouteByDISC(_discProfile?: unknown): RouteRecommendation {
  return {
    status: 'requires_context',
    recommendedRoute: null,
    confidence: null,
    reasoning: 'Tu Ruta parte de tu objetivo, tu contexto y las respuestas que puedes revisar en A1.',
    altRoutes: [],
    focusAreas: [],
    nextPath: '/despega/a2-routes',
  }
}

/** @deprecated No validated route score is available from a DISC profile alone. */
export function scoreRouteForDISC(
  _route: 'persona' | 'profesional' | 'hibrido',
  _discProfile: unknown,
): null {
  return null
}
