// Harness regression only: real Chromium + a synthetic loopback HTTP server.
// This does not substitute for the app's Auth, API or RLS acceptance.
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { once } from 'node:events'
import { captureUiJsonResponse } from './closure-response.mjs'

assert.equal(process.env.A1_BROWSER_LAB,'yes','Use only the disposable acceptance environment')
assert.ok(process.env.A1_TOOLS_ROOT,'The isolated browser tools are required')
const requireTool = createRequire(join(process.env.A1_TOOLS_ROOT,'package.json'))
const { chromium } = requireTool('playwright')
const cases = new Map(['reload','goto'].map(name => {
  let ready
  const pending = new Promise(resolve => { ready = resolve })
  return [name,{documents:0,reads:[],pending,ready,response:null}]
}))
let browser
const observed=[]
const respond = (response,status,body) => {
  response.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'})
  response.end(JSON.stringify(body))
}
const server = createServer(async (request,response) => {
  const url = new URL(request.url,'http://127.0.0.1')
  if (url.pathname==='/api/history') {
    const state = cases.get(request.headers['x-synthetic-case'])
    const document = request.headers['x-synthetic-document']
    state.reads.push(document)
    if (document==='old') { state.response=response; state.ready(); return }
    respond(response,200,{document:'new',record:'saved synthetic answers'})
    return
  }
  if (url.pathname==='/page') {
    const name=url.searchParams.get('case'), state=cases.get(name)
    assert.ok(state)
    const document=++state.documents===1?'old':'new'
    if (document==='new') {
      // Deliver the old document's refresh while the new navigation is pending.
      respond(state.response,200,{document:'old',record:'stale refresh'})
      await new Promise(resolve=>setTimeout(resolve,40))
    }
    response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'})
    response.end(`<!doctype html><title>Synthetic request lifetime regression</title>
      <button id="refresh">Refresh existing document</button>
      <script>const read=()=>fetch('/api/history',{headers:{'x-synthetic-case':${JSON.stringify(name)},'x-synthetic-document':${JSON.stringify(document)}}}).then(response=>response.json());
      document.querySelector('#refresh').onclick=()=>{void read()};
      ${document==='new'?'void read();':''}</script>`)
    return
  }
  if (url.pathname==='/save') {
    response.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'})
    response.end(`<!doctype html><title>Synthetic save observation</title><button id="save">Save</button>
      <script>document.querySelector('#save').onclick=async()=>{
        const result=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:'synthetic-record'})});
        await result.json();setTimeout(()=>{location.href='/done'},50)
      }</script>`)
    return
  }
  if (url.pathname==='/api/save') {
    const chunks=[]
    for await (const chunk of request) chunks.push(chunk)
    const body=JSON.parse(Buffer.concat(chunks).toString('utf8'))
    respond(response,201,{stored:true,id:body.id})
    return
  }
  if (url.pathname==='/done') {
    response.writeHead(200,{'Content-Type':'text/html'});response.end('<!doctype html><title>Saved</title>Saved');return
  }
  response.writeHead(404);response.end()
})

try {
  server.listen(0,'127.0.0.1')
  await once(server,'listening')
  const base=`http://127.0.0.1:${server.address().port}`
  browser=await chromium.launch({headless:true})
  const context=await browser.newContext()
  await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort())
  const page=await context.newPage()
  const observeRequest=request=>observed.push({event:'request',path:new URL(request.url()).pathname,document:request.headers()['x-synthetic-document']||null,main:request.frame()===page.mainFrame()})
  const observeResponse=response=>observed.push({event:'response',path:new URL(response.url()).pathname,status:response.status(),document:response.request().headers()['x-synthetic-document']||null})
  const observeNavigation=frame=>{if(frame===page.mainFrame())observed.push({event:'document',path:new URL(frame.url()).pathname})}
  const observeError=error=>observed.push({event:'pageerror',message:error.message})
  page.on('request',observeRequest);page.on('response',observeResponse);page.on('framenavigated',observeNavigation);page.on('pageerror',observeError)
  for (const [name,state] of cases) {
    await page.goto(`${base}/page?case=${name}`)
    await page.locator('#refresh').click()
    await state.pending
    const staleWaiter=page.waitForResponse(response=>new URL(response.url()).pathname==='/api/history')
    const correct=captureUiJsonResponse(page,request=>{observed.push({event:'eligible',path:new URL(request.url()).pathname});return new URL(request.url()).pathname==='/api/history'&&request.method()==='GET'},{afterNavigation:true,timeout:5000})
    if (name==='reload') await page.reload()
    else await page.goto(`${base}/page?case=${name}&new=1`)
    const captured=await correct
    assert.equal((await staleWaiter).request().headers()['x-synthetic-document'],'old','The previous response-only waiter binds to the stale refresh')
    assert.equal(captured.status,200)
    assert.deepEqual(captured.body,{document:'new',record:'saved synthetic answers'})
    assert.deepEqual(state.reads,['old','new'],'The observer must not retry or issue a manual replacement GET')
  }
  await page.goto(base+'/save')
  const saved=captureUiJsonResponse(page,request=>new URL(request.url()).pathname==='/api/save'&&request.method()==='POST')
  await page.locator('#save').click()
  await page.waitForURL(base+'/done')
  const snapshot=await saved
  assert.equal(snapshot.status,201)
  assert.deepEqual(snapshot.requestBody,{id:'synthetic-record'})
  assert.deepEqual(snapshot.body,{stored:true,id:'synthetic-record'})
  page.off('request',observeRequest);page.off('response',observeResponse);page.off('framenavigated',observeNavigation);page.off('pageerror',observeError)
  assert.equal(page.listenerCount('response'),0)
  assert.equal(page.listenerCount('request'),0)
  assert.equal(page.listenerCount('framenavigated'),0)
  console.log(JSON.stringify({suite:'closure-ui-response-lifetime',cases:3,passed:3,
    oldRefreshExcluded:true,newDocumentUiReads:true,noReplacementGets:true,postSnapshotSurvivesNavigation:true,
    realChromium:true,syntheticLoopbackServer:true,liveAuthOrRls:false}))
} catch(error) {
  console.error(JSON.stringify({observed}))
  throw error
} finally {
  await browser?.close()
  server.closeAllConnections()
  await new Promise(resolve=>server.close(resolve))
}
