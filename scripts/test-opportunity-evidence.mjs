import assert from 'node:assert/strict'
import test from 'node:test'
import { deriveOpportunityEvidence, readableOpportunityText, readableOpportunityTextResult } from '../lib/opportunities/opportunity-evidence.ts'
import { normalizeEmployerJob } from '../lib/opportunities/sources/employer-normalize.ts'
import { EMPLOYER_BOARDS, employerBoardKey } from '../lib/opportunities/sources/employer-registry.ts'
import { parseChileTrabajosJobHtml } from '../lib/opportunities/sources/chiletrabajos-parser.ts'

// Only synthetic source data. No network, database, credentials or user state.
const at = '2026-10-08T01:00:00.000Z'
const board = key => EMPLOYER_BOARDS.find(entry => employerBoardKey(entry) === key)
const uuid = '00000000-0000-4000-8000-000000000001'
const gh = changes => ({
  id: 1, internal_job_id: 10, title: 'Analista de prueba', location: { name: 'Santiago, Chile' }, offices: [],
  absolute_url: 'https://job-boards.greenhouse.io/chile/jobs/1',
  content: '<p>Revisar registros e identificar mejoras con el equipo de trabajo.</p>', ...changes,
})
const lever = changes => ({
  id: uuid, text: 'Analista de prueba', country: 'CL', workplaceType: 'remote',
  categories: { location: 'Santiago, Chile' }, hostedUrl: `https://jobs.lever.co/coderio/${uuid}`,
  descriptionPlain: 'Revisar registros e identificar mejoras con el equipo de trabajo.', lists: [], ...changes,
})
const ctUrl = 'https://www.chiletrabajos.cl/trabajo/7000001'
const ct = (description, fields = {}, extra = '') => `<html><head><link rel="canonical" href="${ctUrl}"><script type="application/ld+json">${JSON.stringify({
  '@type': 'JobPosting', title: 'Analista de prueba', identifier: { value: '7000001' },
  hiringOrganization: { name: 'Empresa de prueba' }, datePosted: '2026-10-07', validThrough: '2026-12-01',
  description, ...fields,
})}</script></head><body><main id="detalle-oferta"><h1>Analista de prueba</h1>${extra}</main></body></html>`

test('visible HTML text preserves paragraphs and removes hidden, executable and encoded unsafe nodes', () => {
  const text = readableOpportunityText('&lt;h2&gt;Requisitos&lt;/h2&gt;&lt;ul&gt;&lt;li&gt;SQL y Excel&lt;/li&gt;&lt;/ul&gt;&lt;script&gt;UNSAFE&lt;/script&gt;&lt;div hidden&gt;HIDDEN&lt;/div&gt;')
  assert.equal(text, 'Requisitos:\n\nSQL y Excel')
  for (const html of [
    '<p>Visible</p><template>UNSAFE</template><svg><text>UNSAFE</text></svg>',
    '<p>Visible</p><div style="display: none">UNSAFE</div><div aria-hidden="true">UNSAFE</div>',
    '<p>Visible</p><iframe>UNSAFE</iframe><div class="adsbygoogle">UNSAFE</div>',
  ]) assert.equal(readableOpportunityText(html), 'Visible')
})

test('oversized and malformed field inputs never produce truncated evidence or object strings', () => {
  for (const value of [null, undefined, 42, {}, ['SQL'], 'a'.repeat(200_001)]) assert.equal(readableOpportunityText(value), '')
  const result = deriveOpportunityEvidence({ description: 'Requisitos:\n' + 'SQL '.repeat(11_000), requirements: [{}], skills: [null, 42] })
  assert.deepEqual(result, { requirements: [], skills: [], workMode: null, evidence: [] })
})

test('normalizers can distinguish a visible text limit from empty content using the same parser', () => {
  for (const value of ['a'.repeat(40_001), '<p>' + 'a'.repeat(40_001) + '</p>', ' '.repeat(200_001), ' '.repeat(200_001) + 'a']) {
    assert.deepEqual(readableOpportunityTextResult(value), { text: '', exceedsLimit: true })
  }
  const markup = '<p>SQL visible.</p>' + '<span data-layout="section-wrapper"></span>'.repeat(1_100)
  assert.ok(markup.length > 40_000)
  assert.deepEqual(readableOpportunityTextResult(markup), { text: 'SQL visible.', exceedsLimit: false })
  for (const value of [null, {}, '', '<script>untrusted</script>']) assert.deepEqual(readableOpportunityTextResult(value), { text: '', exceedsLimit: false })
})

test('excessive line/statement/node complexity is rejected as a whole before extraction', () => {
  for (const description of [
    'Requisitos:\n' + 'SQL\n'.repeat(9_900),
    'Requisitos: ' + 'SQL. '.repeat(3_000),
    '<p>' + '<span>'.repeat(2_001) + 'Requisitos: SQL' + '</span>'.repeat(2_001) + '</p>',
  ]) {
    assert.deepEqual(readableOpportunityTextResult(description), { text: '', exceedsLimit: true })
    assert.deepEqual(deriveOpportunityEvidence({ description }), { requirements: [], skills: [], workMode: null, evidence: [] })
    assert.deepEqual(deriveOpportunityEvidence({ description, workMode: 'remote', requirements: ['SQL.'], skills: ['SQL'] }), { requirements: [], skills: [], workMode: null, evidence: [] })
  }
})

test('Greenhouse heading/list requirements preserve exact clauses and keep benefits outside requirements', () => {
  const result = normalizeEmployerJob(board('greenhouse:chile'), gh({ content: '<h2>Requirements</h2><ul><li>Experience with PostgreSQL and Python.</li><li>Written communication in English.</li></ul><h2>Benefits</h2><ul><li>Paid AWS training.</li></ul>' }), at)
  assert.equal(result.kind, 'accepted')
  assert.deepEqual(result.job.requirements, ['Experience with PostgreSQL and Python.', 'Written communication in English.'])
  assert.deepEqual(result.job.skills, ['PostgreSQL', 'Python', 'Written communication', 'English'])
  assert.match(result.job.description, /Requirements:\n/)
  assert.ok(!result.job.skills.includes('AWS'))
})

test('a later unrecognized HTML heading ends a known requirement section', () => {
  const description = '<h2>Requisitos</h2><ul><li>Excel avanzado.</li></ul><h2>La vida en nuestro equipo</h2><p>Acceso a cursos de Python.</p>'
  const result = deriveOpportunityEvidence({ description })
  assert.deepEqual(result.requirements, ['Excel avanzado.'])
  assert.deepEqual(result.skills, ['Excel'])
  const persisted = deriveOpportunityEvidence({ description: readableOpportunityText(description), requirements: result.requirements, skills: result.skills })
  assert.deepEqual(persisted.requirements, result.requirements)
  assert.deepEqual(persisted.skills, result.skills)
})

test('standalone bold headings preserve section boundaries without changing a lone emphasized skill', () => {
  const description = '<p><strong>Requirements</strong></p><ul><li>SQL required.</li></ul><p><strong>La vida en el equipo</strong></p><p>Python courses and AWS training.</p>'
  const result = deriveOpportunityEvidence({ description })
  assert.deepEqual(result.requirements, ['SQL required.'])
  assert.deepEqual(result.skills, ['SQL'])
  const again = deriveOpportunityEvidence({ description: readableOpportunityText(description), requirements: result.requirements, skills: result.skills })
  assert.deepEqual(again.requirements, result.requirements)
  assert.deepEqual(again.skills, result.skills)
  assert.equal(readableOpportunityText('<p><strong>SQL</strong></p>'), 'SQL')
  assert.equal(readableOpportunityText('<h1>Analista de datos</h1>'), 'Analista de datos')
})

test('Spanish questions and curly-apostrophe qualification headings retain their literal requirements', () => {
  for (const heading of ['¿Qué buscamos?', 'What we’re looking for', 'What you’ll bring']) {
    const result = deriveOpportunityEvidence({ description: `<h2>${heading}</h2><ul><li>SQL y Excel.</li></ul><h2>Unrelated section</h2><p>Python training.</p>` })
    assert.deepEqual(result.requirements, ['SQL y Excel.'], heading)
    assert.deepEqual(result.skills, ['SQL', 'Excel'], heading)
  }
})

test('empty requirement headings do not absorb benefits or responsibilities', () => {
  for (const description of [
    '<h3>Qualifications</h3><ul></ul><h3>Benefits</h3><ul><li>Python training.</li></ul>',
    'Requisitos:\n\nBeneficios:\nSQL training.\nResponsabilidades:\nCrear paneles en Excel.',
    '<h2>Requirements</h2><h2>A different section</h2><p>Excel courses.</p>',
  ]) {
    const result = deriveOpportunityEvidence({ description })
    assert.deepEqual(result.requirements, [])
    assert.deepEqual(result.skills, [])
  }
})

test('malformed but readable HTML has bounded useful clauses without executing markup', () => {
  const result = deriveOpportunityEvidence({ description: '<h2>Requisitos</h2><ul><li>SQL<li>Python<script>Excel UNSAFE</script></ul><h2>Beneficios</h2><li>Java course' })
  assert.deepEqual(result.requirements, ['SQL', 'Python'])
  assert.deepEqual(result.skills, ['SQL', 'Python'])
  assert.ok(!JSON.stringify(result).includes('UNSAFE'))
})

test('explicit requirement statements in prose are quoted but mere tool mentions are not requirements', () => {
  const result = deriveOpportunityEvidence({ description: 'Nuestro equipo usa SAP. Se requiere experiencia en Excel y SQL. We use Python to publish reports.' })
  assert.deepEqual(result.requirements, ['Se requiere experiencia en Excel y SQL.'])
  assert.deepEqual(result.skills, ['Excel', 'SQL'])
  for (const quote of result.evidence) assert.equal(quote.excerpt, 'Se requiere experiencia en Excel y SQL.')
})

test('a flattened legacy line with multiple section labels remains unknown', () => {
  const result = deriveOpportunityEvidence({ description: 'Requisitos: Excel avanzado. Beneficios: Curso de Python.' })
  assert.deepEqual(result.requirements, [])
  assert.deepEqual(result.skills, [])
  assert.deepEqual(deriveOpportunityEvidence({ description: 'Requisitos: Excel avanzado.' }).skills, ['Excel'])
})

test('heading-like words in ordinary prose do not create a requirement section', () => {
  for (const description of ['Requirements gathering uses SQL.', 'Who you are working with uses Python.', 'Requisitos de nuestros clientes se revisan en SAP.']) {
    assert.deepEqual(deriveOpportunityEvidence({ description }).requirements, [])
  }
})

test('verbatim negative requirements stay readable while negated tools never become skills', () => {
  const result = deriveOpportunityEvidence({ description: 'Requisitos:\nNo se requiere Excel.\nSQL is not required.\nPython isn’t required.\nSin conocimientos previos de Java.\nExperiencia con PostgreSQL.' })
  assert.equal(result.requirements.length, 5)
  assert.ok(result.requirements.includes('No se requiere Excel.'))
  assert.deepEqual(result.skills, ['PostgreSQL'])
})

test('neither/nor, ni/ni and unnecessary qualifications cannot produce positive skills', () => {
  for (const requirement of ['Ni Java ni Python son necesarios.', 'Neither SQL nor Java experience is necessary.', 'Python experience is unnecessary.', 'Conocimiento de SAP innecesario.']) {
    const result = deriveOpportunityEvidence({ requirements: [requirement] })
    assert.deepEqual(result.requirements, [requirement])
    assert.deepEqual(result.skills, [], requirement)
  }
})

test('a populated skill field cannot resurrect a qualification explicitly negated elsewhere', () => {
  const result = deriveOpportunityEvidence({ requirements: ['No se requiere experiencia con Python ni InDesign.', 'SQL avanzado.'], skills: ['Python', 'InDesign', 'SQL'] })
  assert.deepEqual(result.skills, ['SQL'])
  const again = deriveOpportunityEvidence({ requirements: result.requirements, skills: result.skills })
  assert.deepEqual(again.skills, result.skills)
  assert.deepEqual(deriveOpportunityEvidence({ skills: ['Java', 'No Java'] }).skills, [])
})

test('mixed negative qualification clauses are conservative and benefit boilerplate is excluded', () => {
  const result = deriveOpportunityEvidence({ requirements: [
    'No se requiere Python, pero se valora Excel.',
    'Ofrecemos certificaciones en AWS.',
    'We provide SAP training.',
    'All qualified applicants are considered without regard to gender.',
  ] })
  assert.deepEqual(result.requirements, ['No se requiere Python, pero se valora Excel.'])
  assert.deepEqual(result.skills, [])
})

test('source skill fields retain literal terms outside the dictionary without inferring qualifications', () => {
  const result = deriveOpportunityEvidence({ skills: ['FinOps', 'Licencia clase B', 'Node.js', 'no SQL', '<script>PRIVATE</script>', 'FinOps'] })
  assert.deepEqual(result.skills, ['FinOps', 'Licencia clase B', 'Node.js'])
  assert.deepEqual(result.requirements, [])
  assert.ok(result.evidence.every(item => item.origin === 'source_field' && item.excerpt === item.value))
})

test('technical names retain their source spelling and do not match inside unrelated words', () => {
  const result = deriveOpportunityEvidence({ requirements: ['Experiencia con C++, C#, .NET, Node.js y Next.js.', 'Conocimiento de NoSQL y colaboración.'] })
  assert.deepEqual(result.skills, ['C++', 'C#', '.NET', 'Node.js', 'Next.js'])
})

test('ordinary English words and verbs cannot manufacture similarly named software skills', () => {
  const result = deriveOpportunityEvidence({ requirements: [
    'You excel at resolving disputes.', 'Ability to react to changing requests.',
    'Clear use of the written word.', 'Availability for spring events.', 'Swift communication is expected.',
    'Experience with Microsoft Word and React.',
  ] })
  assert.deepEqual(result.skills, ['Word', 'React'])
})

test('requirements and skills are deduplicated with bounded arrays and without mutating input', () => {
  const input = { requirements: ['Excel avanzado.', 'excel avanzado.', ...Array.from({ length: 80 }, (_, index) => `Requisito ${index}`)], skills: ['SQL', 'sql'] }
  const copy = JSON.stringify(input)
  const result = deriveOpportunityEvidence(input)
  assert.equal(result.requirements.length, 49)
  assert.deepEqual(result.skills, ['Excel', 'SQL'])
  assert.equal(JSON.stringify(input), copy)
  assert.deepEqual(deriveOpportunityEvidence(input), result)
})

test('skill evidence prefers its complete qualification clause over an already-populated skill field', () => {
  const result = deriveOpportunityEvidence({ requirements: ['Tres años de experiencia con Python.'], skills: ['Python'] })
  const quote = result.evidence.find(item => item.field === 'skills')
  assert.deepEqual(quote, { field: 'skills', value: 'Python', excerpt: 'Tres años de experiencia con Python.', origin: 'source_field' })
})

test('only explicit current work modes produce mode evidence', () => {
  const cases = [
    ['Modalidad: remoto.', 'remote'], ['Modelo híbrido de trabajo.', 'hybrid'], ['Trabajo presencial.', 'onsite'],
    ['This role is fully remote.', 'remote'], ['This position will be on-site.', 'onsite'], ['This is a hybrid role.', 'hybrid'],
    ['Work arrangement: hybrid.', 'hybrid'], ['Fully remote.', 'remote'],
  ]
  for (const [description, expected] of cases) {
    const result = deriveOpportunityEvidence({ description })
    assert.equal(result.workMode, expected, description)
    assert.ok(result.evidence.some(item => item.field === 'workMode' && item.origin === 'description' && description.includes(item.excerpt)))
  }
})

test('cities, full-time schedules, past experience and remote boilerplate do not establish modality', () => {
  for (const description of [
    'Santiago, Chile. Jornada Full-time.', 'Experience working in a hybrid environment.',
    'If this role is remote, salary depends on location.', 'The role may be remote.',
    'Posibilidad de trabajo remoto después del período inicial.', 'Curso de trabajo remoto.',
    'We build hybrid cloud systems.',
    'We offer a remote training course.', 'This is a hybrid cloud project.',
    'Si el puesto es remoto, se entrega equipo.', 'En caso de modalidad remota, se entrega equipo.',
  ]) assert.equal(deriveOpportunityEvidence({ description }).workMode, null, description)
})

test('a canonical field and current contrary description cannot silently override each other', () => {
  for (const input of [
    { workMode: 'remote', description: 'Modalidad presencial.' },
    { workMode: 'remote', description: 'No hay teletrabajo.' },
    { workModeText: 'Remote - Chile', description: 'Ofrecemos modalidad híbrida de trabajo.' },
    { workMode: 'hybrid', description: 'No ofrecemos modalidad híbrida.' },
    { workMode: 'remote', description: 'This role isn’t remote.' },
    { workMode: 'remote', description: 'This role cannot be remote.' },
    { workMode: 'remote', description: 'You must work on-site.' },
    { workMode: 'remote', description: 'Ni remoto ni híbrido.' },
  ]) {
    const result = deriveOpportunityEvidence(input)
    assert.equal(result.workMode, null)
    assert.ok(!result.evidence.some(item => item.field === 'workMode'))
  }
})

test('questions and hypothetical role mentions do not become current work-mode assertions', () => {
  for (const description of ['Is this role remote?', 'This role is remote?', '¿Modalidad remota?', 'Imagine this role remote.']) {
    assert.equal(deriveOpportunityEvidence({ description }).workMode, null, description)
  }
})

test('two affirmative current modes are unknown even without a structured field', () => {
  const result = deriveOpportunityEvidence({ description: 'Trabajo remoto. Modalidad presencial.' })
  assert.equal(result.workMode, null)
  assert.deepEqual(result.evidence, [])
})

test('denying a different mode does not erase an explicit consistent mode', () => {
  for (const description of ['Modalidad presencial, sin teletrabajo.', 'Modalidad presencial. No hay teletrabajo.', 'Se descarta la modalidad híbrida. Modalidad presencial.']) {
    assert.equal(deriveOpportunityEvidence({ description }).workMode, 'onsite', description)
  }
  assert.equal(deriveOpportunityEvidence({ workMode: 'hybrid', description: 'If this role is remote, salary depends on location.' }).workMode, 'hybrid')
})

test('invalid structured modality fields do not become an onsite default', () => {
  for (const workMode of [null, undefined, 'FULL_TIME', true, false, {}, ['remote']]) assert.equal(deriveOpportunityEvidence({ workMode }).workMode, null)
  assert.equal(deriveOpportunityEvidence({ workModeText: 'on-site' }).workMode, 'onsite')
  assert.equal(deriveOpportunityEvidence({ workModeText: 'Santiago, Chile' }).workMode, null)
  assert.equal(deriveOpportunityEvidence({ workModeText: 'Remote - Onsite' }).workMode, null)
  assert.equal(deriveOpportunityEvidence({ workModeText: 'Remote or hybrid' }).workMode, null)
  assert.equal(deriveOpportunityEvidence({ workModeText: 'Remote - Chile' }).workMode, 'remote')
})

test('Lever lists retain requirement headings and exclude a separate benefits list', () => {
  const result = normalizeEmployerJob(board('lever:coderio'), lever({ lists: [
    { text: 'What you bring', content: '<ul><li>Experiencia con Excel y Power BI.</li><li>No se requiere Java.</li></ul>' },
    { text: 'Benefits', content: '<ul><li>Python training.</li></ul>' },
  ] }), at)
  assert.equal(result.kind, 'accepted')
  assert.deepEqual(result.job.requirements, ['Experiencia con Excel y Power BI.', 'No se requiere Java.'])
  assert.deepEqual(result.job.skills, ['Excel', 'Power BI'])
  assert.match(result.job.description, /What you bring:\n/)
  assert.equal(result.job.workMode, 'remote')
})

test('Lever passes the source list heading before cleaning embedded sections and additional fields', () => {
  const result = normalizeEmployerJob(board('lever:coderio'), lever({ lists: [
    { text: 'Requirements', content: '<ul><li>SQL experience.</li></ul><p><strong>Life at Example</strong></p><p>Weekly Python courses and AWS vouchers.</p>' },
    { text: '', content: '<p>Excel training.</p>' },
  ], additionalPlain: 'SAP courses are available.' }), at)
  assert.equal(result.kind, 'accepted')
  assert.deepEqual(result.job.requirements, ['SQL experience.'])
  assert.deepEqual(result.job.skills, ['SQL'])
  const after = deriveOpportunityEvidence(result.job)
  assert.deepEqual(after.requirements, result.job.requirements)
  assert.deepEqual(after.skills, result.job.skills)
})

test('a contradictory Lever workplaceType becomes unknown and never a false remote flag', () => {
  const result = normalizeEmployerJob(board('lever:coderio'), lever({ descriptionPlain: 'Revisar los registros del equipo. This role is on-site.' }), at)
  assert.equal(result.kind, 'accepted')
  assert.equal(result.job.workMode, null)
  assert.equal(result.job.remote, null)
})

test('Lever workplaceType retains its documented enum boundary before generic evidence parsing', () => {
  for (const workplaceType of ['remote access tooling', 'onsite', 'Remote', {}, ['hybrid']]) {
    const result = normalizeEmployerJob(board('lever:coderio'), lever({ workplaceType }), at)
    assert.equal(result.kind, 'accepted')
    assert.equal(result.job.workMode, null)
  }
  const result = normalizeEmployerJob(board('lever:coderio'), lever({ workplaceType: null, descriptionPlain: 'Revisar registros y mejorar procesos. This role is fully remote.' }), at)
  assert.equal(result.job.workMode, 'remote', 'an explicit current source sentence is independent evidence')
})

test('empty Coderio descriptions and salary-only text remain format rejections', () => {
  const result = normalizeEmployerJob(board('lever:coderio'), lever({
    descriptionPlain: '', description: '<p></p>', opening: '', openingPlain: '', descriptionBody: '', descriptionBodyPlain: '',
    additional: '', additionalPlain: '', salaryDescription: 'A remuneration statement is not a job description.',
    lists: [{ text: 'Requirements', content: '<ul></ul>' }],
  }), at)
  assert.deepEqual(result, { kind: 'rejected', reason: 'missing_description' })
})

test('oversized description text is rejected even if a shorter alternate field exists', () => {
  const result = normalizeEmployerJob(board('lever:coderio'), lever({ descriptionPlain: 'a'.repeat(40_001), openingPlain: 'A separate source introduction.' }), at)
  assert.deepEqual(result, { kind: 'rejected', reason: 'description_too_large' })
})

test('Chiletrabajos JobPosting extracts explicit source qualifications and skills without accepting objects', () => {
  const job = parseChileTrabajosJobHtml(ct('La persona revisará registros y coordinará mejoras de los procesos internos.', {
    qualifications: 'Experiencia con SAP y Excel.', experienceRequirements: { monthsOfExperience: 24 },
    educationRequirements: '<strong>Título técnico del área.</strong>', skills: 'Power BI, SQL',
  }), '7000001', ctUrl, new Date(at))
  assert.equal(job.verificationStatus, 'verified_active')
  assert.deepEqual(job.requirements, ['Experiencia con SAP y Excel.', 'Título técnico del área.'])
  assert.deepEqual(job.skills, ['SAP', 'Excel', 'Power BI', 'SQL'])
  assert.ok(!JSON.stringify(job).includes('[object Object]'))
})

test('Chiletrabajos never loses the negation scope by splitting a comma-separated skill field', () => {
  for (const skills of ['No se requiere SQL, Python o Java.', 'Sin conocimientos de SQL, Python y Java.', 'Neither SQL, Python nor Java is required.']) {
    const job = parseChileTrabajosJobHtml(ct('La persona revisará registros y coordinará mejoras de los procesos internos.', { skills }), '7000001', ctUrl, new Date(at))
    assert.equal(job.verificationStatus, 'verified_active')
    assert.deepEqual(job.skills, [], skills)
  }
  assert.deepEqual(deriveOpportunityEvidence({ skills: ['SQL, Python; Java'] }).skills, ['SQL', 'Python', 'Java'])
})

test('Chiletrabajos description sections survive sanitizing and stop before benefits', () => {
  const job = parseChileTrabajosJobHtml(ct('<p>Revisar registros y coordinar mejoras con el equipo de operaciones.</p><h3>Requisitos</h3><ul><li>Excel avanzado.</li><li>Comunicación escrita.</li></ul><h3>Beneficios</h3><p>Curso de Python.</p>'), '7000001', ctUrl, new Date(at))
  assert.deepEqual(job.requirements, ['Excel avanzado.', 'Comunicación escrita.'])
  assert.deepEqual(job.skills, ['Excel', 'Comunicación escrita'])
  assert.match(job.description, /Requisitos:\n/)
})

test('Chiletrabajos modality remains unknown when TELECOMMUTE contradicts the visible role description', () => {
  const job = parseChileTrabajosJobHtml(ct('<p>Revisar registros y coordinar mejoras con el equipo. Modalidad presencial.</p>', { jobLocationType: 'TELECOMMUTE' }), '7000001', ctUrl, new Date(at))
  assert.equal(job.verificationStatus, 'verified_active')
  assert.equal(job.workMode, null)
})

test('Chiletrabajos does not extract related or hidden role requirements', () => {
  const html = ct('<p>Revisar registros y coordinar mejoras con el equipo.</p><div hidden><h3>Requisitos</h3><p>SQL.</p></div>')
    .replace('</body>', '<section class="related"><h3>Requisitos</h3><p>Python.</p></section></body>')
  const job = parseChileTrabajosJobHtml(html, '7000001', ctUrl, new Date(at))
  assert.deepEqual(job.requirements, [])
  assert.deepEqual(job.skills, [])
  assert.ok(!job.description.includes('SQL'))
})
