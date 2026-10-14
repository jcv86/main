import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as jsxRuntime from 'react/jsx-runtime'
import { JsxEmit, ModuleKind, ScriptTarget, transpileModule } from 'typescript'

// Actual page and wrapper functions; navigation is synthetic. No browser, Auth or database.
// This supplements, rather than replaces, the shared form's confirmation/error tests.
const scenarios = [
  ['a1', 'baseline', 'a1-professional-clarity-form', 'A1ProfessionalClarityForm', 'a1_professional_clarity', '/despega/a1-cerebral-intro', 'Continuar al análisis de A1'],
  ['a1', 'follow-up', 'a1-professional-clarity-form', 'A1ProfessionalClarityForm', 'a1_professional_clarity', '/despega/a2/intro', 'Continuar a Tu Ruta'],
  ['a2', 'baseline', 'a2-execution-outcome-form', 'A2ExecutionOutcomeForm', 'a2_execution_checkpoint', '/despega/a2', 'Volver a Tu Ruta'],
  ['a2', 'follow-up', 'a2-execution-outcome-form', 'A2ExecutionOutcomeForm', 'a2_execution_checkpoint', '/despega/a2', 'Volver a Tu Ruta'],
  ['a3', 'baseline', 'a3-interview-outcome-form', 'A3InterviewOutcomeForm', 'a3_structured_interview', '/despega/a3?outcomeBaseline=done', 'Volver a Entrenamiento'],
  ['a3', 'follow-up', 'a3-interview-outcome-form', 'A3InterviewOutcomeForm', 'a3_structured_interview', '/despega/a3', 'Volver a Entrenamiento'],
] as const

type Element = { type: unknown; props: Record<string, unknown> }
function elements(value: unknown): Element[] {
  if (Array.isArray(value)) return value.flatMap(elements)
  if (!value || typeof value !== 'object' || !('props' in value)) return []
  const element = value as Element
  return [element, ...elements(element.props.children)]
}
function load(path: string, dependencies: Record<string, unknown>): Record<string, unknown> {
  const source = readFileSync(path, 'utf8')
  const compiled = transpileModule(source, {
    fileName: path,
    compilerOptions: { module: ModuleKind.CommonJS, target: ScriptTarget.ES2022, jsx: JsxEmit.ReactJSX },
  }).outputText
  const module = { exports: {} as Record<string, unknown> }
  const requireAllowed = (key: string) => {
    if (key === 'react/jsx-runtime') return jsxRuntime
    assert.ok(Object.hasOwn(dependencies, key), `unexpected dependency in ${path}: ${key}`)
    return dependencies[key]
  }
  new Function('require', 'module', 'exports', compiled)(requireAllowed, module, module.exports)
  return module.exports
}

for (const [stage, phase, wrapperFile, wrapperExport, instrument, destination, label] of scenarios) {
  const pagePath = `app/despega/${stage}-outcome-${phase}/page.tsx`
  const source = readFileSync(pagePath, 'utf8')
  assert.doesNotMatch(source, /setTimeout|setInterval/, `${pagePath}: continuation must not be delayed`)
  assert.doesNotMatch(source, /useState|Guarda la medición/, `${pagePath}: no second confirmation gate`)
  const calls: string[] = []
  const SharedForm = () => null
  const Button = () => null
  const Container = () => null
  const wrapperModule = load(`components/outcomes/${wrapperFile}.tsx`, {
    './outcome-response-capture-form': { OutcomeResponseCaptureForm: SharedForm },
  })
  const wrapper = wrapperModule[wrapperExport]
  assert.equal(typeof wrapper, 'function')
  const pageModule = load(pagePath, {
    'next/navigation': { useRouter: () => ({ push: (path: string) => { calls.push(path) } }) },
    '@/components/layout/page-foundation': { PageContainer: Container, PageStack: Container },
    '@/components/ui/button': { Button },
    [`@/components/outcomes/${wrapperFile}`]: wrapperModule,
  })
  assert.equal(typeof pageModule.default, 'function')
  const tree = (pageModule.default as () => unknown)()
  const nodes = elements(tree)
  const forms = nodes.filter(node => node.type === wrapper)
  assert.equal(forms.length, 1, `${pagePath}: exactly one form`)
  assert.equal(nodes.filter(node => node.type === Button || node.type === 'button').length, 0,
    `${pagePath}: do not add another continuation button outside the form`)
  assert.deepEqual(calls, [], `${pagePath}: rendering must never navigate`)
  const props = forms[0].props
  assert.equal(props.role, phase === 'baseline' ? 'baseline' : 'follow_up')
  assert.equal(props.continueLabel, label)
  assert.equal(typeof props.onSaved, 'function')
  const shared = (wrapper as (props: Record<string, unknown>) => Element)(props)
  assert.equal(shared.type, SharedForm)
  assert.equal(shared.props.instrumentKey, instrument)
  assert.equal(shared.props.continueLabel, label, 'the real stage wrapper must preserve the destination label')
  assert.equal(shared.props.onSaved, props.onSaved, 'the real wrapper must preserve explicit continuation')
  assert.deepEqual(calls, [], 'creating the wrapper must not navigate')
  ;(shared.props.onSaved as () => void)()
  assert.deepEqual(calls, [destination], `${pagePath}: one explicit action reaches the canonical destination immediately`)
}

const formSource = readFileSync('components/outcomes/outcome-response-capture-form.tsx', 'utf8')
assert.match(formSource, /continueLabel = 'Continuar mi recorrido'/, 'existing consumers retain the default label')
assert.match(formSource, /onClick=\{onSaved\}>\{continueLabel\}/, 'continuation must display its destination label')
assert.match(formSource, /\{saved \? <div/, 'continuation remains in the confirmed-save branch')
assert.doesNotMatch(formSource.slice(formSource.indexOf('async function save()'), formSource.indexOf('return <section')), /onSaved\s*\(/,
  'a successful network response must not trigger navigation on its own')
console.log(JSON.stringify({ suite: 'outcome-page-continuity', pages: scenarios.length,
  pageAndWrapperFunctions: 'real', navigation: 'synthetic', secondContinueButton: false,
  artificialNavigationDelay: false, automaticNavigationOnSave: false,
  liveDatabaseWrites: 0, fullAuthenticatedShell: false }))
