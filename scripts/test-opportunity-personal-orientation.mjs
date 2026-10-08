import assert from 'node:assert/strict'
import test from 'node:test'
import { createOpportunityPersonalOrienter, evaluateOpportunityPersonalOrientation } from '../lib/opportunities/personal-orientation.ts'
import { createOpportunityEvaluator, rankOpportunities } from '../lib/opportunities/matching.ts'
import { deriveOpportunityEvidence } from '../lib/opportunities/opportunity-evidence.ts'

// Entirely synthetic fixtures. No models, network, database or real candidate records.
const now = new Date('2026-10-08T02:30:00.000Z')
const observedAt = '2026-10-07T22:00:00.000Z'
const filters = { targetRoles: ['Analista de datos'], locations: ['Metropolitana'], workModes: ['hybrid'], breadth: 'related' }
const sources = ['cv', 'dtc_goal', 'dtc_a1', 'dtc_a2', 'dtc_a3']

function record(changes = {}) {
  return { id: 'cv:synthetic:skills', source: 'cv', nature: 'declared_skill', label: 'Habilidades declaradas en CV', text: 'SQL y Excel.', observedAt, expiresAt: null, href: '/despega/a3/cv-builder-studio', ...changes }
}

function context(evidence = [], changes = {}) {
  return {
    version: 1, status: evidence.length ? 'available' : 'empty', revision: 'synthetic-revision', evidence,
    sources: sources.map(source => ({ source, status: evidence.some(item => item.source === source) ? 'available' : 'empty', updatedAt: evidence.some(item => item.source === source) ? observedAt : null })),
    ...changes,
  }
}

function job(changes = {}) {
  const value = {
    source: 'chiletrabajos', source_id: '7000011', title: 'Analista de datos', location: 'Santiago, Chile', region: 'Metropolitana',
    work_mode: 'hybrid', last_verified_at: '2026-10-08T02:00:00.000Z', description: null,
    requirements: ['SQL avanzado.', 'Excel.'], skills: [], ...changes,
  }
  const derived = deriveOpportunityEvidence({ description: value.description, requirements: value.requirements, skills: value.skills, workMode: value.work_mode })
  return { ...value, requirements: derived.requirements, skills: derived.skills, field_evidence: derived.evidence,
    match: createOpportunityEvaluator(filters)(value), ...('field_evidence' in changes ? { field_evidence: changes.field_evidence } : {}) }
}

function evaluate(evidence = [], vacancy = job(), changes = {}) {
  return evaluateOpportunityPersonalOrientation(vacancy, context(evidence, changes), filters, now)
}

function rankForProfile(vacancies, evidence, search = filters) {
  const orient = createOpportunityPersonalOrienter(context(evidence), search, now)
  return rankOpportunities(vacancies, search).map((vacancy, order) => ({ ...vacancy, ...orient(vacancy), order }))
    .sort((a, b) => a.match.rank - b.match.rank || b.supportedTopics - a.supportedTopics || a.order - b.order)
}

test('a CV reason cites the complete pertinent declaration and the actual offer requirement', () => {
  const result = evaluate([record({ text: 'Resumen sin relación.\nSQL avanzado en reportes mensuales.\nOtra información personal no pertinente.' })])
  assert.equal(result.orientation.status, 'with_evidence')
  assert.equal(result.supportedTopics, 1)
  assert.equal(result.orientation.reasons[0].code, 'cv_skill')
  const support = result.orientation.support[0]
  assert.equal(support.personal.text, 'SQL avanzado en reportes mensuales.')
  assert.equal(support.personal.nature, 'declared_skill')
  assert.equal(support.personal.observedAt, observedAt)
  assert.equal(support.offer.value, 'SQL')
  assert.equal(support.offer.excerpt, 'SQL avanzado.')
  assert.ok(!JSON.stringify(result).includes('Otra información personal'))
  assert.ok(result.orientation.toConfirm.some(item => item.code === 'level_unconfirmed'))
})

test('practice and a CV declaration remain distinguishable and count as one shared topic', () => {
  const result = evaluate([
    record({ text: 'SQL.' }),
    record({ id: 'a3:synthetic:artifact', source: 'dtc_a3', nature: 'practice_artifact', text: 'Preparé una consulta SQL para el ejercicio.', href: '/despega/a3' }),
  ], job({ requirements: ['SQL.'] }))
  assert.equal(result.supportedTopics, 1)
  assert.equal(result.orientation.reasons.length, 1)
  assert.match(result.orientation.reasons[0].label, /tu CV y en una práctica de DTC/)
  assert.deepEqual(result.orientation.support.map(item => item.personal.nature), ['declared_skill', 'practice_artifact'])
  assert.equal(result.orientation.reasons[0].supportIds.length, 2)
})

test('a declared DTC experience is described as a declaration, not an accredited practice', () => {
  const result = evaluate([record({ source: 'dtc_a2', id: 'a2:synthetic:declaration', nature: 'declared_experience', text: 'Utilicé Excel para revisar ventas.' })])
  assert.match(result.orientation.reasons[0].label, /experiencia que declaraste en DTC/)
  assert.doesNotMatch(result.orientation.reasons[0].label, /práctica|acredit/)
})

test('two profiles with the same search receive different reasons and a relevant within-rank order', () => {
  const vacancies = [job({ source_id: '7000011', requirements: ['SQL.'] }), job({ source_id: '7000012', requirements: ['Python.'] })]
  const sqlProfile = rankForProfile(vacancies, [record({ text: 'SQL.' })])
  const pythonProfile = rankForProfile(vacancies, [record({ text: 'Python.' })])
  assert.equal(sqlProfile[0].source_id, '7000011')
  assert.equal(pythonProfile[0].source_id, '7000012')
  assert.match(sqlProfile[0].orientation.reasons[0].label, /SQL/)
  assert.match(pythonProfile[0].orientation.reasons[0].label, /Python/)
  assert.equal(sqlProfile.length, pythonProfile.length)
})

test('personal support cannot overtake a stronger search relation or bypass current region/mode filters', () => {
  const results = rankForProfile([
    job({ source_id: '7000011', title: 'Analista de datos', requirements: ['Python.'] }),
    job({ source_id: '7000012', title: 'Data Analyst', requirements: ['SQL.', 'Excel.', 'Tableau.'] }),
    job({ source_id: '7000013', title: 'Analista de datos', requirements: ['SQL.'], region: 'Valparaíso' }),
    job({ source_id: '7000014', title: 'Analista de datos', requirements: ['SQL.'], work_mode: 'remote' }),
  ], [record({ text: 'SQL, Excel y Tableau.' })])
  assert.deepEqual(results.map(item => item.source_id), ['7000011', '7000012'])
  assert.equal(results[0].supportedTopics, 0)
  assert.equal(results[1].supportedTopics, 3)
})

test('a prior CV title uses only literal/reviewed full-role equivalence and does not require parsed skills', () => {
  const previousRole = record({ id: 'cv:synthetic:experienceTitle', nature: 'declared_experience', text: 'Data Analyst' })
  const result = evaluate([previousRole], job({ requirements: [] }))
  assert.equal(result.supportedTopics, 1)
  assert.equal(result.orientation.reasons[0].code, 'cv_experience')
  assert.match(result.orientation.reasons[0].label, /declaras experiencia como Data Analyst/)
  assert.deepEqual(result.orientation.support[0].offer, { field: 'title', value: 'Analista de datos', excerpt: 'Analista de datos' })
})

test('prior-role equivalence retains seniority and excludes adjacent roles and aspirational fields', () => {
  const previousRole = record({ id: 'cv:synthetic:experienceTitle', nature: 'declared_experience', text: 'Senior Data Analyst' })
  for (const title of ['Analista de datos junior', 'Analista de datos', 'Científico de datos senior']) {
    assert.equal(evaluate([previousRole], job({ title, requirements: [] })).supportedTopics, 0, title)
  }
  assert.equal(evaluate([previousRole], job({ title: 'Analista de datos senior', requirements: [] })).supportedTopics, 1)
  assert.equal(evaluate([record({ id: 'cv:synthetic:targetRole', nature: 'declared_experience', text: 'Data Analyst' })], job({ requirements: [] })).supportedTopics, 0)
  assert.equal(evaluate([record({ id: 'cv:synthetic:experienceTitle', nature: 'declared_goal', text: 'Data Analyst' })], job({ requirements: [] })).supportedTopics, 0)
})

test('one prior title is a single visible topic, not a declaration of all tools named in the title', () => {
  const result = evaluate([record({ id: 'cv:synthetic:experienceTitle', nature: 'declared_experience', text: 'Java Developer' })], job({ title: 'Java Developer', requirements: ['Java.'] }))
  assert.equal(result.supportedTopics, 1)
  assert.equal(result.orientation.reasons.length, 1)
  assert.equal(result.orientation.support[0].offer.field, 'title')
})

test('repeated uploads and duplicated CV/DTC evidence never inflate the same topic', () => {
  const records = Array.from({ length: 35 }, (_, index) => record({ id: 'cv:synthetic:' + index, text: 'SQL.' }))
  const result = evaluate(records, job({ requirements: ['SQL.'] }))
  assert.equal(result.supportedTopics, 1)
  assert.equal(result.orientation.support.length, 1)
  assert.equal(result.orientation.reasons.length, 1)
})

test('counts correspond only to visible reasons with a maximum of three distinct topics and six supports', () => {
  const text = 'SQL, Excel, Python, Tableau y Power BI.'
  const result = evaluate([
    record({ text }),
    record({ id: 'a2:synthetic:artifact', source: 'dtc_a2', nature: 'practice_artifact', text }),
  ], job({ requirements: [text] }))
  assert.equal(result.supportedTopics, 3)
  assert.equal(result.orientation.reasons.length, 3)
  assert.equal(result.orientation.support.length, 6)
  const used = new Set([...result.orientation.reasons.flatMap(item => item.supportIds), ...result.orientation.nextStep.supportIds])
  assert.deepEqual([...used].sort(), result.orientation.support.map(item => item.id).sort())
  assert.ok(result.orientation.toConfirm.length <= 3)
})

test('negative skill lists are evaluated as a complete clause before any term is matched', () => {
  for (const text of ['No domino SQL, Python o Java.', 'Sin conocimientos de SQL, Python y Java.', 'Neither SQL nor Python nor Java.', 'I do not know SQL, Python or Java.', 'SQL, Python y Java: todavía no los manejo.']) {
    const result = evaluate([record({ text })], job({ requirements: ['SQL, Python y Java.'] }))
    assert.equal(result.supportedTopics, 0, text)
    assert.equal(result.orientation.support.length, 0)
    assert.equal(result.orientation.status, 'search_only')
    assert.ok(result.orientation.toConfirm.every(question => !/no sabes|incapaz|no cumples/.test(question.label)))
  }
})

test('a negative declaration in another current record keeps a contradiction unresolved in either input order', () => {
  const negative = record({ id: 'cv:negative:skills', text: 'No conozco SQL.' })
  const positive = record({ id: 'a3:positive:artifact', source: 'dtc_a3', nature: 'practice_artifact', text: 'Práctica de SQL.' })
  for (const entries of [[negative, positive], [positive, negative]]) assert.equal(evaluate(entries, job({ requirements: ['SQL.'] })).supportedTopics, 0)
})

test('a negative heading carries across its list and cannot be overturned by a positive record', () => {
  const negative = record({ id: 'cv:negative:skills', text: 'No domino:\nSQL\nPython\nExperiencia:\nUtilicé Excel en reportes.' })
  const positive = record({ id: 'a3:positive:artifact', source: 'dtc_a3', nature: 'practice_artifact', text: 'SQL y Python.' })
  for (const entries of [[negative, positive], [positive, negative]]) {
    const result = evaluate(entries, job({ requirements: ['SQL.', 'Python.', 'Excel.'] }))
    assert.equal(result.supportedTopics, 1)
    assert.match(result.orientation.reasons[0].label, /Excel/)
  }
})

test('an unpunctuated negative list retains scope across newlines until an explicit independent declaration', () => {
  for (const text of [
    'No domino SQL\nPython\nUtilicé Excel para preparar reportes.',
    'No domino\nSQL\nPython\nTengo experiencia con Excel.',
  ]) {
    const result = evaluate([record({ text })], job({ requirements: ['SQL.', 'Python.', 'Excel.'] }))
    assert.equal(result.supportedTopics, 1)
    assert.match(result.orientation.reasons[0].label, /Excel/)
    assert.equal(result.orientation.support[0].personal.text.includes('Python'), false)
  }
})

test('tampoco, lack and another person having experience cannot become personal support', () => {
  for (const text of ['No manejo SQL. Python tampoco.\nUtilicé Excel en reportes.', 'I lack experience with SQL.\nI used Excel to analyze reports.', 'Mi compañero tiene experiencia con SQL.\nUtilicé Excel para analizar registros.']) {
    const result = evaluate([record({ text })], job({ requirements: ['SQL.', 'Python.', 'Excel.'] }))
    assert.equal(result.supportedTopics, 1, text)
    assert.match(result.orientation.reasons[0].label, /Excel/)
    assert.doesNotMatch(result.orientation.reasons[0].label, /SQL|Python/)
  }
})

test('aspirations, learning plans and recruitment of specialists are not personal capability evidence', () => {
  for (const text of ['Quiero aprender SQL.', 'Estoy aprendiendo SQL.', 'Me gustaría trabajar con SQL.', 'Interested in SQL.', 'SQL por aprender.', 'Contraté expertos en SQL.', 'Our team uses SQL.', 'Objetivo:\nSQL\nIntereses:\nPython']) {
    assert.equal(evaluate([record({ text })], job({ requirements: ['SQL.', 'Python.'] })).supportedTopics, 0, text)
  }
})

test('an aspirational section cannot swallow a subsequent explicit experience section', () => {
  const result = evaluate([record({ text: 'Objetivo:\nSQL\nExperiencia:\nUtilicé Python para procesar registros.' })], job({ requirements: ['SQL.', 'Python.'] }))
  assert.equal(result.supportedTopics, 1)
  assert.match(result.orientation.reasons[0].label, /Python/)
  assert.doesNotMatch(result.orientation.reasons[0].label, /SQL/)
})

test('an unrelated negative sentence does not erase a separate positive declaration', () => {
  const result = evaluate([record({ text: 'No domino SQL.\nUtilicé Python para analizar registros.' })], job({ requirements: ['SQL.', 'Python.'] }))
  assert.equal(result.supportedTopics, 1)
  assert.match(result.orientation.reasons[0].label, /Python/)
})

test('expired, future, invalid and unavailable records cannot create positive guidance', () => {
  const invalid = [
    { expiresAt: now.toISOString() }, { expiresAt: '2026-10-07T00:00:00Z' },
    { expiresAt: 'not-a-date' }, { observedAt: '2026-10-09T00:00:00Z' },
    { observedAt: 'not-a-date' }, { observedAt: '2026-10-08' },
  ]
  for (const changes of invalid) assert.equal(evaluate([record(changes)]).supportedTopics, 0, JSON.stringify(changes))
  assert.equal(evaluate([record()], job(), { sources: sources.map(source => ({ source, status: 'unavailable', updatedAt: null })) }).supportedTopics, 0)
})

test('historical experience is not expired solely because its observation date is older', () => {
  assert.equal(evaluate([record({ observedAt: '2023-01-01T00:00:00Z', expiresAt: null, text: 'SQL.' })], job({ requirements: ['SQL.'] })).supportedTopics, 1)
})

test('empty and unavailable personal contexts preserve the offer and return truthful next steps', () => {
  const empty = evaluate([])
  assert.equal(empty.orientation.status, 'search_only')
  assert.equal(empty.supportedTopics, 0)
  assert.match(empty.orientation.nextStep.label, /Actualiza tu CV/)
  const unavailable = evaluate([record()], job(), { status: 'unavailable' })
  assert.equal(unavailable.orientation.status, 'context_unavailable')
  assert.equal(unavailable.orientation.support.length, 0)
  assert.match(unavailable.orientation.nextStep.label, /Vuelve a cargar/)
})

test('partial source availability can use the actual records while retaining incomplete-context guidance', () => {
  const result = evaluate([record({ text: 'SQL.' })], job({ requirements: ['SQL.'] }), { status: 'partial' })
  assert.equal(result.orientation.status, 'with_evidence')
  assert.ok(result.orientation.toConfirm.some(item => item.code === 'context_incomplete'))
})

test('an offer skill without a valid two-sided source quote never produces a personal reason', () => {
  for (const field_evidence of [[], [{ field: 'skills', value: 'SQL', excerpt: 'Python.', origin: 'source_field' }], [{ field: 'skills', value: 'SQL', excerpt: 'No se requiere SQL.', origin: 'description' }]]) {
    const result = evaluate([record()], job({ requirements: ['SQL.'], field_evidence }))
    assert.equal(result.supportedTopics, 0)
    assert.equal(result.orientation.support.length, 0)
  }
})

test('an unrelated source payload field cannot manufacture a source quote', () => {
  const vacancy = job({ requirements: ['SQL.'] })
  vacancy.field_evidence = [{ field: 'skills', value: 'Python', excerpt: 'Python.', origin: 'source_field' }]
  const result = evaluate([record({ text: 'Python.' })], vacancy)
  assert.equal(result.supportedTopics, 0)
})

test('word boundaries keep SQL apart from PostgreSQL, Java apart from JavaScript and short terms apart', () => {
  for (const [skill, text] of [['SQL', 'PostgreSQL.'], ['Java', 'JavaScript.'], ['SAP', 'Sapphire.'], ['UX', 'Auxiliar administrativo.'], ['C', 'C++.'], ['C', 'C#.'], ['C#', 'C++.'], ['C++', 'C#.']]) {
    assert.equal(evaluate([record({ text })], job({ requirements: [], skills: [skill] })).supportedTopics, 0, skill + '/' + text)
  }
  for (const [skill, text] of [['C++', 'Usé C++ para construir un módulo.'], ['C#', 'C#.'], ['.NET', 'Desarrollé con .NET.'], ['Node.js', 'Node.js.']]) {
    assert.equal(evaluate([record({ text })], job({ requirements: [], skills: [skill] })).supportedTopics, 1, skill)
  }
})

test('ordinary English verbs and nouns are not mistaken for identically named software', () => {
  for (const [skill, text] of [
    ['Excel', 'I excel at coordinating teams.'], ['React', 'I react to changing conditions.'],
    ['Word', 'I had the final word in project decisions.'], ['Spring', 'Organized spring events.'],
    ['Swift', 'Provided swift communication.'], ['Go', 'I go to customer meetings.'],
    ['Python', 'My colleague uses Python.'], ['SQL', 'Mi compañero domina SQL.'],
  ]) assert.equal(evaluate([record({ text, nature: 'declared_experience' })], job({ requirements: [], skills: [skill] })).supportedTopics, 0, skill)
  for (const [skill, text] of [
    ['Excel', 'I used Excel in financial analysis.'], ['React', 'I used React to build a screen.'],
    ['Word', 'Preparé reportes en Word.'], ['Spring', 'Construí una API con Spring.'],
    ['Swift', 'Desarrollé una aplicación en Swift.'], ['Go', 'Desarrollé servicios con Go.'],
  ]) assert.equal(evaluate([record({ text, nature: 'declared_experience' })], job({ requirements: [], skills: [skill] })).supportedTopics, 1, skill)
})

test('only reviewed spelling/language variants join a source topic and a personal declaration', () => {
  for (const [skill, text] of [['English', 'Inglés.'], ['Power BI', 'PowerBI.'], ['PostgreSQL', 'Postgres.'], ['written communication', 'Comunicación escrita.']]) {
    assert.equal(evaluate([record({ text })], job({ requirements: [], skills: [skill] })).supportedTopics, 1, skill)
  }
})

test('years, fluency, certification and advanced levels remain pending even when a topic is supported', () => {
  for (const requirement of ['SQL avanzado.', '5 years of Python experience.', 'English fluency.', 'Certified Excel proficiency.']) {
    const result = evaluate([record({ text: 'SQL, Python, English y Excel.' })], job({ requirements: [requirement] }))
    assert.equal(result.supportedTopics, 1, requirement)
    assert.ok(result.orientation.toConfirm.some(item => item.code === 'level_unconfirmed'), requirement)
    assert.ok(result.orientation.support.length)
    assert.doesNotMatch(JSON.stringify(result.orientation.reasons), /cumples|acreditad|dominas|ideal|%/)
  }
})

test('separate detailed requirements retain level and other conditions when a provider skill quote is minimal', () => {
  for (const [requirement, expectedCode] of [['SQL avanzado y 3 años de experiencia.', 'level_unconfirmed'], ['SQL y disponibilidad para viajar.', 'requirement_unconfirmed']]) {
    const vacancy = job({ requirements: [requirement], skills: ['SQL'] })
    vacancy.field_evidence = [
      { field: 'skills', value: 'SQL', excerpt: 'SQL', origin: 'source_field' },
      { field: 'requirements', value: requirement, excerpt: requirement, origin: 'source_field' },
    ]
    const result = evaluate([record({ text: 'SQL.' })], vacancy)
    assert.equal(result.supportedTopics, 1)
    assert.ok(result.orientation.toConfirm.some(item => item.code === expectedCode && item.offer?.excerpt === requirement), requirement)
  }
})

test('a requirement without a parsed skill remains explicitly for review', () => {
  const result = evaluate([record()], job({ requirements: ['Disponibilidad para viajar dos veces al mes.'] }))
  assert.equal(result.supportedTopics, 0)
  assert.equal(result.orientation.toConfirm[0].code, 'requirement_unconfirmed')
  assert.match(result.orientation.toConfirm[0].offer.excerpt, /viajar dos veces/)
})

test('a declared DTC objective explains direction but never counts as supported expertise', () => {
  const result = evaluate([record({ id: 'goal:synthetic:target', source: 'dtc_goal', nature: 'declared_goal', text: 'Analista de datos', href: '/despega/career-identity' })], job({ title: 'Data Analyst', requirements: [] }))
  assert.equal(result.supportedTopics, 0)
  assert.equal(result.orientation.status, 'with_evidence')
  assert.equal(result.orientation.reasons[0].code, 'dtc_goal')
  assert.equal(result.orientation.support[0].offer.field, 'title')
})

test('a different or explicitly rejected DTC objective cannot override the current search', () => {
  for (const text of ['Contador', 'No quiero ser Analista de datos']) {
    const result = evaluate([record({ id: 'goal:synthetic:target', source: 'dtc_goal', nature: 'declared_goal', text })])
    assert.equal(result.orientation.reasons.length, 0, text)
    assert.equal(result.supportedTopics, 0)
  }
})

const preferenceText = 'En Colaborar y coordinar, al responder «¿Cómo te integras a un equipo?», elegiste «Escucho las propuestas de otros» como más parecido y «Decido por mi cuenta» como menos parecido. Es una preferencia autodeclarada, no una competencia'
const preference = () => record({ id: 'a1:synthetic:question:3', source: 'dtc_a1', nature: 'self_reported_preference', preferenceDomain: 'collaboration', text: preferenceText, href: '/despega/a1-report' })

test('A1 situational preferences support reflection with a related offer quote and never rank aptitude', () => {
  const result = evaluate([preference()], job({ requirements: ['Trabajo en equipo.'] }))
  assert.equal(result.supportedTopics, 0)
  assert.equal(result.orientation.reasons.length, 0)
  assert.equal(result.orientation.status, 'with_evidence')
  assert.match(result.orientation.nextStep.label, /ejemplo reciente de colaboración/)
  assert.equal(result.orientation.support[0].personal.nature, 'self_reported_preference')
  assert.equal(result.orientation.support[0].offer.excerpt, 'Trabajo en equipo.')
  assert.equal(result.orientation.nextStep.supportIds[0], result.orientation.support[0].id)
})

test('A1 routing uses its canonical domain independently of display punctuation and prose', () => {
  const text = 'En «Colaborar y coordinar», al responder «¿Cómo te integras?», elegiste «Escucho propuestas» como más parecido y «Decido por mi cuenta» como menos parecido. Es una preferencia autodeclarada; no acredita una competencia.'
  const result = evaluate([record({ ...preference(), text })], job({ requirements: ['Trabajo en equipo.'] }))
  assert.equal(result.supportedTopics, 0)
  assert.equal(result.orientation.support.length, 1)
  assert.equal(result.orientation.support[0].personal.text, text)
  assert.equal(result.orientation.support[0].personal.preferenceDomain, 'collaboration')
  assert.equal(evaluate([record({ ...preference(), preferenceDomain: undefined })], job({ requirements: ['Trabajo en equipo.'] })).orientation.support.length, 0)
})

test('A1 does not invent a role preference, interpret the less-choice as a skill or react to unrelated offers', () => {
  const result = evaluate([preference()], job({ requirements: ['SQL.'] }))
  assert.equal(result.supportedTopics, 0)
  assert.equal(result.orientation.support.length, 0)
  for (const text of ['Perfil DISC dominante C: SQL avanzado.', 'Prefiero SQL.', preferenceText.replace('En Colaborar y coordinar', 'En una nueva escala psicológica')]) {
    assert.equal(evaluate([preference(), record({ ...preference(), id: 'a1:other:question', text })], job({ requirements: ['SQL.'] })).orientation.support.length, 0)
  }
})

test('psychological content cannot be relabeled as a CV skill or a DTC practice', () => {
  for (const changes of [
    { source: 'dtc_a1', nature: 'declared_skill', text: 'SQL.' },
    { source: 'dtc_a3', nature: 'practice_artifact', text: 'Perfil psicológico: SQL avanzado.' },
    { source: 'cv', nature: 'declared_skill', text: 'Perfil DISC: SQL avanzado.' },
  ]) assert.equal(evaluate([record(changes)]).supportedTopics, 0)
})

test('support exports a bounded clause and approved source route, never arbitrary source metadata', () => {
  const result = evaluate([record({ text: 'SQL.', label: 'Private synthetic label', href: 'https://untrusted.invalid/document', extraneous: 'PRIVATE_UNUSED' })], job({ requirements: ['SQL.'] }))
  const support = result.orientation.support[0]
  assert.equal(support.personal.href, '/despega/a3/cv-builder-studio')
  assert.equal(support.personal.label, 'Tu CV')
  assert.ok(!JSON.stringify(result).includes('PRIVATE_UNUSED'))
  assert.ok(!JSON.stringify(result).includes('untrusted.invalid'))
})

test('malformed IDs, unsupported source kinds and markup cannot become cited personal evidence', () => {
  for (const changes of [
    { id: 'synthetic@example.invalid' }, { id: 'https://invalid.invalid' },
    { source: 'system' }, { nature: 'personality_score' },
    { text: '<script>SQL</script>' }, { text: 'SQL\u0000' },
  ]) assert.equal(evaluate([record(changes)]).orientation.support.length, 0, JSON.stringify(changes))
})

test('long clauses and complexity limits never create a truncated positive claim', () => {
  for (const text of ['SQL ' + 'context '.repeat(130) + 'no lo domino.', 'SQL ' + 'x'.repeat(40_001), 'SQL\n'.repeat(501), 'SQL. '.repeat(2_001)]) {
    assert.equal(evaluate([record({ text })], job({ requirements: ['SQL.'] })).supportedTopics, 0)
  }
  const vacancy = job({ requirements: [] })
  vacancy.skills = ['SQL']
  vacancy.field_evidence = [{ field: 'skills', value: 'SQL', excerpt: 'SQL ' + 'context '.repeat(130) + 'no requerido.', origin: 'source_field' }]
  assert.equal(evaluate([record({ text: 'SQL.' })], vacancy).supportedTopics, 0)
})

test('the input opportunity, filters and context are not mutated, and deterministic reads remain equal', () => {
  const vacancy = job()
  const personal = context([record()])
  const before = JSON.stringify({ vacancy, personal, filters })
  const orient = createOpportunityPersonalOrienter(personal, filters, now)
  assert.deepEqual(orient(vacancy), orient(vacancy))
  assert.deepEqual(orient(vacancy), evaluateOpportunityPersonalOrientation(vacancy, personal, filters, now))
  assert.equal(JSON.stringify({ vacancy, personal, filters }), before)
})

test('an empty or non-finite clock never grants current evidence', () => {
  const result = evaluateOpportunityPersonalOrientation(job(), context([record()]), filters, new Date(NaN))
  assert.equal(result.supportedTopics, 0)
  assert.equal(result.orientation.support.length, 0)
})

test('a profile factory can serve 500 offers with stable private input and independent result objects', () => {
  const orient = createOpportunityPersonalOrienter(context([record({ text: 'SQL, Python y Excel.' })]), filters, now)
  const vacancy = job({ requirements: ['SQL.', 'Python.', 'Excel.'] })
  const result = Array.from({ length: 500 }, (_, index) => orient({ ...vacancy, source_id: String(7_000_000 + index) }))
  assert.ok(result.every(item => item.supportedTopics === 3 && item.orientation.reasons.length === 3))
  result[0].orientation.support[0].personal.text = 'Modified synthetic copy'
  assert.notEqual(result[1].orientation.support[0].personal.text, 'Modified synthetic copy')
  assert.equal(orient(vacancy).orientation.support[0].personal.text, 'SQL, Python y Excel.')
})
