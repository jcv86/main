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

// Real TSX bodies and native details semantics, with only shell primitives and
// fetch state replaced. Every value is synthetic; there are no database calls.
const SOURCE = new URL('../app/despega/a4/job-matching/real-opportunity-results.tsx', import.meta.url)
function compile(hooks = React, source = SOURCE) {
  const module = { exports: {} }
  const output = ts.transpileModule(fs.readFileSync(source, 'utf8'), {
    fileName: source.pathname,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  const modules = {
    react: hooks,
    'react/jsx-runtime': runtime,
    'lucide-react': icons,
    'next/link': { __esModule: true, default: 'a' },
    '@/components/ui/card': { Card: 'article', CardContent: 'div', CardHeader: 'header', CardTitle: 'h3' },
    '@/components/ui/button': { Button: ({ asChild, children, ...props }) => asChild ? React.cloneElement(children, props) : React.createElement('button', props, children) },
    '@/lib/opportunities/types': { OPPORTUNITY_SOURCE_LABELS },
    '@/lib/opportunities/search-query': queryHelpers,
  }
  if (source === SOURCE) modules['./personal-orientation'] = compile(hooks, new URL('./personal-orientation.tsx', SOURCE))
  new Function('require', 'module', 'exports', output)(name => {
    assert.ok(Object.hasOwn(modules, name), 'Unexpected runtime dependency: ' + name)
    return modules[name]
  }, module, module.exports)
  return module.exports
}

const components = compile()
const JOB = {
  source: 'lever', sourceId: 'synthetic-offer', title: 'Data Analyst', company: 'Empresa sintética',
  location: 'Santiago', region: 'Metropolitana', workMode: 'remote', publishedAt: '2026-10-07', expiresAt: null,
  originalUrl: 'https://jobs.lever.co/synthetic/synthetic-offer', verificationStatus: 'verified_active',
  lastVerifiedAt: '2026-10-08T00:15:00Z', description: 'Descripción de una oferta sintética.', requirements: [], skills: [],
}
const FILTERS = { targetRoles: [], locations: [], workModes: [], breadth: 'related' }
const render = (Component, props) => load(renderToStaticMarkup(React.createElement(Component, props)))
const detail = overrides => render(components.PublishedOpportunityDetail, { job: { ...JOB, ...overrides } })
function results(jobOverrides = {}, props = {}) {
  const payload = {
    needs_intent: false, mode: 'explore', inventory_status: 'ready', opportunities: [{ ...JOB, ...jobOverrides }],
    applied_filters: FILTERS, count: 1, total_matching: 1, scope: { limit: 500, limitReached: false },
    pagination: { offset: 0, next_offset: null, snapshot: 'a'.repeat(64) },
  }
  let cursor = 0
  const actual = compile({
    useState(initial) { const index = cursor++; return [index === 0 ? payload : index === 1 ? false : initial, () => assert.fail('Read-only rendering changed state')] },
    useRef: initial => ({ current: initial }),
    useEffect() {},
  })
  return render(actual.RealOpportunityResults, { view: 'explore', filters: FILTERS, ...props })
}

const cases = []
const test = (name, run) => cases.push({ name, run })

test('the detail is an initially collapsed native disclosure with the offer in its accessible label', () => {
  const $ = detail()
  assert.equal($('details').length, 1)
  assert.equal($('details').attr('open'), undefined)
  assert.equal($('details > summary').length, 1)
  assert.match($('summary').text(), /Ver detalle de Data Analyst/)
  assert.equal($('summary').attr('tabindex'), undefined)
  assert.equal($('summary').attr('role'), undefined)
  assert.equal($('details form, details button, details a').length, 0)
})

test('the preview stays short while the disclosure preserves the complete available description and paragraphs', () => {
  const description = 'Contexto y funciones de una oportunidad sintética. '.repeat(12) + '\n\nCONDICIÓN FINAL QUE ANTES NO SE VEÍA.'
  const $ = detail({ description })
  const full = $('details p').filter((_, element) => $(element).text() === description)
  assert.equal(full.length, 1)
  assert.match(full.attr('class'), /whitespace-pre-wrap/)
  assert.doesNotMatch(full.attr('class'), /line-clamp|truncate/)
  const preview = $('body > div > p').text()
  assert.ok(preview.length <= 241)
  assert.ok(preview.endsWith('…'))
  assert.ok(!preview.includes('CONDICIÓN FINAL'))
  assert.match($('details').text(), /texto disponible de la publicación/)
  assert.doesNotMatch($('details').text(), /publicación completa|aviso completo/)
})

test('all available requirements and skills are reachable beyond the old four/eight previews', () => {
  const requirements = Array.from({ length: 9 }, (_, i) => `Requisito sintético ${i + 1}`)
  const skills = Array.from({ length: 13 }, (_, i) => `Habilidad sintética ${i + 1}`)
  const $ = detail({ requirements, skills })
  const entries = $('details li').map((_, element) => $(element).text().trim()).get()
  assert.equal(entries.length, requirements.length + skills.length)
  assert.deepEqual(entries, [...requirements, ...skills])
})

test('provider text, requirements, skills and excerpts render as inert text, including HTML-looking input', () => {
  const attack = '<img src=x onerror="window.syntheticAttack()"><script>syntheticAttack()</script>'
  const $ = detail({
    description: attack, requirements: [attack], skills: [attack], workMode: 'remote',
    fieldEvidence: [{ field: 'workMode', value: 'remote', excerpt: attack, origin: 'description' }],
  })
  assert.equal($('script, img, iframe, object').length, 0)
  assert.ok($('details').text().includes(attack))
  assert.equal($('[onerror], [onclick]').length, 0)
})

test('match reasons preserve the exact server labels without inventing a percentage, profile or alternative role', () => {
  const labels = ['Cargo equivalente a Analista de datos: Data Analyst.', 'Región informada: Metropolitana.', 'Modalidad remota informada por la empresa.']
  const $ = render(components.OpportunityMatchReasons, { match: { kind: 'equivalent', rank: 1, reasons: labels.map((label, i) => ({ code: 'synthetic_' + i, label })) } })
  assert.deepEqual($('li').map((_, element) => $(element).text()).get(), labels)
  assert.match($('body').text(), /Por qué aparece/)
  assert.doesNotMatch($('body').text(), /%|preparación|perfil|probabilidad|puntuación/i)
})

test('a legacy offer without match metadata never receives a fabricated explanation', () => {
  for (const match of [undefined, { kind: 'all', rank: 0, reasons: [] }]) {
    const $ = render(components.OpportunityMatchReasons, { match })
    assert.equal($('body').text(), '')
  }
})

test('description-derived skills retain their supporting excerpt while repeated source fields stay compact', () => {
  const $ = detail({
    skills: ['SQL', 'Excel'],
    fieldEvidence: [
      { field: 'skills', value: 'SQL', excerpt: 'Se requiere experiencia en consultas SQL.', origin: 'description', section: 'Requisitos' },
      { field: 'skills', value: 'Excel', excerpt: 'Excel', origin: 'source_field' },
      { field: 'skills', value: 'Python', excerpt: 'UNRELATED PROOF', origin: 'description' },
    ],
  })
  assert.match($('details').text(), /En la descripción: Se requiere experiencia en consultas SQL\./)
  assert.equal($('details q').length, 1)
  assert.doesNotMatch($('details').text(), /UNRELATED PROOF|Python/)
})

test('mode evidence is displayed only when it backs the same published mode', () => {
  const proof = { field: 'workMode', value: 'hybrid', excerpt: 'Trabajo híbrido, dos días en oficina.', origin: 'description' }
  assert.doesNotMatch(detail({ workMode: 'remote', fieldEvidence: [proof] })('details').text(), /Trabajo híbrido/)
  assert.match(detail({ workMode: 'hybrid', fieldEvidence: [proof] })('details').text(), /Trabajo híbrido, dos días en oficina\./)
  assert.doesNotMatch(detail({ workMode: null, fieldEvidence: [proof] })('details').text(), /Modalidad informada/)
})

test('missing structured data remains unknown without asserting that the employer never published it', () => {
  const $ = detail({ description: null, requirements: [], skills: [] })
  assert.match($('body').text(), /No hay una descripción disponible en esta ficha/)
  assert.match($('details').text(), /No informada en esta ficha/)
  assert.match($('details').text(), /No identificados en esta ficha/)
  assert.match($('details').text(), /No identificadas en esta ficha/)
  assert.doesNotMatch($('body').text(), /no requiere|sin requisitos|no exige|la empresa no/i)
})

test('unknown location and modality are explicit while the original source and link remain available', () => {
  const $ = results({ location: null, workMode: null })
  assert.match($('body').text(), /Ubicación: No informada en esta ficha/)
  assert.match($('body').text(), /Modalidad: No informada en esta ficha/)
  assert.match($('body').text(), /Fuente: Sitio de la empresa/)
  const original = $('a').filter((_, element) => $(element).attr('href') === JOB.originalUrl)
  assert.equal(original.length, 1)
  assert.equal(original.attr('target'), '_blank')
  assert.equal(original.attr('rel'), 'noopener noreferrer')
  assert.match(original.text(), /Ver oferta original de Data Analyst \(abre otra pestaña\)/)
})

test('profile text never creates client-side match reasons or unsolicited coaching actions', () => {
  const secret = 'SYNTHETIC PRIVATE PROFILE MARKER'
  const $ = results({ title: 'Director de Operaciones' }, { profileEvidence: { targetRole: 'Director', strengths: [secret], missingProof: [secret], nextBestActions: [secret] } })
  assert.doesNotMatch($('body').text(), /SYNTHETIC PRIVATE|Coincidencia de título|Trabajar esta brecha|Objetivo declarado|Evidencia de tu perfil/)
  assert.equal($('a[href^="/despega/a3"]').length, 0)
})

test('result rendering uses the supplied matching explanation and never exposes provider payloads', () => {
  const label = 'Motivo sintético decidido en el servidor.'
  const $ = results({
    match: { kind: 'related', rank: 2, reasons: [{ code: 'related_role', label }] },
    raw: { secret: 'SYNTHETIC SOURCE PAYLOAD' }, source_payload: { secret: 'SYNTHETIC SOURCE PAYLOAD' },
  })
  assert.equal($('li').filter((_, element) => $(element).text() === label).length, 1)
  assert.doesNotMatch($('body').text(), /SYNTHETIC SOURCE PAYLOAD/)
  assert.equal($('details').length, 1)
})

let passed = 0
for (const { name, run } of cases) {
  try { await run(); passed++; console.log('PASS ' + name) }
  catch (error) { console.error('FAIL ' + name); throw error }
}
console.log(JSON.stringify({ suite: 'opportunity-result-detail', passed, total: cases.length, productionWrites: 0 }))
