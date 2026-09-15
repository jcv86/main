import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const hero = readFileSync(join(process.cwd(), 'components/dtc/hero.tsx'), 'utf8')

assert.ok(hero.includes('<h1'), 'Hero must keep one explicit primary heading')
assert.ok(hero.includes('Decide tu siguiente paso con'), 'Hero must lead with the evidence-led product promise')
assert.ok(hero.includes('<GradientText>evidencia.</GradientText>'), 'Evidence must carry visual emphasis')
assert.ok(hero.includes('Vera · IA con contexto, no un chat genérico'), 'Hero must differentiate Vera from generic chat')
assert.ok(hero.includes('Vera ayuda a pensar; tú decides'), 'Hero must preserve user agency')
assert.ok(hero.includes('Respuesta rápida'), 'Hero must translate FastTrack into user language')
assert.ok(hero.includes('Análisis profundo'), 'Hero must translate Agentic mode into user language')
assert.ok(!hero.includes('Brain v2'), 'Hero must not expose internal architecture versioning')
assert.ok(!hero.includes('>Fast<'), 'Hero must not expose FastTrack jargon')
assert.ok(!hero.includes('>Agentic<'), 'Hero must not expose Agentic jargon')
assert.ok(hero.includes('href="#como-funciona"'), 'Secondary hero CTA must land on a working product explanation')
assert.ok(!hero.includes('href={ROUTES.pruebaEnVivo}'), 'Hero must not link to retired /demo surface')
assert.ok(!hero.includes('requestAnimationFrame'), 'Hero must not re-render animation state every frame')
assert.ok(!hero.includes('useState'), 'Hero visual must be CSS-driven rather than React animation state')
assert.ok(!hero.includes('useEffect'), 'Hero visual must not need animation lifecycle effects')
assert.ok(hero.includes('prefers-reduced-motion: reduce'), 'Hero animation must respect reduced-motion preference')
assert.ok(hero.includes('aria-label="Vera conecta las cuatro etapas'), 'System map needs an accessible description')

console.log(
  JSON.stringify({
    evidenceLevel: 'source_contract',
    evidenceLedPromise: true,
    userAgencyExplicit: true,
    architectureTranslatedForUsers: true,
    deadDemoCtaRetired: true,
    cssDrivenAnimation: true,
    reducedMotionSupported: true,
  }),
)
