/** Synthetic declarations only; no evaluated skill or observed external outcome. */
module.exports = function reviewEvidenceFixture() {
  const capture = (role, id, observedAt) => ({
    observationId: id, observedAt, measurementRole: role,
    responsePayload: {
      behavioral: 'AG05_DECLARED_RESPONSE: coordiné una entrega con mi equipo y quiero contrastar el resultado que declaré.',
      value_fit: 'Mi experiencia declarada puede ayudar al equipo a ordenar una tarea y comunicar el resultado esperado.',
      challenge: 'Quiero practicar una respuesta concreta y comprobar con un ejemplo qué necesito explicar con más claridad.',
    },
  })
  const decision = {
    id: '00000000-0000-4000-8000-000000009201', signalId: '00000000-0000-4000-8000-000000009101',
    decision: 'AG05_DECLARED_DECISION: contrastar una oportunidad antes de cambiar mi siguiente paso.',
    rationale: 'Quiero distinguir lo que esperaba de lo que pude registrar durante la revisión.',
    expectedEvidence: 'Conservar una respuesta concreta y explicar qué falta comprobar antes de decidir.',
    status: 'watching', reviewOn: '2026-11-05', outcome: null, reviewedAt: null,
    reviewClassification: null, externalOutcomes: [],
    createdAt: '2026-11-04T12:00:00.000001Z', updatedAt: '2026-11-04T12:00:00.000001Z',
  }
  return {
    version: 'dtc-a2-review-evidence.v1',
    a3: { status: 'available', history: {
      instrumentKey: 'a3_structured_interview', instrumentVersion: '2-capture',
      baseline: capture('baseline', '00000000-0000-4000-8000-000000009001', '2026-11-04T12:00:00.000001Z'),
      followUp: capture('follow_up', '00000000-0000-4000-8000-000000009002', '2026-11-06T12:00:00.000002Z'),
      pairStatus: 'available', evaluationStatus: 'not_evaluated', comparable: false,
    } },
    a4: { status: 'available', nextReview: decision, latestReview: {
      ...decision, id: '00000000-0000-4000-8000-000000009202',
      decision: 'AG05_REVIEWED_DECISION: revisar lo que puedo comprobar antes de elegir una acción.',
      status: 'reviewed', reviewOn: '2026-11-05',
      outcome: 'Declaré que todavía falta contrastar la evidencia y no atribuyo un resultado a la plataforma.',
      reviewedAt: '2026-11-06T12:00:00.000003Z', updatedAt: '2026-11-06T12:00:00.000003Z',
      reviewClassification: 'inconclusive', externalOutcomes: ['no_external_change'],
    } },
  }
}
