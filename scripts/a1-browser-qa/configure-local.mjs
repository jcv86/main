import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import assert from 'node:assert/strict'
assert.equal(process.env.A1_BROWSER_LAB,'yes')
const app=join(process.env.A1_LAB_ROOT,'app-runtime')
const css=join(app,'app/globals.css')
// The lab deliberately uses a fallback font and blocks browser network outside loopback.
// Remove only the external Google Fonts import, not any application style rule.
writeFileSync(css,readFileSync(css,'utf8').split('\n').filter(line=>!line.startsWith("@import url('https://fonts.googleapis.com/")).join('\n'))
const dir=join(app,'app/api/a1/clarifications'), source=readFileSync(join(dir,'route.ts'),'utf8')
writeFileSync(join(dir,'source.ts'),source)
// Transparent local-only diagnostics: preserve the original handler/status/body and origin check.
writeFileSync(join(dir,'route.ts'),`import {PUT as actualPUT} from './source'
export {dynamic,runtime} from './source'
export async function PUT(request:Request){const response=await actualPUT(request);if(response.status===403){response.headers.set('x-lab-request-origin',new URL(request.url).origin);response.headers.set('x-lab-header-origin',request.headers.get('origin')||'none')}return response}
`)
