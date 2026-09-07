import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import assert from 'node:assert/strict'
import { buildA1ProfessionalReport } from '../lib/reports/a1-professional-report'
import type { CareerContext } from '../lib/career/types'

Object.assign(globalThis, { React })
async function main() {
  const { IdentityOverview } = await import('../components/career/identity-overview')
  const valid = buildA1ProfessionalReport({ rawScores: { D: 20, I: 8, S: -14, C: -14 }, completedAt: '2026-09-07T18:00:00Z', c2Responses: { '1': 'Objetivo sintético', '3': '<script>unsafe()</script>' } })
  const ambiguous = buildA1ProfessionalReport({ rawScores: { D: 0, I: 0, S: 0, C: 0 }, dominantPattern: 'D', secondaryPattern: 'I' })
  const invalid = buildA1ProfessionalReport({ rawScores: { D: 20, I: 8, S: 0, C: 0 } })
  const render = (a1: typeof valid | null, context: CareerContext | null = null) => renderToStaticMarkup(<IdentityOverview a1={a1} context={context} />)
  const populated = render(valid), tied = render(ambiguous), missing = render(null), unavailable = render(invalid)
  assert.ok(populated.includes('Objetivo sintético'))
  assert.ok(populated.includes('&lt;script&gt;unsafe()&lt;/script&gt;'))
  assert.ok(!populated.includes('<script>'))
  assert.ok(populated.includes('Puntaje neto: <!-- -->-14') || /Puntaje neto:[\s\S]{0,30}-14/.test(populated))
  assert.ok(populated.includes('/despega/a1-report'))
  assert.ok(populated.includes('Todavía no hay registros de habilidades'))
  assert.ok(tied.includes('Hay preferencias empatadas'))
  assert.ok(!tied.includes('Impulsor Catalítico'))
  assert.ok(missing.includes('Sin evaluación disponible'))
  assert.ok(!missing.includes('Puntaje neto:'))
  assert.ok(unavailable.includes('Requiere revisión'))
  assert.ok(!unavailable.includes('Puntaje neto:'))
  for (const html of [populated, tied, missing, unavailable]) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1)
    assert.ok(!html.includes('<main'))
    assert.ok(!html.includes('confidence'))
  }
  console.log('Career Identity SSR: PASS (4 synthetic states, 24 assertions; real component markup, not authenticated browser or visual QA)')
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
