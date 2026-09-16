import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

function excludes(path: string, content: string, claims: string[]) {
  const normalized = content.toLowerCase()
  for (const claim of claims) {
    assert.ok(
      !normalized.includes(claim.toLowerCase()),
      `${path} must not expose retired/unsupported claim: ${claim}`,
    )
  }
}

const theme = source('components/dtc/theme.tsx')
const navbar = source('components/dtc/navbar.tsx')
const closing = source('components/dtc/closing-canonical.tsx')
const rootLayout = source('app/layout.tsx')
const howItWorks = source('app/(public)/como-funciona/layout.tsx')
const institutions = source('app/convenios-universidades/page.tsx')
const companies = source('app/(public)/para-empresas/layout.tsx')
const contactLayout = source('app/(public)/contact/layout.tsx')
const contactPage = source('app/(public)/contact/page.tsx')
const faqData = source('lib/faq-data.ts')
const faqPage = source('app/faq/page.tsx')
const interactiveFaq = source('components/interactive-faq.tsx')
const schema = source('lib/schema-org.tsx')
const seoHelpers = source('components/seo-optimized-content.tsx')
const manifest = source('app/manifest.ts')
const aiContext = source('public/ai-training-data.md')
const sitemap = source('app/sitemap.ts')
const library = source('app/biblioteca/page.tsx')
const privacy = source('app/privacy/page.tsx')
const terms = source('app/terms/page.tsx')

assert.ok(
  theme.includes("pruebaEnVivo: '/#perfil-vivo'"),
  'Public live-experience CTAs must point to the live Perfil Vivo section.',
)
assert.ok(!theme.includes("pruebaEnVivo: '/demo'"), 'Retired /demo must not be exposed through the shared CTA route.')
assert.ok(navbar.includes("label: 'Equipo DTC'"), 'Navbar must describe /careers as the DTC team surface, not user employment search.')
assert.ok(closing.includes("label: 'Equipo DTC'"), 'Closing navigation must describe /careers consistently.')

assert.ok(!rootLayout.includes('alternates: {'), 'Root layout must not force every public subpage to use the home canonical.')
assert.ok(
  howItWorks.includes('canonical: "https://www.despegatucarrera.com/como-funciona"'),
  '/como-funciona must own its canonical.',
)
excludes('app/(public)/como-funciona/layout.tsx', howItWorks, [
  'resultados medibles',
  'planes desde gratuitos hasta premium',
  'rating: 4.8',
  'price: "0"',
  'generateCourseSchema',
])

assert.ok(!schema.includes('transforma carreras en 90 días'), 'Organization schema must not make an unsupported transformation promise.')
assert.ok(schema.includes('apoyar decisiones con más evidencia'), 'Organization schema should use evidence-led positioning.')
assert.ok(!seoHelpers.includes('https://tucarrera.cl'), 'Structured-data helpers must use the current DTC domain.')

excludes('app/convenios-universidades/page.tsx', institutions, [
  '120+',
  '~60%',
  'GPT-4',
  'Freemium Institucional',
  'Lanzamiento previsto',
  'Universidad de Chile',
  'Pontificia Universidad Católica',
])
assert.ok(
  institutions.includes('Piloto primero. Escala después.'),
  'Institutional page must use the evidence-first pilot positioning.',
)
assert.ok(
  institutions.includes('canonical: \'https://www.despegatucarrera.com/convenios-universidades\''),
  'Institutional page must own its canonical.',
)

excludes('lib/faq-data.ts', faqData, [
  '$4.390',
  'Sofia',
  'Dani',
  '120+',
  '9 de cada 10',
  'garantía de 7 días',
  'plataforma líder',
  'tucarrera.cl',
])
assert.ok(faqData.includes('Vera es el coach con IA de DTC.'), 'FAQ must describe the current Vera architecture.')
assert.ok(faqData.includes('no garantiza empleo'), 'FAQ must state that employment outcomes are not guaranteed.')
assert.ok(faqPage.includes('canonical: `${SITE_URL}/faq`'), 'FAQ page must own its canonical.')
excludes('components/interactive-faq.tsx', interactiveFaq, ['responde al instante 24/7', 'en línea · responde al instante'])
assert.ok(
  interactiveFaq.includes('Si tu acceso está habilitado, puedes conversar con Vera desde tu cuenta.'),
  'FAQ Vera CTA must describe access truthfully without an unsupported availability SLA.',
)

excludes('app/(public)/para-empresas/layout.tsx', companies, [
  'price: "2000"',
  'rating: 4.9',
  'ADP',
  'Workday',
  'Sí, nos integramos',
  'plan Enterprise incluye opciones de personalización',
  'generateProductSchema',
])
assert.ok(companies.includes('no garantiza retención'), 'Enterprise FAQ must explicitly avoid unsupported ROI/outcome guarantees.')
assert.ok(
  companies.includes('¿Existen integraciones, white-label o precios estándar?'),
  'Enterprise FAQ may discuss white-label only as an uncommitted capability question.',
)
assert.ok(
  companies.includes('No se publican como capacidades o condiciones estándar.'),
  'Enterprise FAQ must explicitly frame integrations, white-label and pricing as non-standard/uncommitted.',
)
assert.ok(
  companies.includes('canonical: "https://www.despegatucarrera.com/para-empresas"'),
  'Enterprise page must own its canonical.',
)

assert.ok(
  contactLayout.includes('canonical: "https://www.despegatucarrera.com/contact"'),
  'Contact page must own its canonical.',
)
excludes('app/(public)/contact/layout.tsx', contactLayout, ['menos de 24 horas', 'dentro de 24 horas'])
excludes('app/(public)/contact/page.tsx', contactPage, ['menos de 24 horas', 'dentro de 24 horas', '56912345678'])
assert.ok(contactPage.includes('56963160187'), 'Contact WhatsApp must match the published DTC number.')

assert.ok(
  privacy.includes('canonical: "https://www.despegatucarrera.com/privacy"'),
  'Privacy page must own its canonical.',
)
assert.ok(
  terms.includes('canonical: "https://www.despegatucarrera.com/terms"'),
  'Terms page must own its canonical.',
)
assert.ok(terms.includes('No garantiza empleo'), 'Terms must state product outcome boundaries.')

excludes('app/manifest.ts', manifest, ['TuCarrera.cl', 'plataforma líder'])
assert.ok(manifest.includes('name: "Despega Tu Carrera"'), 'PWA manifest must use current brand.')

excludes('public/ai-training-data.md', aiContext, [
  'TuCarrera.cl',
  '120+',
  'GPT-4',
  'leading platform',
  'all 6 psychometric',
])
assert.ok(aiContext.includes('final decision belongs to the user'), 'Public AI context must preserve user agency.')

assert.ok(!sitemap.includes('"/biblioteca"'), 'Empty legacy library must not be promoted in the public sitemap.')
assert.ok(library.includes('index: false'), 'Empty legacy library must be noindex while it has no public catalogue.')

console.log(
  JSON.stringify({
    evidenceLevel: 'source_contract',
    retiredDemoCtaExposed: false,
    stalePublicCommercialClaimsExposed: false,
    staleInstitutionalClaimsExposed: false,
    staleFaqClaimsExposed: false,
    unsupportedVeraAvailabilityClaimExposed: false,
    staleCrawlerContextExposed: false,
    rootCanonicalLeak: false,
    emptyLibraryIndexed: false,
    contactSlaGuaranteed: false,
    contactNumberConsistent: true,
    currentProductLanguageLocked: true,
  }),
)
