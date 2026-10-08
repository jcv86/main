import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import * as React from 'react'
import * as runtime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import { load } from 'cheerio'
import * as icons from 'lucide-react'
import * as queryHelpers from '../lib/opportunities/search-query.ts'
import { OPPORTUNITY_SOURCE_LABELS } from '../lib/opportunities/types.ts'

// Compile the actual rendering boundary. Fixtures are synthetic and do not read
// profiles, assessment answers, databases, accounts or external sources.
const ROOT = new URL('../app/despega/a4/job-matching/', import.meta.url)
function compile(name, dependencies = {}) {
  const source = new URL(name, ROOT)
  const module = { exports: {} }
  const compiled = ts.transpileModule(fs.readFileSync(source, 'utf8'), {
    fileName: source.pathname,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  const modules = {
    react: React,
    'react/jsx-runtime': runtime,
    'lucide-react': icons,
    'next/link': { __esModule: true, default: 'a' },
    '@/components/ui/card': { Card: 'article', CardContent: 'div', CardHeader: 'header', CardTitle: 'h3' },
    '@/components/ui/button': { Button: ({ asChild, children, ...props }) => asChild ? React.cloneElement(children, props) : React.createElement('button', props, children) },
    '@/lib/opportunities/types': { OPPORTUNITY_SOURCE_LABELS },
    '@/lib/opportunities/search-query': queryHelpers,
    ...dependencies,
  }
  new Function('require', 'module', 'exports', compiled)(dependency => {
    assert.ok(Object.hasOwn(modules, dependency), 'Unexpected runtime dependency: ' + dependency)
    return modules[dependency]
  }, module, module.exports)
  return module.exports
}

const components = compile('personal-orientation.tsx')
const render = (component, props) => load(renderToStaticMarkup(React.createElement(component, props)))
const proof = (id = 'sql', overrides = {}) => ({
  id,
  personal: {
    id: 'cv-synthetic-skill', source: 'cv', nature: 'declared_skill', label: 'Habilidad en mi CV',
    text: 'Preparé consultas SQL para reportes mensuales.', observedAt: '2026-10-08T01:30:00Z',
    expiresAt: null, href: '/despega/a3/cv-builder-studio',
  },
  offer: { field: 'skills', value: 'SQL', excerpt: 'Se requiere experiencia con SQL.' },
  ...overrides,
})
const orientation = (overrides = {}) => ({
  version: 1, status: 'with_evidence',
  summary: 'Encontramos cruces respaldados por tu información y esta oferta.',
  reasons: [{ code: 'cv_skill', label: 'Tu CV declara SQL y esta oferta lo solicita.', supportIds: ['sql'] }],
  toConfirm: [{ code: 'requirement_unconfirmed', label: 'El nivel de inglés está pendiente de confirmar.', offer: { field: 'requirements', value: 'Inglés avanzado', excerpt: 'Se requiere inglés avanzado.' } }],
  nextStep: { label: 'Revisa y concreta en tu CV un ejemplo del uso de SQL.', href: '/despega/a3/cv-builder-studio', supportIds: ['sql'] },
  support: [proof()],
  ...overrides,
})
const show = overrides => render(components.PersonalOrientation, { orientation: orientation(overrides), title: 'Analista de datos QA' })
const context = overrides => ({
  version: 1, status: 'available', revision: 'SYNTHETIC PRIVATE REVISION',
  sources: ['cv', 'dtc_goal', 'dtc_a1', 'dtc_a2', 'dtc_a3'].map(source => ({ source, status: 'available', updatedAt: '2026-10-08T01:30:00Z' })),
  ...overrides,
})
const cases = []
const test = (name, run) => cases.push({ name, run })

test('server-issued reasons, questions and next action render without reinterpretation', () => {
  const value = orientation()
  const $ = show()
  assert.deepEqual($('[aria-label="Motivos respaldados"] > li').map((_, element) => $(element).text()).get(), value.reasons.map(reason => reason.label))
  assert.ok($('body').text().includes(value.summary))
  assert.ok($('body').text().includes(value.toConfirm[0].label))
  assert.ok($('body').text().includes(value.nextStep.label))
  assert.match($('h5').text(), /Por confirmarTu siguiente paso/)
  assert.doesNotMatch($('body').text(), /%|probabilidad|empleabilidad|puntuación/i)
})

test('evidence retains origin, declared nature, relevant excerpts and Chile time', () => {
  const $ = show()
  assert.match($('details').text(), /CV · Habilidad declarada/)
  assert.match($('details').text(), /Preparé consultas SQL para reportes mensuales/)
  assert.match($('details').text(), /En la oferta · Habilidad publicada/)
  assert.match($('details').text(), /Se requiere experiencia con SQL/)
  assert.equal($('details time').attr('datetime'), '2026-10-08T01:30:00Z')
  assert.match($('details time').text(), /07-10-2026|07\/10\/2026/)
  assert.match($('details').text(), /22:30.*Chile/)
})

test('A1 self-report and DTC practice are labelled with their distinct meaning', () => {
  for (const [source, nature, expected] of [
    ['dtc_a1', 'self_reported_preference', 'A1 · Autoconocimiento · Preferencia autodeclarada'],
    ['dtc_a2', 'practice_artifact', 'A2 · Ruta de desarrollo · Ejercicio registrado'],
    ['dtc_a3', 'declared_experience', 'A3 · Entrenamiento · Experiencia declarada'],
    ['dtc_goal', 'declared_goal', 'Objetivo profesional · Objetivo declarado'],
  ]) {
    const personal = { ...proof().personal, source, nature }
    assert.ok(show({ support: [proof('sql', { personal })] })('details').text().includes(expected))
  }
})

test('support is an initially collapsed native disclosure with an offer-specific name', () => {
  const $ = show()
  assert.equal($('details').length, 1)
  assert.equal($('details').attr('open'), undefined)
  assert.match($('details > summary').text(), /Ver en qué nos basamos para Analista de datos QA/)
  assert.equal($('summary').attr('role'), undefined)
  assert.equal($('summary').attr('tabindex'), undefined)
  assert.match($('summary').attr('class'), /min-h-11/)
  assert.match($('summary').attr('class'), /focus-visible:ring-2/)
})

test('unreferenced evidence and complete private profile markers never reach the markup', () => {
  const secret = 'SYNTHETIC UNREFERENCED PRIVATE EVIDENCE'
  const $ = show({
    support: [proof(), proof('not-used', { personal: { ...proof().personal, text: secret } })],
    private_profile: { description: secret },
  })
  assert.doesNotMatch($('body').text(), /SYNTHETIC UNREFERENCED PRIVATE/)
  assert.equal($('details > ul > li').length, 1)
})

test('action-only references are reachable and duplicated proof IDs appear once', () => {
  const $ = show({ reasons: [], support: [proof(), proof()], toConfirm: [] })
  assert.equal($('[aria-label="Motivos respaldados"]').length, 0)
  assert.equal($('details > ul > li').length, 1)
  assert.match($('details').text(), /Preparé consultas SQL/)
})

test('a legacy response without orientation remains free from fabricated personalization', () => {
  const $ = render(components.PersonalOrientation, {
    title: 'Analista QA', profileEvidence: { strengths: ['PRIVATE LOCAL PROFILE'], targetRole: 'Analista' },
  })
  assert.equal($('body').text(), '')
  assert.equal($('section, details, a').length, 0)
})

test('a search-only response keeps the explicit limitation and useful next step', () => {
  const summary = 'Esta oferta aparece por tus filtros. Todavía no encontramos un cruce personal respaldado.'
  const $ = show({
    status: 'search_only', summary, reasons: [], support: [],
    toConfirm: [{ code: 'context_incomplete', label: 'Tu experiencia con SQL está pendiente de confirmar.' }],
    nextStep: { label: 'Agrega un ejemplo concreto a tu CV.', href: '/despega/a3/cv-builder-studio', supportIds: [] },
  })
  assert.ok($('body').text().includes(summary))
  assert.equal($('[aria-label="Motivos respaldados"], details').length, 0)
  assert.match($('body').text(), /Tu experiencia con SQL está pendiente de confirmar/)
  assert.match($('body').text(), /Agrega un ejemplo concreto a tu CV/)
  assert.doesNotMatch($('body').text(), /no tienes SQL|careces|te falta SQL/)
})

test('server text and quoted fragments are inert, including HTML-shaped content', () => {
  const attack = '<img src=x onerror="syntheticAttack()"><script>syntheticAttack()</script>'
  const value = orientation({
    summary: attack,
    reasons: [{ code: 'cv_skill', label: attack, supportIds: ['sql'] }],
    toConfirm: [{ code: 'requirement_unconfirmed', label: attack, offer: { field: 'skills', value: attack, excerpt: attack } }],
    nextStep: { label: attack, supportIds: ['sql'] },
    support: [proof('sql', { personal: { ...proof().personal, text: attack, label: attack }, offer: { field: 'skills', value: attack, excerpt: attack } })],
  })
  const $ = render(components.PersonalOrientation, { orientation: value, title: attack })
  assert.equal($('img, script, iframe, object, [onerror], [onclick]').length, 0)
  assert.ok($('body').text().includes(attack))
})

test('only exact reviewed first-party routes can become action or source links', () => {
  const allowed = ['/despega/career-identity', '/despega/a1-report', '/despega/a2', '/despega/a3', '/despega/a3/cv-builder-studio', '/despega/a3/value-mining-lab', '/despega/a3/job-decoder', '/despega/a3/answer-architecture', '/despega/a3/ajuste-por-vacante', '/despega/recorrido']
  for (const href of allowed) {
    const $ = show({ nextStep: { label: 'Acción sintética', href, supportIds: ['sql'] }, support: [proof('sql', { personal: { ...proof().personal, href } })] })
    assert.equal($('a').length, 2)
    assert.ok($('a').toArray().every(element => $(element).attr('href') === href))
  }
  for (const href of ['javascript:syntheticAttack()', '//example.test/x', 'https://example.test/x', '/despega/a3?email=private', '/despega/a3/../admin', '/admin/users', '/despega/a3#private', ' /despega/a3', '/despega/a3\n', '/despega/a3/cv-inteligente']) {
    const $ = show({ nextStep: { label: 'Acción sintética', href, supportIds: ['sql'] }, support: [proof('sql', { personal: { ...proof().personal, href } })] })
    assert.equal($('a').length, 0, 'Disallowed href was rendered: ' + href)
    assert.match($('body').text(), /Acción sintética/)
  }
})

test('missing dates stay explicit and evidence validity does not crash rendering', () => {
  const missing = show({ support: [proof('sql', { personal: { ...proof().personal, observedAt: 'invalid', expiresAt: null } })] })
  assert.match(missing('details').text(), /Sin fecha registrada/)
  assert.equal(missing('time').length, 0)
  const dated = show({ support: [proof('sql', { personal: { ...proof().personal, expiresAt: '2026-11-01T12:00:00Z' } })] })
  assert.equal(dated('time').length, 2)
  assert.match(dated('details').text(), /Vigencia hasta/)
})

test('bounded reasons and questions cannot reveal support that only hidden reasons reference', () => {
  const reasons = Array.from({ length: 4 }, (_, i) => ({ code: 'cv_skill', label: 'Motivo ' + i, supportIds: ['proof-' + i] }))
  const $ = show({
    reasons,
    toConfirm: Array.from({ length: 4 }, (_, i) => ({ code: 'requirement_unconfirmed', label: 'Consulta ' + i })),
    nextStep: { label: 'Paso breve.', supportIds: [] },
    support: reasons.map((_, i) => proof('proof-' + i, { personal: { ...proof().personal, text: 'Extracto ' + i } })),
  })
  assert.equal($('[aria-label="Motivos respaldados"] li').length, 3)
  assert.doesNotMatch($('body').text(), /Motivo 3|Consulta 3|Extracto 3/)
  assert.equal($('details > ul > li').length, 3)
})

test('context availability lists sources with dates without exposing revision or raw evidence', () => {
  const $ = render(components.PersonalContextStatus, { context: { ...context(), evidence: ['PRIVATE COMPLETE EVIDENCE'] } })
  assert.match($('body').text(), /Tu información para orientar la búsqueda/)
  assert.equal($('details > ul > li').length, 5)
  assert.equal($('time').length, 5)
  assert.doesNotMatch($('body').text(), /SYNTHETIC PRIVATE REVISION|PRIVATE COMPLETE EVIDENCE/)
  assert.equal($('details').attr('open'), undefined)
})

test('empty and unavailable sources have different user-facing states without blocking exploration', () => {
  const value = context({ status: 'partial', sources: [
    { source: 'cv', status: 'empty', updatedAt: null },
    { source: 'dtc_a1', status: 'unavailable', updatedAt: null },
    { source: 'dtc_a3', status: 'partial', updatedAt: '2026-10-08T01:30:00Z' },
  ] })
  const $ = render(components.PersonalContextStatus, { context: value, onRefresh() {} })
  const pending = $('[aria-label="Fuentes pendientes de orientación"]')
  assert.match(pending.text(), /CV: Sin evidencia registrada/)
  assert.match(pending.text(), /A1 · Autoconocimiento: No disponible en esta consulta/)
  assert.match(pending.text(), /A3 · Entrenamiento: Disponible en parte/)
  assert.match($('body').text(), /Puedes seguir explorando/)
  assert.equal($('button').text(), 'Volver a consultar mi contexto')
  assert.equal($('button').attr('type'), 'button')
  assert.match($('button').attr('class'), /min-h-11/)
})

test('empty, unavailable and legacy context do not assert a lack of ability', () => {
  for (const status of ['empty', 'unavailable']) {
    const $ = render(components.PersonalContextStatus, { context: context({ status, sources: [] }) })
    assert.match($('body').text(), /Puedes (seguir explorando|explorar)/)
    assert.doesNotMatch($('body').text(), /no tienes experiencia|no tienes habilidades|no estás preparado/)
  }
  assert.equal(render(components.PersonalContextStatus, {})('body').text(), '')
})

test('actual result cards integrate personal support and keep the original offer detail and link', () => {
  const filters = { targetRoles: ['Analista de datos'], breadth: 'related', locations: [], workModes: [] }
  const job = {
    sourceId: 'synthetic', source: 'chiletrabajos', title: 'Analista de datos QA', company: 'Empresa sintética',
    originalUrl: 'https://www.chiletrabajos.cl/trabajo/synthetic-4000000', location: 'Santiago',
    workMode: null, publishedAt: null, expiresAt: null, verificationStatus: 'verified_active',
    description: 'Descripción sintética para conservar el detalle original.', requirements: ['SQL'], skills: ['SQL'],
    match: { kind: 'title', rank: 0, reasons: [{ code: 'exact_role', label: 'Coincide con tu filtro de cargo.' }] },
    orientation: orientation(),
  }
  const payload = { needs_intent: false, opportunities: [job], personal_context: context(), applied_filters: filters, count: 1, total_matching: 1, pagination: { next_offset: null } }
  let cursor = 0
  const results = compile('real-opportunity-results.tsx', {
    './personal-orientation': components,
    react: {
      useState(initial) { const i = cursor++; return [i === 0 ? payload : i === 1 ? false : initial, () => assert.fail('Read-only render mutated state')] },
      useEffect() {}, useRef: initial => ({ current: initial }),
    },
  })
  const $ = render(results.RealOpportunityResults, { view: 'explore', filters, profileEvidence: { strengths: ['PRIVATE LOCAL PROFILE'] } })
  assert.match($('body').text(), /Por qué aparece/)
  assert.match($('body').text(), /Tu orientación para esta oferta/)
  assert.match($('body').text(), /Ver detalle de Analista de datos QA/)
  assert.match($('body').text(), /Ver en qué nos basamos para Analista de datos QA/)
  assert.equal($('a[href="' + job.originalUrl + '"]').length, 1)
  assert.equal($('a[href="' + job.originalUrl + '"]').attr('rel'), 'noopener noreferrer')
  assert.doesNotMatch($('body').text(), /PRIVATE LOCAL PROFILE/)
})

let passed = 0
for (const { name, run } of cases) {
  try { await run(); passed++; console.log('PASS ' + name) }
  catch (error) { console.error('FAIL ' + name); throw error }
}
console.log(JSON.stringify({ suite: 'opportunity-personal-detail', passed, total: cases.length, syntheticIO: true, productionWrites: 0 }))
