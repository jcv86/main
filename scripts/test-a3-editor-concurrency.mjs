import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import * as cv from '../lib/a3/cv-builder.ts'
import * as catalog from '../lib/a3/module-catalog.ts'
import * as validation from '../lib/a3/module-validation.ts'
import * as activeModule from '../lib/a3/active-module.ts'
import * as answers from '../lib/a3/answer-architecture.ts'
import * as answerValidation from '../lib/a3/answer-architecture-validation.ts'
import { groundPracticeFeedback } from '../lib/a3/practice-feedback.ts'
import * as coachDraft from '../lib/a3/coach-session-draft.ts'
import { completeA3Module } from '../lib/a3/client-completion.ts'

// Executes the real hooks/components with a deterministic render scheduler.
// No browser session, production account, database or model call is used.
const OWNER = 'synthetic-editor-owner'
const jsx = (type, props = {}, key) => ({ type, props, key })
const nodes = value => !value || typeof value !== 'object' ? [] : Array.isArray(value)
  ? value.flatMap(nodes) : [value, ...nodes(value.props?.children)]
const text = value => value == null || typeof value === 'boolean' ? '' : Array.isArray(value)
  ? value.map(text).join('') : typeof value === 'object' ? text(value.props?.children) : String(value)
const button = (tree, label) => { const found = nodes(tree).find(node => node.type === 'Button' && text(node).includes(label)); assert.ok(found, 'Missing button: ' + label); return found }
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b }); return { promise, resolve, reject } }
const response = (body, status = 200) => new Response(JSON.stringify(body), { status })
const storage = () => { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) } }
const key = moduleId => `dtc:a3:${OWNER}:module:${moduleId}:draft`
const validCv = { ...cv.EMPTY_CV_BUILDER_STATE, fullName: 'Persona sintética', email: 'persona@example.invalid', targetRole: 'Analista', professionalSummary: 'Practiqué análisis en un curso.', evidenceKind: 'education', education: 'Curso local, 2026', skills: 'Planillas', atsChecklist: [...cv.CV_BUILDER_CRITICAL_ATS_IDS], factsConfirmed: true }
const cases = []
const test = (name, run) => cases.push({ name, run })

function compile(path, ports) {
  const module = { exports: {} }
  const output = ts.transpileModule(readFileSync(path, 'utf8'), { fileName: path,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  new Function('require', 'module', 'exports', output)(name => {
    assert.ok(Object.hasOwn(ports, name), 'Unexpected import: ' + name)
    return ports[name]
  }, module, module.exports)
  return module.exports
}

function renderer(path, exported, initialProps = {}, options = {}) {
  let cursor = 0, pending = [], dirty = true, tree, props = initialProps
  const state = [], effects = []
  const react = {
    useState(initial) { const index = cursor++; if (!Object.hasOwn(state, index)) state[index] = typeof initial === 'function' ? initial() : initial; return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; dirty = true }] },
    useRef(initial) { const index = cursor++; if (!Object.hasOwn(state, index)) state[index] = { current: initial }; return state[index] },
    useMemo(run) { return run() }, useCallback: run => run,
    useEffect(run, deps) { const index = cursor++; const old = effects[index]; if (!old || !deps || deps.some((value, i) => !Object.is(value, old.deps[i]))) pending.push(() => { old?.cleanup?.(); effects[index] = { deps, cleanup: run() } }) },
  }
  const auth = options.auth ?? { userId: OWNER, listeners: new Set() }
  const drafts = compile('lib/a3/draft-storage.ts', { react, '@/lib/supabase/client': { createClient: () => ({ auth: {
    getUser: async () => ({ data: { user: auth.userId ? { id: auth.userId } : null } }),
    onAuthStateChange(callback) { auth.listeners.add(callback); return { data: { subscription: { unsubscribe() { auth.listeners.delete(callback) } } } } },
  } }) } })
  const ports = {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    'next/link': { __esModule: true, default: 'Link' }, 'next/navigation': { useRouter: () => ({ push() {} }) },
    'lucide-react': new Proxy({}, { get: (_target, name) => name }),
    '@/components/ui/button': { Button: 'Button' }, '@/components/ui/card': { Card: 'Card' }, '@/components/ui/badge': { Badge: 'Badge' }, '@/components/ui/progress': { Progress: 'Progress' },
    '@/components/a3/evidence-feedback': { EvidenceFeedback: 'EvidenceFeedback' }, '@/components/camera-microphone-test': { CameraMicrophoneTest: 'CameraMicrophoneTest' },
    '@/lib/a3/draft-storage': drafts, '@/lib/a3/cv-builder': cv, '@/lib/a3/module-catalog': catalog, '@/lib/a3/module-validation': validation,
    '@/lib/a3/active-module': activeModule, '@/lib/a3/answer-architecture': answers, '@/lib/a3/answer-architecture-validation': answerValidation,
    '@/lib/a3/coach-session-draft': coachDraft,
    '@/lib/a3/client-completion': { completeA3Module: options.complete ?? (async () => { throw new Error('Unexpected completion') }) },
    '@/lib/hooks/use-speech-recognition': { useSpeechRecognition: () => options.speech },
  }
  const Component = compile(path, ports)[exported]
  function render() { let count = 0; do { dirty = false; cursor = 0; tree = Component(props); const tasks = pending; pending = []; tasks.forEach(run => run()); assert.ok(++count < 30, 'Render loop') } while (dirty); return tree }
  return {
    get tree() { return render() }, setProps(value) { props = value; dirty = true; return render() }, drafts,
    async flush() { for (let i = 0; i < 5; i++) { await new Promise(resolve => setImmediate(resolve)); render() } return tree },
    unmount() { effects.forEach(effect => effect?.cleanup?.()) },
  }
}

const CV = 'components/a3/cv-builder-studio.tsx'
const FEEDBACK = 'components/a3/evidence-feedback.tsx'

test('CV blocks editing and restoration during a save and preserves a newer stored draft', async () => {
  window.localStorage.setItem(key('cv-builder-studio'), JSON.stringify(validCv))
  globalThis.fetch = async () => response({ savedCv: { ...validCv, targetRole: 'Versión anterior' } })
  const pending = deferred(), calls = []
  const ui = renderer(CV, 'CvBuilderStudio', {}, { complete: input => { calls.push(input); return pending.promise } }); await ui.flush()
  const submit = button(ui.tree, 'Completar módulo')
  submit.props.onClick(); submit.props.onClick()
  assert.equal(calls.length, 1, 'A repeated click cannot create a second save')
  assert.equal(nodes(ui.tree).find(node => node.type === 'fieldset').props.disabled, true)
  nodes(ui.tree).find(node => node.type === 'input' && node.props.value === validCv.fullName).props.onChange({ target: { value: 'Edición tardía' } })
  button(ui.tree, 'Cargar el CV guardado').props.onClick()
  assert.ok(nodes(ui.tree).some(node => node.type === 'input' && node.props.value === validCv.fullName))
  assert.ok(nodes(ui.tree).some(node => node.type === 'input' && node.props.value === validCv.targetRole))
  const newer = { ...validCv, professionalSummary: 'Borrador nuevo conservado por otra edición.', factsConfirmed: false }
  window.localStorage.setItem(key('cv-builder-studio'), JSON.stringify(newer))
  pending.resolve({ success: true, moduleId: 'cv-builder-studio', moduleNumber: 3 }); await ui.flush()
  assert.deepEqual(JSON.parse(window.localStorage.getItem(key('cv-builder-studio'))), newer)
  assert.match(text(ui.tree), /Módulo registrado/)
  ui.unmount()
})
test('a delayed saved-CV read cannot replace a newly acknowledged version', async () => {
  window.localStorage.setItem(key('cv-builder-studio'), JSON.stringify(validCv))
  const read = deferred(); globalThis.fetch = () => read.promise
  const ui = renderer(CV, 'CvBuilderStudio', {}, { complete: async () => ({ success: true }) }); await ui.flush()
  button(ui.tree, 'Completar módulo').props.onClick(); await ui.flush()
  read.resolve(response({ savedCv: { ...validCv, targetRole: 'CV anterior' } })); await ui.flush()
  button(ui.tree, 'Cargar el CV guardado').props.onClick()
  assert.ok(nodes(ui.tree).some(node => node.type === 'input' && node.props.value === 'Analista'))
  assert.ok(!nodes(ui.tree).some(node => node.type === 'input' && node.props.value === 'CV anterior'))
  ui.unmount()
})
test('failed CV save keeps the draft and reopens editing without a success notice', async () => {
  window.localStorage.setItem(key('cv-builder-studio'), JSON.stringify(validCv))
  globalThis.fetch = async () => response({ savedCv: null })
  const ui = renderer(CV, 'CvBuilderStudio', {}, { complete: async () => { throw new Error('Fallo sintético') } }); await ui.flush()
  button(ui.tree, 'Completar módulo').props.onClick(); await ui.flush()
  assert.equal(nodes(ui.tree).find(node => node.type === 'fieldset').props.disabled, false)
  assert.deepEqual(JSON.parse(window.localStorage.getItem(key('cv-builder-studio'))), validCv)
  assert.match(text(ui.tree), /Fallo sintético/); assert.doesNotMatch(text(ui.tree), /Módulo registrado/)
  ui.unmount()
})
test('HTTP success alone cannot acknowledge another module or an incomplete save', async () => {
  const input = { moduleId: 'cv-builder-studio', moduleNumber: 3, responses: [], deliverable: {} }
  for (const body of [{}, null, { success: true }, { success: true, moduleId: 'answer-architecture', moduleNumber: 5 }]) {
    globalThis.fetch = async () => response(body)
    await assert.rejects(completeA3Module(input), /No pudimos confirmar/)
  }
  globalThis.fetch = async () => response({ success: true, moduleId: input.moduleId, moduleNumber: input.moduleNumber })
  assert.equal((await completeA3Module(input)).success, true)
})
test('switching account cannot attach a pending CV save or read to the new editor', async () => {
  const auth = { userId: OWNER, listeners: new Set() }, pending = deferred(), oldRead = deferred()
  window.localStorage.setItem(key('cv-builder-studio'), JSON.stringify(validCv))
  globalThis.fetch = () => auth.userId === OWNER ? oldRead.promise : Promise.resolve(response({ savedCv: null }))
  const ui = renderer(CV, 'CvBuilderStudio', {}, { auth, complete: () => pending.promise }); await ui.flush()
  button(ui.tree, 'Completar módulo').props.onClick()
  auth.userId = 'synthetic-other-owner'
  for (const listener of auth.listeners) listener('SIGNED_IN', { user: { id: auth.userId } })
  await ui.flush()
  oldRead.resolve(response({ savedCv: validCv })); pending.resolve({ success: true }); await ui.flush()
  assert.ok(!nodes(ui.tree).some(node => node.type === 'input' && node.props.value === validCv.fullName))
  assert.doesNotMatch(text(ui.tree), /Módulo registrado|Tienes un CV guardado/)
  assert.deepEqual(JSON.parse(window.localStorage.getItem(key('cv-builder-studio'))), validCv)
  const other = JSON.parse(window.localStorage.getItem(`dtc:a3:${auth.userId}:module:cv-builder-studio:draft`))
  assert.equal(other.fullName, ''); assert.equal(other.targetRole, '')
  ui.unmount()
})
test('answer editor freezes the submitted snapshot and never removes a newer draft', async () => {
  const draft = { ...answers.EMPTY_ANSWER_ARCHITECTURE_DRAFT, selfIntroduction: 'Mi intento', motivation: 'Mi interés', strengthEvidence: 'Mi ejemplo', challengeStar: 'Mi desafío', whyHire: 'Mi contribución', timing30: 'Corto', timing45: 'Medio', timing60: 'Largo', factsConfirmed: 'true', structureReviewed: 'true', contextReviewed: 'true' }
  window.localStorage.setItem(key('answer-architecture'), JSON.stringify(draft))
  globalThis.fetch = async () => response({ context: null })
  const pending = deferred()
  const ui = renderer('components/a3/answer-architecture-studio.tsx', 'AnswerArchitectureStudio', {}, { complete: () => pending.promise }); await ui.flush()
  const save = button(ui.tree, 'Completar Arquitectura'); const saving = save.props.onClick()
  assert.equal(nodes(ui.tree).find(node => node.type === 'fieldset').props.disabled, true)
  nodes(ui.tree).find(node => node.props?.label === 'Historia de desafío STAR').props.onChange('Texto nuevo no enviado')
  assert.equal(nodes(ui.tree).find(node => node.props?.label === 'Historia de desafío STAR').props.value, draft.challengeStar)
  const feedback = nodes(ui.tree).find(node => node.type === 'EvidenceFeedback')
  assert.equal(feedback.props.disabled, true)
  const newer = { ...draft, challengeStar: 'Borrador más reciente' }; window.localStorage.setItem(key('answer-architecture'), JSON.stringify(newer))
  pending.resolve({ success: true }); await saving; await ui.flush()
  assert.deepEqual(JSON.parse(window.localStorage.getItem(key('answer-architecture'))), newer)
  ui.unmount()
})
test('answer editor remounts its feedback and clears context when the owner changes', async () => {
  const auth = { userId: OWNER, listeners: new Set() }
  const draft = { ...answers.EMPTY_ANSWER_ARCHITECTURE_DRAFT, challengeStar: 'Ejemplo privado de la cuenta anterior.' }
  window.localStorage.setItem(key('answer-architecture'), JSON.stringify(draft))
  globalThis.fetch = async () => response({ context: null })
  const ui = renderer('components/a3/answer-architecture-studio.tsx', 'AnswerArchitectureStudio', {}, { auth }); await ui.flush()
  const before = nodes(ui.tree).find(node => node.type === 'EvidenceFeedback')
  assert.equal(before.props.answer, draft.challengeStar); assert.equal(before.key, OWNER)
  auth.userId = 'synthetic-other-owner'
  for (const listener of auth.listeners) listener('SIGNED_IN', { user: { id: auth.userId } })
  await ui.flush()
  const after = nodes(ui.tree).find(node => node.type === 'EvidenceFeedback')
  assert.equal(after.props.answer, ''); assert.equal(after.key, auth.userId)
  assert.notEqual(before.key, after.key, 'React must discard feedback state from the previous owner')
  ui.unmount()
})
test('a stale second attempt cannot overwrite a newer answer', async () => {
  const first = 'Organicé las tareas del curso.', feedback = groundPracticeFeedback({ criterion: 'clarity', quote: first }, first)
  globalThis.fetch = async () => response({ feedback })
  const applied = [], records = [], props = { question: '¿Qué hiciste?', answer: first, onApplyAttempt: value => applied.push(value), onRecordReview: value => records.push(value) }
  const ui = renderer(FEEDBACK, 'EvidenceFeedback', props)
  button(ui.tree, 'Obtener una observación').props.onClick(); await ui.flush()
  button(ui.tree, 'Hacer un segundo intento').props.onClick()
  nodes(ui.tree).find(node => node.type === 'textarea').props.onChange({ target: { value: 'Organicé una lista de tareas del curso.' } })
  const oldAction = button(ui.tree, 'Conservar ambos')
  ui.setProps({ ...props, answer: 'Nuevo texto que decidí mantener.' })
  assert.equal(button(ui.tree, 'Conservar ambos').props.disabled, true)
  oldAction.props.onClick()
  assert.equal(applied.length, 0); assert.equal(records.length, 0)
  assert.match(text(ui.tree), /Conservamos tu nuevo texto/)
  ui.unmount()
})
test('a current cited observation still records and applies the explicit second attempt', async () => {
  const first = 'Organicé las tareas del curso.', second = 'Organicé una lista de tareas del curso.'
  globalThis.fetch = async () => response({ feedback: groundPracticeFeedback({ criterion: 'clarity', quote: first }, first) })
  const applied = [], records = []
  const ui = renderer(FEEDBACK, 'EvidenceFeedback', { question: '¿Qué hiciste?', answer: first, onApplyAttempt: value => applied.push(value), onRecordReview: value => records.push(value) })
  button(ui.tree, 'Obtener una observación').props.onClick(); await ui.flush()
  button(ui.tree, 'Hacer un segundo intento').props.onClick()
  nodes(ui.tree).find(node => node.type === 'textarea').props.onChange({ target: { value: second } })
  button(ui.tree, 'Conservar ambos').props.onClick()
  assert.deepEqual(applied, [second]); assert.equal(records[0].firstAttempt, first); assert.equal(records[0].secondAttempt, second); assert.equal(records[0].feedback.quote, first)
  ui.unmount()
})
test('late feedback for an earlier question is rejected and a frozen editor sends no request', async () => {
  const first = 'Organicé las tareas del curso.', pending = deferred(); let calls = 0
  globalThis.fetch = () => { calls++; return pending.promise }
  const props = { question: '¿Qué hiciste?', answer: first, onApplyAttempt() {} }
  const ui = renderer(FEEDBACK, 'EvidenceFeedback', props)
  button(ui.tree, 'Obtener una observación').props.onClick()
  ui.setProps({ ...props, question: '¿Qué aprendiste?' })
  pending.resolve(response({ feedback: groundPracticeFeedback({ criterion: 'clarity', quote: first }, first) })); await ui.flush()
  assert.ok(!nodes(ui.tree).some(node => node.type === 'blockquote'))
  ui.setProps({ ...props, disabled: true })
  button(ui.tree, 'Obtener una observación').props.onClick(); await ui.flush()
  assert.equal(calls, 1)
  ui.unmount()
})
test('coach completion freezes text, feedback and late microphone transcripts', async () => {
  const pending = deferred(), calls = []; let stopped = 0
  const speech = { isListening: true, isSupported: true, transcript: '', isFinal: false, startListening() {}, stopListening() { stopped++ }, resetTranscript() {} }
  const ui = renderer('components/a3/verified-coach-session.tsx', 'VerifiedCoachSession', { moduleId: 'career-mirror', moduleNumber: 1, title: 'Prueba', questions: [{ id: 'one', question: '¿Qué hiciste?', guidance: 'Cuenta un hecho.' }], buildDeliverable: responses => ({ evidence: responses[0] }) }, { speech, complete: input => { calls.push(input); return pending.promise } })
  await ui.flush()
  nodes(ui.tree).find(node => node.type === 'CameraMicrophoneTest').props.onTestComplete(true)
  nodes(ui.tree).find(node => node.type === 'textarea').props.onChange({ target: { value: 'Mi respuesta original.' } })
  nodes(ui.tree).find(node => node.type === 'input').props.onChange({ target: { checked: true } })
  button(ui.tree, 'Guardar y completar').props.onClick()
  assert.equal(nodes(ui.tree).find(node => node.type === 'fieldset').props.disabled, true)
  assert.equal(nodes(ui.tree).find(node => node.type === 'EvidenceFeedback').props.disabled, true)
  nodes(ui.tree).find(node => node.type === 'textarea').props.onChange({ target: { value: 'Edición tardía' } })
  speech.transcript = 'Transcripción tardía'; speech.isFinal = true; await ui.flush()
  assert.equal(nodes(ui.tree).find(node => node.type === 'textarea').props.value, 'Mi respuesta original.')
  assert.equal(stopped, 1); assert.deepEqual(calls[0].responses, ['Mi respuesta original.'])
  pending.resolve({ success: true }); await ui.flush(); ui.unmount()
})
test('coach responses, cited feedback and both attempts survive a reload without creating a completion', async () => {
  const props = { moduleId: 'career-mirror', moduleNumber: 1, title: 'Prueba', questions: [{ id: 'one', question: '¿Qué hiciste?', guidance: 'Cuenta un hecho.' }, { id: 'two', question: '¿Qué aprendiste?', guidance: 'Describe lo aprendido.' }], buildDeliverable: responses => ({ evidence: responses.join('\n') }) }
  const speech = { isListening: false, isSupported: false, transcript: '', isFinal: false, startListening() {}, stopListening() {}, resetTranscript() {} }
  let writes = 0
  const options = { speech, complete: async () => { writes++; return { success: true } } }
  const first = 'Organicé las tareas del curso.', second = 'Organicé una lista de tareas del curso.'
  const ui = renderer('components/a3/verified-coach-session.tsx', 'VerifiedCoachSession', props, options); await ui.flush()
  nodes(ui.tree).find(node => node.type === 'CameraMicrophoneTest').props.onTestComplete(false)
  nodes(ui.tree).find(node => node.type === 'textarea').props.onChange({ target: { value: first } })
  const review = { question: props.questions[0].question, firstAttempt: first, secondAttempt: second, feedback: groundPracticeFeedback({ criterion: 'clarity', quote: first }, first), recordedAt: '2026-11-02T12:00:00Z' }
  let feedback = nodes(ui.tree).find(node => node.type === 'EvidenceFeedback')
  feedback.props.onRecordReview(review); feedback.props.onApplyAttempt(second)
  nodes(ui.tree).find(node => node.type === 'input').props.onChange({ target: { checked: true } })
  button(ui.tree, 'Siguiente pregunta').props.onClick()
  nodes(ui.tree).find(node => node.type === 'textarea').props.onChange({ target: { value: 'Aprendí a separar tareas.' } })
  await ui.flush(); ui.unmount()
  const stored = JSON.parse(window.localStorage.getItem(key('career-mirror')))
  assert.deepEqual(stored.responses, [second]); assert.equal(stored.currentQuestion, 1)
  assert.deepEqual(stored.practiceReviews, [review]); assert.equal(Object.hasOwn(stored, 'completed'), false)
  const restored = renderer('components/a3/verified-coach-session.tsx', 'VerifiedCoachSession', props, options); await restored.flush()
  assert.equal(nodes(restored.tree).find(node => node.type === 'textarea').props.value, 'Aprendí a separar tareas.')
  assert.match(text(restored.tree), /Pregunta 2 de 2/)
  assert.match(text(restored.tree), /Intentos y observaciones conservados/)
  assert.ok(text(restored.tree).includes(first)); assert.ok(text(restored.tree).includes(second))
  assert.equal(nodes(restored.tree).find(node => node.type === 'input').props.checked, false)
  assert.equal(writes, 0); restored.unmount()
})
test('changing account clears the visible coach draft and rejects an old save acknowledgement', async () => {
  const auth = { userId: OWNER, listeners: new Set() }, pending = deferred()
  const props = { moduleId: 'career-mirror', moduleNumber: 1, title: 'Prueba', questions: [{ id: 'one', question: '¿Qué hiciste?', guidance: 'Cuenta un hecho.' }], buildDeliverable: responses => ({ evidence: responses[0] }) }
  const speech = { isListening: false, isSupported: false, transcript: '', isFinal: false, startListening() {}, stopListening() {}, resetTranscript() {} }
  const ui = renderer('components/a3/verified-coach-session.tsx', 'VerifiedCoachSession', props, { auth, speech, complete: () => pending.promise }); await ui.flush()
  nodes(ui.tree).find(node => node.type === 'CameraMicrophoneTest').props.onTestComplete(false)
  nodes(ui.tree).find(node => node.type === 'textarea').props.onChange({ target: { value: 'Texto privado de la primera cuenta.' } })
  nodes(ui.tree).find(node => node.type === 'input').props.onChange({ target: { checked: true } })
  button(ui.tree, 'Guardar y completar').props.onClick()
  auth.userId = 'synthetic-other-owner'
  auth.listeners.forEach(callback => callback('SIGNED_IN', { user: { id: auth.userId } }))
  await ui.flush()
  speech.transcript = 'Voz tardía de la cuenta anterior'; speech.isFinal = true; await ui.flush()
  pending.resolve({ success: true, xpAwarded: 100 }); await ui.flush()
  assert.doesNotMatch(text(ui.tree), /Texto privado|Entrenamiento registrado/)
  assert.ok(nodes(ui.tree).some(node => node.type === 'CameraMicrophoneTest'))
  const own = JSON.parse(window.localStorage.getItem(`dtc:a3:${auth.userId}:module:career-mirror:draft`))
  assert.equal(own.answer, ''); assert.deepEqual(own.responses, []); assert.deepEqual(own.practiceReviews, [])
  assert.ok(window.localStorage.getItem(key('career-mirror')).includes('Texto privado'))
  ui.unmount()
})
test('restored coach history must match the module/questions and contain a quote from its own first attempt', () => {
  const questions = [{ id: 'one', question: '¿Qué hiciste?' }]
  const first = 'Organicé las tareas.', feedback = groundPracticeFeedback({ criterion: 'clarity', quote: first }, first)
  const valid = { version: 1, moduleId: 'career-mirror', questionIds: ['one'], started: true, currentQuestion: 0, answer: 'Mi revisión.', responses: [], practiceReviews: [{ question: questions[0].question, firstAttempt: first, secondAttempt: 'Organicé una lista de tareas.', feedback, recordedAt: '2026-11-02T12:00:00Z' }] }
  assert.ok(coachDraft.parseCoachSessionDraft(valid, 'career-mirror', questions))
  for (const change of [{ moduleId: 'value-mining-lab' }, { questionIds: ['different'] }, { currentQuestion: 3 }, { responses: ['wrong index'] }, { completed: true }, { score: 100 }, { practiceReviews: [{ ...valid.practiceReviews[0], feedback: { ...feedback, quote: 'Aumenté ventas 50%.' } }] }]) assert.equal(coachDraft.parseCoachSessionDraft({ ...valid, ...change }, 'career-mirror', questions), null)
})

const originalWindow = globalThis.window, originalFetch = globalThis.fetch, originalError = console.error
let passed = 0
try {
  for (const { name, run } of cases) {
    globalThis.window = { localStorage: storage(), setInterval, clearInterval }
    globalThis.fetch = async () => { throw new Error('External network forbidden') }
    console.error = () => {} // Expected failure fixtures must not print synthetic stack noise.
    try { await run(); passed++; console.log('PASS ' + name) }
    catch (error) { console.error = originalError; console.error('FAIL ' + name); throw error }
  }
} finally { globalThis.window = originalWindow; globalThis.fetch = originalFetch; console.error = originalError }
console.log(JSON.stringify({ suite: 'a3-editor-concurrency', passed, total: cases.length, browser: false, databaseWrites: 0, providerCalls: 0 }))
