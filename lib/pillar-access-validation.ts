/**
 * Pillar Access Validation
 * Enforces sequential pillar flow: A1 (Identity) → A2 (Routes) → A3 (Interviews) → A4 (Strategic)
 * 
 * Pillar Structure:
 * - A1: El Ritual (Autoconocimiento) - Foundation
 * - A2: Exploración (90-Day Route) - Career Path
 * - A3: Entrenamiento (Interview Prep) - Skills
 * - A4: La Realidad (Strategic Docs) - Execution
 */

export type PillarName = 'a1' | 'a2' | 'a3' | 'a4'

export interface PillarAccessRule {
  pillar: PillarName
  requiredComplete: PillarName[]
  routes: string[]
}

// Define pillar access rules
export const PILLAR_ACCESS_RULES: PillarAccessRule[] = [
  {
    pillar: 'a1',
    requiredComplete: [],
    routes: [
      '/despega/conozcamonos-1',
      '/despega/a1-cerebral',
      '/despega/a1-wow-report',
      '/despega/a1-emotional',
      '/despega/a1-balance',
      '/despega/a1-summary',
    ],
  },
  {
    pillar: 'a2',
    requiredComplete: ['a1'],
    routes: [
      '/despega/a2-routes',
      '/despega/a2/dia-',
      '/despega/a2-day-page-template',
      '/api/a2',
    ],
  },
  {
    pillar: 'a3',
    requiredComplete: ['a1', 'a2'],
    routes: [
      '/despega/a3',
      '/despega/a3-career-mirror',
      '/api/a3',
    ],
  },
  {
    pillar: 'a4',
    requiredComplete: ['a1', 'a2', 'a3'],
    routes: [
      '/despega/a4-documents',
      '/despega/a4-documents-client',
      '/documentos',
      '/api/a4',
    ],
  },
]

export function getPillarFromPath(pathname: string): PillarName | null {
  for (const rule of PILLAR_ACCESS_RULES) {
    for (const route of rule.routes) {
      if (route.endsWith('-') && pathname.startsWith(route)) {
        // Handle wildcard routes like /despega/a2/dia-
        return rule.pillar
      }
      if (pathname === route || pathname.startsWith(route + '/')) {
        return rule.pillar
      }
    }
  }
  return null
}

export function getRequiredPillars(pillar: PillarName): PillarName[] {
  const rule = PILLAR_ACCESS_RULES.find(r => r.pillar === pillar)
  return rule?.requiredComplete || []
}

export function canAccessPillar(
  pillar: PillarName,
  completedPillars: PillarName[]
): boolean {
  const required = getRequiredPillars(pillar)
  return required.every(p => completedPillars.includes(p))
}

export function getAccessDeniedRedirect(deniedPillar: PillarName): string {
  // Redirect to the first incomplete required pillar
  const required = getRequiredPillars(deniedPillar)
  
  for (const pillar of required) {
    // If this pillar is not yet accessible, it's the first one to complete
    const pillarRequired = getRequiredPillars(pillar)
    if (pillarRequired.length === 0) {
      // This is A1, always accessible
      return '/despega/conozcamonos-1'
    }
  }
  
  // Default to A1
  return '/despega/conozcamonos-1'
}

export const EXEMPT_PATHS = [
  '/dashboard',
  '/biblioteca',
  '/documentos-publicos',
  '/auth',
  '/api/auth',
  '/api/documentos',
]

export function shouldEnforcePillarAccess(pathname: string): boolean {
  // Don't enforce on exempt paths
  return !EXEMPT_PATHS.some(path => pathname.startsWith(path))
}
