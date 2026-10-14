// Pure data-contract tests. No HTTP, database, accounts, or browser session.
const assert = require('node:assert/strict')
const { emptySearchFilters, parsePrimarySearchRevision, parseSavedPrimarySearch, primarySearchFromResponse, sameSearchFilters, confirmedSavedSearch } = require('../lib/opportunities/saved-search.ts')
const cases = []
const test = (name, run) => cases.push({ name, run })
const row = () => ({ id: '00000000-0000-4000-8000-000000000701', updated_at: '2026-10-01T12:00:00.123456+00:00', name: 'Mi búsqueda',
  is_primary: true, is_active: true, target_roles: ['Analista financiero'], breadth: 'precise', locations: ['Biobío'], work_modes: ['hybrid'], industries: ['Minería'], excluded_industries: ['Retail'] })

test('a new exploration attributes no role, area, region or mode', () => assert.deepEqual(emptySearchFilters(), { targetRoles: [], breadth: 'related', locations: [], workModes: [] }))
test('empty filters are independent objects', () => { const a=emptySearchFilters(); a.locations.push('Metropolitana'); assert.deepEqual(emptySearchFilters().locations, []) })
test('confirmed search retains exact filters and database revision', () => { const s=parseSavedPrimarySearch(row()); assert.deepEqual(s.filters, { targetRoles: ['Analista financiero'], breadth: 'precise', locations: ['Biobío'], workModes: ['hybrid'] }); assert.equal(s.revision.updatedAt,row().updated_at) })
test('reading does not mutate source data or share arrays', () => { const r=row(), before=structuredClone(r); const s=parseSavedPrimarySearch(r); s.filters.locations.push('Maule'); assert.deepEqual(r,before) })
test('advanced industries are preserved separately, never promoted into roles', () => { const s=parseSavedPrimarySearch(row()); assert.deepEqual(s.industries,['Minería']); assert.deepEqual(s.excludedIndustries,['Retail']); assert.equal(s.filters.targetRoles.includes('Minería'),false) })
test('legacy flexible retains exact semantics without silently adding unknown modes', () => { const r=row();r.work_modes=['flexible'];assert.deepEqual(parseSavedPrimarySearch(r).filters.workModes,['flexible']) })
test('verified empty list means no primary', () => assert.equal(primarySearchFromResponse({intents:[]}),null))
test('active secondary-only list means no primary', () => assert.equal(primarySearchFromResponse({intents:[{...row(),is_primary:false}]}),null))
test('primary is selected regardless of response position', () => assert.equal(primarySearchFromResponse({intents:[{...row(),is_primary:false},row()]}).revision.id,row().id))
test('two active primaries are an error, not an arbitrary winner', () => assert.throws(()=>primarySearchFromResponse({intents:[row(),{...row(),id:'00000000-0000-4000-8000-000000000702'}]})))
for(const input of [null,{}, {intents:null},{intents:{}},{intents:[null]},{intents:[{...row(),is_primary:'true'}]},{intents:[{...row(),is_active:false}]},{intents:Array(101).fill(row())}]) test('malformed readback cannot become absence: '+JSON.stringify(input).slice(0,65),()=>assert.throws(()=>primarySearchFromResponse(input)))
for(const patch of [{id:'wrong'}, {updated_at:'wrong'}, {target_roles:[]},{target_roles:['']},{target_roles:['x'.repeat(201)]},{locations:Array(7).fill('Maule')},{work_modes:['telepatía']},{work_modes:'hybrid'},{breadth:'unknown'},{industries:[4]},{excluded_industries:null}]) test('invalid saved row fails closed: '+Object.keys(patch).join(','),()=>assert.throws(()=>parseSavedPrimarySearch({...row(),...patch})))
test('breadth is not accepted by object coercion',()=>assert.throws(()=>parseSavedPrimarySearch({...row(),breadth:{toString:()=> 'precise'}})))
test('null revision explicitly expresses absence',()=>assert.equal(parsePrimarySearchRevision(null),null))
for(const input of [undefined,{}, {id:row().id,updatedAt:'invalid'}, {id:row().id,updatedAt:row().updated_at,userId:'other'}]) test('invalid expected revision rejected: '+String(input),()=>assert.throws(()=>parsePrimarySearchRevision(input)))
test('filter order has no meaning in save confirmation',()=>{const f=parseSavedPrimarySearch(row()).filters; assert.ok(sameSearchFilters({...f,locations:['Maule','Biobío']},{...f,locations:['Biobío','Maule']}))})
test('different role cannot be confirmed',()=>{const f=parseSavedPrimarySearch(row()).filters; assert.throws(()=>confirmedSavedSearch({intent:row()},{...f,targetRoles:['Contador']}))})
test('different region cannot be confirmed',()=>{const f=parseSavedPrimarySearch(row()).filters; assert.throws(()=>confirmedSavedSearch({intent:row()},{...f,locations:['Metropolitana']}))})
test('different breadth cannot be confirmed',()=>{const f=parseSavedPrimarySearch(row()).filters; assert.throws(()=>confirmedSavedSearch({intent:row()},{...f,breadth:'exploratory'}))})
test('different mode cannot be confirmed',()=>{const f=parseSavedPrimarySearch(row()).filters; assert.throws(()=>confirmedSavedSearch({intent:row()},{...f,workModes:['remote']}))})
test('HTTP success with empty body is not confirmation',()=>assert.throws(()=>confirmedSavedSearch({},emptySearchFilters())))
test('same filters and valid identity can be confirmed',()=>{const f=parseSavedPrimarySearch(row()).filters; assert.deepEqual(confirmedSavedSearch({intent:row()},f).filters,f)})
let failed=0
for(const item of cases){try{item.run()}catch(error){failed++;console.error(item.name+': '+error.message)}}
console.log(JSON.stringify({suite:'saved-search-contract',cases:cases.length,passed:cases.length-failed,failed,networkCalls:0,databaseWrites:0,integrated:false}))
if(failed)process.exitCode=1
