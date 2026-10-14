// Actual component bodies/events with a deterministic hook harness and synthetic fetch.
// This is behavioral coverage, not browser rendering or an accessibility certification.
const assert = require('node:assert/strict'), fs = require('node:fs'), ts = require('typescript')
const capture = require('../lib/outcomes/response-capture.ts'), history = require('../lib/outcomes/response-history.ts')
const cases = [], test = (name, run) => cases.push({ name, run })
const KEY = 'a1_professional_clarity'
const TEXT = 'Esta respuesta sintética explica mi trabajo y aporta un ejemplo de resultado concreto.'
const FORM = 'components/outcomes/outcome-response-capture-form.tsx'
const HISTORY = 'components/outcomes/outcome-capture-history.tsx'
const jsx = (type, props) => ({ type, props: props ?? {} })
function nodes(value) {
  if (Array.isArray(value)) return value.flatMap(nodes)
  return value && typeof value === 'object' ? [value, ...nodes(value.props?.children)] : []
}
function text(value) {
  if (Array.isArray(value)) return value.map(text).join(' ').replace(/\s+/g, ' ').trim()
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value?.props ? text(value.props.children) : ''
}
function button(tree, label) { const result = nodes(tree).find(node => ['button','Button'].includes(node.type) && text(node) === label); assert.ok(result, label); return result }
function renderer(path, name, initialProps) {
  const state = [], effects = []; let cursor = 0, pending = [], dirty = true, tree, props = initialProps, active = true
  const react = {
    useState(initial) { const index = cursor++; if (!Object.hasOwn(state,index)) state[index] = typeof initial === 'function' ? initial() : initial; return [state[index], value => { if (!active) throw Error('State update after unmount'); state[index] = typeof value === 'function' ? value(state[index]) : value; dirty = true }] },
    useRef(initial) { const index = cursor++; if (!Object.hasOwn(state,index)) state[index] = { current: initial }; return state[index] },
    useId() { const index = cursor++; return 'test-' + index },
    useEffect(run, deps) { const index = cursor++; const previous = effects[index]; if (!previous || deps.some((value,i) => !Object.is(value,previous.deps[i]))) pending.push(() => { previous?.cleanup?.(); effects[index] = { deps, cleanup: run() } }) },
  }
  const dependencies = { react, 'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    '@/components/ui/button': { Button: 'Button' }, '@/components/ui/textarea': { Textarea: 'Textarea' },
    '@/lib/outcomes/response-capture': capture, '@/lib/outcomes/response-history': history,
    './outcome-capture-history': { OutcomeCaptureHistory: 'OutcomeCaptureHistory' },
  }
  const compiled = ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText
  const module = { exports: {} }; new Function('require','module','exports',compiled)(key=>{assert.ok(Object.hasOwn(dependencies,key),key);return dependencies[key]},module,module.exports)
  const Component = module.exports[name]
  function render() { let count=0; do { dirty=false;cursor=0;tree=Component(props);const work=pending;pending=[];work.forEach(run=>run());assert.ok(++count<30) } while(dirty); return tree }
  return { get tree(){return render()}, setProps(value){props=value;return render()},
    async flush(){for(let i=0;i<6;i++){await new Promise(resolve=>setImmediate(resolve));render()}return tree},
    unmount(){effects.forEach(effect=>effect?.cleanup?.());active=false} }
}
const response = (body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}})
const success = request => ({stored:true,observationId:request.observationId,instrumentVersion:'2-capture',measurementStatus:'recorded_pending_evaluation'})
async function mockedFetch(implementation, run) { const original=globalThis.fetch;globalThis.fetch=implementation;try{await run()}finally{globalThis.fetch=original} }
function fill(ui) { for(const field of nodes(ui.tree).filter(node=>node.type==='Textarea')) field.props.onChange({target:{value:TEXT}}); return ui.tree }
const submit = ui => nodes(ui.tree).find(node=>node.type==='form').props.onSubmit({preventDefault(){}})
function savedRow(role='baseline', id='00000000-0000-4000-8000-000000000701',at='2026-10-01T12:00:00Z') {
  return { observationId:id,observedAt:at,measurementRole:role,responsePayload:Object.fromEntries(capture.CAPTURE_INSTRUMENTS[KEY].prompts.map(({key})=>[key,TEXT])) }
}
for(const key of Object.keys(capture.CAPTURE_INSTRUMENTS)) for(const role of ['baseline','follow_up']) test(key+': '+role+' has accessible labels, explicit save and explicit continue',async()=>{
 const calls=[];let continued=0
 await mockedFetch(async(_url,init)=>{calls.push(JSON.parse(init.body));return response(success(calls[0]),201)},async()=>{
  const ui=renderer(FORM,'OutcomeResponseCaptureForm',{instrumentKey:key,role,onSaved:()=>continued++})
  for(const field of nodes(ui.tree).filter(n=>n.type==='Textarea')){assert.ok(nodes(ui.tree).some(n=>n.type==='label'&&n.props.htmlFor===field.props.id));assert.ok(field.props['aria-describedby'])}
  fill(ui);submit(ui);submit(ui);await ui.flush();assert.equal(calls.length,1);assert.equal(continued,0)
  assert.equal(calls[0].measurementRole,role);for(const field of ['score','confidence','dimensions','user_id'])assert.equal(Object.hasOwn(calls[0],field),false)
  assert.match(text(ui.tree),/Tus respuestas quedaron guardadas/);assert.match(text(ui.tree),/No hay una evaluación automática en curso/)
  assert.equal(nodes(ui.tree).find(n=>n.type==='OutcomeCaptureHistory').props.refreshKey,1)
  button(ui.tree,'Continuar mi recorrido').props.onClick();assert.equal(continued,1);ui.unmount()
 })
})
for(const status of [400,401,409,413,500,503]) test('HTTP '+status+' preserves answers and does not claim success',async()=>{
 await mockedFetch(async()=>response({error:'failure'},status),async()=>{
  const ui=renderer(FORM,'OutcomeResponseCaptureForm',{instrumentKey:KEY,role:'baseline'});fill(ui);submit(ui);await ui.flush()
  assert.ok(nodes(ui.tree).some(n=>n.props.role==='alert'));assert.doesNotMatch(text(ui.tree),/Tus respuestas quedaron guardadas/)
  assert.ok(nodes(ui.tree).filter(n=>n.type==='Textarea').every(n=>n.props.value===TEXT));ui.unmount()
 })
})
test('network failure retains UUID for same answers and creates another only after an edit',async()=>{
 const calls=[]
 await mockedFetch(async(_url,init)=>{calls.push(JSON.parse(init.body));throw Error('network')},async()=>{
  const ui=renderer(FORM,'OutcomeResponseCaptureForm',{instrumentKey:KEY,role:'baseline'});fill(ui);submit(ui);await ui.flush();submit(ui);await ui.flush()
  assert.equal(calls[0].observationId,calls[1].observationId)
  nodes(ui.tree).find(n=>n.type==='Textarea').props.onChange({target:{value:TEXT+' Cambié mi respuesta.'}});submit(ui);await ui.flush()
  assert.notEqual(calls[1].observationId,calls[2].observationId);ui.unmount()
 })
})
test('wrong success identity or malformed JSON is not accepted',async()=>{
 for(const mode of ['wrong-id','invalid-json'])await mockedFetch(async()=>mode==='wrong-id'?response({stored:true,observationId:'wrong'}):new Response('{'),async()=>{
  const ui=renderer(FORM,'OutcomeResponseCaptureForm',{instrumentKey:KEY,role:'baseline'});fill(ui);submit(ui);await ui.flush();assert.doesNotMatch(text(ui.tree),/Tus respuestas quedaron guardadas/);ui.unmount()
 })
})
test('unmount aborts a pending save and ignores its late reply',async()=>{
 let pending
 await mockedFetch((_url,init)=>new Promise(resolve=>{pending={init,resolve}}),async()=>{
  const ui=renderer(FORM,'OutcomeResponseCaptureForm',{instrumentKey:KEY,role:'baseline'});fill(ui);submit(ui);ui.unmount();assert.equal(pending.init.signal.aborted,true)
  pending.resolve(response(success(JSON.parse(pending.init.body))));await new Promise(resolve=>setImmediate(resolve))
 })
})
for(const state of ['empty','baseline_only','follow_up_only','available','out_of_order'])test('readback renders '+state+' without numerical outcome claims',async()=>{
 const baseline=['baseline_only','available','out_of_order'].includes(state)?savedRow():null
 const followUp=['follow_up_only','available','out_of_order'].includes(state)?savedRow('follow_up','00000000-0000-4000-8000-000000000702',state==='out_of_order'?'2026-09-30T12:00:00Z':'2026-10-02T12:00:00Z'):null
 const payload=history.captureHistory(KEY,baseline,followUp),calls=[]
 await mockedFetch(async(url,init)=>{calls.push({url,init});return response(payload)},async()=>{
  const ui=renderer(HISTORY,'OutcomeCaptureHistory',{instrumentKey:KEY});await ui.flush();assert.equal(calls.length,1);assert.equal(calls[0].init.method,undefined);assert.equal(calls[0].init.cache,'no-store')
  assert.match(text(ui.tree),/No hay una evaluación automática en curso/)
  if(state==='available')assert.match(text(ui.tree),/dos registros en orden temporal/)
  if(state==='out_of_order')assert.match(text(ui.tree),/No presentamos estos registros como un antes y después/)
  if(state==='follow_up_only')assert.match(text(ui.tree),/no un punto de partida/)
  assert.doesNotMatch(text(ui.tree),/Confianza de evidencia:|Cambio observado|\b100%/);ui.unmount()
 })
})
test('read errors are not shown as empty history and retry is read-only',async()=>{
 let calls=0
 await mockedFetch(async()=>++calls===1?response({},503):response(history.captureHistory(KEY,null,null)),async()=>{
  const ui=renderer(HISTORY,'OutcomeCaptureHistory',{instrumentKey:KEY});await ui.flush();assert.match(text(ui.tree),/Esto no significa que no estén guardadas/)
  assert.doesNotMatch(text(ui.tree),/Todavía no hay respuestas/);button(ui.tree,'Reintentar lectura').props.onClick();await ui.flush();assert.equal(calls,2);assert.match(text(ui.tree),/Todavía no hay respuestas/);ui.unmount()
 })
})
test('a late history response cannot replace the refreshed read',async()=>{
 const pending=[]
 await mockedFetch((url,init)=>new Promise(resolve=>pending.push({url,init,resolve})),async()=>{
  const ui=renderer(HISTORY,'OutcomeCaptureHistory',{instrumentKey:KEY,refreshKey:0});ui.tree;ui.setProps({instrumentKey:KEY,refreshKey:1});assert.equal(pending[0].init.signal.aborted,true)
  pending[1].resolve(response(history.captureHistory(KEY,savedRow(),null)));await ui.flush()
  pending[0].resolve(response(history.captureHistory(KEY,null,null)));await ui.flush();assert.match(text(ui.tree),/Leer mis respuestas/);assert.doesNotMatch(text(ui.tree),/Todavía no hay respuestas/);ui.unmount()
 })
})
test('history session expiry clears prior records on refresh',async()=>{
 let calls=0
 await mockedFetch(async()=>++calls===1?response(history.captureHistory(KEY,savedRow(),null)):response({},401),async()=>{
  const ui=renderer(HISTORY,'OutcomeCaptureHistory',{instrumentKey:KEY,refreshKey:0});await ui.flush();ui.setProps({instrumentKey:KEY,refreshKey:1});await ui.flush()
  assert.match(text(ui.tree),/Vuelve a iniciar sesión/);assert.doesNotMatch(text(ui.tree),new RegExp(TEXT));ui.unmount()
 })
})
;(async()=>{let failed=0;for(const {name,run} of cases)try{await run()}catch(error){failed++;console.error(JSON.stringify({name,error:error.message,stack:error.stack}))}
 console.log(JSON.stringify({suite:'outcome-capture-ui',cases:cases.length,passed:cases.length-failed,failed,hooks:'synthetic',browserRendering:false,liveDatabaseWrites:0}));if(failed)process.exitCode=1})()
