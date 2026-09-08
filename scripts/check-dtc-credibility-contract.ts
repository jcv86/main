import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

const howItWorks = source('app/(public)/como-funciona/page.tsx')
for (const stage of ['A1', 'A2', 'A3', 'A4', 'Despega Cerebral', 'Tu Ruta', 'Entrenamiento', 'Radar Estratégico']) {
  assert.ok(howItWorks.includes(stage), `Falta lenguaje canónico: ${stage}`)
}
for (const unsupportedClaim of ['6 evaluaciones', 'MBTI', 'Big Five', 'RIASEC', 'certificado digital', '70%+']) {
  assert.ok(!howItWorks.includes(unsupportedClaim), `Promesa pública no acreditada: ${unsupportedClaim}`)
}

const companies = source('app/(public)/para-empresas/page.tsx')
for (const unsupportedClaim of ['10,000 empleados', 'SSO/SAML', 'SAP SuccessFactors', '3:1', '+45%', '$2,500']) {
  assert.ok(!companies.includes(unsupportedClaim), `Promesa B2B no acreditada: ${unsupportedClaim}`)
}
assert.ok(companies.includes('sin exponer respuestas personales'))
assert.ok(companies.includes('resultados laborales garantizados'))

const evolution = source('components/gamificacion-dashboard.tsx')
for (const label of ['A1 · Despega Cerebral', 'A2 · Tu Ruta', 'A3 · Entrenamiento', 'A4 · Radar Estratégico']) {
  assert.ok(evolution.includes(label), `Falta nomenclatura en evolución: ${label}`)
}
assert.ok(!evolution.includes('Participante ${rank}'))
assert.ok(!evolution.includes('Top 10'))

assert.ok(!evolution.includes(".limit(10)"))
assert.ok(evolution.includes(".eq('user_id', uid)"))
assert.ok(evolution.includes('Compárate contigo'))

const settings = source('app/despega/settings/page.tsx')
assert.ok(settings.includes("fetch('/api/preferences'"))
assert.ok(!settings.includes('learning_style'))
assert.ok(!settings.includes('preferred_contact'))
assert.ok(!settings.includes('defaultChecked'))
assert.ok(settings.includes('flex-wrap'))
assert.ok(settings.includes('min-w-0'))
assert.ok(settings.includes('flex-1 break-words'))
for (const controlId of ['settings-language', 'settings-timezone']) {
  assert.ok(settings.includes(`htmlFor="${controlId}"`), `Falta etiqueta accesible para ${controlId}`)
  assert.ok(settings.includes(`id="${controlId}"`), `Falta id accesible para ${controlId}`)
}
for (const lowContrastClass of ['text-blue/60', 'text-orange/60', 'text-purple/60', 'text-cyan/60']) {
  assert.ok(!settings.includes(lowContrastClass), `Contraste insuficiente en Configuración: ${lowContrastClass}`)
}

const preferences = source('app/api/preferences/route.ts')
assert.ok(preferences.includes('supabase.auth.getUser()'))
assert.ok(preferences.includes(".eq('user_id', user.id)"))
assert.ok(!preferences.includes('createAdminClient'))
assert.ok(!preferences.includes('SUPABASE_SERVICE_ROLE_KEY'))
assert.ok(preferences.includes("'Cache-Control': 'private, no-store'"))

const footer = source('components/footer.tsx')
for (const label of ['A1 · Despega Cerebral', 'A2 · Tu Ruta', 'A3 · Entrenamiento', 'A4 · Radar Estratégico']) {
  assert.ok(footer.includes(label), `Falta nomenclatura canónica en footer: ${label}`)
}
for (const staleLabel of ['>El Ritual<', '>Exploración<', '>La Realidad<']) {
  assert.ok(!footer.includes(staleLabel), `Nomenclatura heredada visible en footer: ${staleLabel}`)
}

const globalMetadata = source('app/layout.tsx')
const homeMetadata = source('app/page.tsx')
for (const unsupportedClaim of ['test MBTI', 'Big Five personalidad', 'Tests Psicométricos']) {
  assert.ok(!globalMetadata.includes(unsupportedClaim), `Metadata global no acreditada: ${unsupportedClaim}`)
}
assert.ok(!homeMetadata.includes('tests científicos'))

console.log('DTC credibility contract: PASS (public promises, canonical language, private evolution, persisted settings)')
