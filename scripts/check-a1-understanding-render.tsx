import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { DISC_TEST_QUESTIONS } from '../lib/disc-test-questions'
import { validateAndScoreDiscResponses } from '../lib/a1/disc-scoring'
import { buildA1ProfessionalReport } from '../lib/reports/a1-professional-report'
import { CLARIFICATION_KEY } from '../lib/a1/individual-understanding'
import { UNDERSTANDING_VERSION } from '../lib/a1/individual-evidence'

// tsx may use the classic JSX runtime with the application's jsx:preserve config.
// This is a test process only; the production build uses Next's JSX transform.
Object.assign(globalThis, { React })

async function main() {
  const { A1IndividualSection } = await import('../components/reports/a1-individual-section')
  const more: Record<string, string> = {}, less: Record<string, string> = {}
  for (const [i, question] of DISC_TEST_QUESTIONS.entries()) {
    more[String(question.id)] = question.opciones[i < 20 ? 0 : 1].texto
    less[String(question.id)] = question.opciones[i % 2 ? 2 : 3].texto
  }
  const scoring = validateAndScoreDiscResponses({ more, less }).value!
  const revision = 'a'.repeat(64)
  const report = buildA1ProfessionalReport({ rawScores: scoring.scores, assessmentResponses: scoring.responses,
    sourceRevision: revision, c1Responses: { '1': ['Empleado', 'Independiente'], '2': ['5-10 años'], '3': '<script>alert(1)</script>', '4': 'Objetivo inicial de prueba' }, c2Responses: { '1': 'Objetivo posterior de prueba', '3': 'Rol de prueba' } })
  const first = report.understanding.questions[0]
  const withFeedback = buildA1ProfessionalReport({ rawScores: scoring.scores, assessmentResponses: scoring.responses, sourceRevision: revision,
    c2Responses: { [CLARIFICATION_KEY]: { version: UNDERSTANDING_VERSION, revision, savedAt: '2026-09-07T19:00:00Z', answers: { selections: { [first.id]: 'no_example' }, recognition: 'not_represents' } } } })
  const tied = buildA1ProfessionalReport({ rawScores: { D: 0, I: 0, S: 0, C: 0 }, dominantPattern: 'D', secondaryPattern: 'I' })
  const invalid = buildA1ProfessionalReport({ rawScores: { D: 15, I: 10, S: 2, C: 1 } })
  const render = (value: typeof report) => renderToStaticMarkup(<A1IndividualSection value={value.understanding} editRevision={null} />)
  const html = render(report), feedback = render(withFeedback), ambiguous = render(tied), unavailable = render(invalid)
  assert.equal((html.match(/Pregunta \d+:/g) || []).length, 28)
  assert.equal((html.match(/Por qué aparece esto/g) || []).length, 6)
  assert.ok(html.includes('Empleado · Independiente') && html.includes('5-10 años'))
  assert.ok(html.includes('Objetivo inicial de prueba') && html.includes('Objetivo posterior de prueba') && html.includes('Rol de prueba'))
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
  assert.ok(!html.includes('<script>'))
  assert.ok(feedback.includes('No me representa'))
  assert.ok(feedback.includes('No se toma como evidencia conductual'))
  assert.ok(ambiguous.includes('Hay más de una lectura posible del patrón'))
  assert.ok(!ambiguous.includes('Pregunta 1:'))
  assert.equal(invalid.reviewable, false)
  assert.ok(unavailable.includes('No se genera una lectura situacional'))
  assert.ok(!unavailable.includes('Por qué aparece esto'))
  assert.ok(!html.includes('<main'))
  assert.ok(!html.includes('fixture-user') && !html.includes('user_id'))
  const output = process.env.A1_QA_OUTPUT
  if (output) {
    mkdirSync(output, { recursive: true })
    for (const [name, body] of Object.entries({ populated: html, feedback, ambiguous, unavailable })) {
      writeFileSync(join(output, `${name}.html`), `<!doctype html><html lang="es"><meta charset="utf-8"><title>QA sintético A1 — ${name}</title><body><p>FIXTURE SINTÉTICO. Solo markup SSR; no representa una cuenta real ni QA visual o autenticado.</p>${body}</body></html>`)
    }
  }
  console.log('DTC A1 understanding SSR: PASS (4 synthetic states, 15 assertions; no browser, CSS layout or live authentication tested)')
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
