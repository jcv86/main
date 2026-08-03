export interface LegacyContinuityInput {
  authenticated: boolean
  access: {
    a2: boolean
    a3: boolean
    a4: boolean
  }
  highestA2DayUnlocked: number
  canonicalNextPath: string
}

function validA2Day(value: number): number {
  return Number.isInteger(value) && value >= 1 && value <= 90 ? value : 1
}

/** Pure resolver used by compatibility routes and the continuity contract. */
export function resolveLegacyContinuityDestination(
  input: LegacyContinuityInput,
): string {
  if (!input.authenticated) return '/auth/signin'
  if (input.access.a4) return '/despega/a4'
  if (input.access.a3) return '/despega/a3'
  if (input.access.a2) {
    return `/despega/a2/dia-${validA2Day(input.highestA2DayUnlocked)}`
  }
  return input.canonicalNextPath
}
