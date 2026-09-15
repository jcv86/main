import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const theme = source('components/dtc/theme.tsx')
const howItWorks = source('app/(public)/como-funciona/layout.tsx')
const schema = source('lib/schema-org.tsx')

assert.ok(
  theme.includes("pruebaEnVivo: '/#perfil-vivo'"),
  'Public live-experience CTAs must point to the live Perfil Vivo section.',
)
assert.ok(
  !theme.includes("pruebaEnVivo: '/demo'"),
  'Retired /demo must not be exposed through the shared public CTA route.',
)

for (const claim of [
  'resultados medibles',
  'planes desde gratuitos hasta premium',
  'rating: 4.8',
  'price: "0"',
  'generateCourseSchema',
]) {
  assert.ok(
    !howItWorks.toLowerCase().includes(claim.toLowerCase()),
    `/como-funciona structured data must not publish unsupported claim: ${claim}`,
  )
}

assert.ok(
  !schema.includes('transforma carreras en 90 días'),
  'Organization schema must not make an unsupported transformation promise.',
)
assert.ok(
  schema.includes('apoyar decisiones con más evidencia'),
  'Organization schema should use the evidence-led positioning.',
)

console.log(
  JSON.stringify({
    evidenceLevel: 'source_contract',
    retiredDemoCtaExposed: false,
    unsupportedCourseRatingExposed: false,
    unsupportedCoursePriceExposed: false,
    organizationPromiseEvidenceLed: true,
  }),
)
