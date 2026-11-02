import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { captureUiJsonResponse } from './closure-response.mjs'

/** HTTP/SQL acceptance only: no live vacancies, external search or scoring services. */
export async function verifySavedObjective({ page, secondPage, api, db, alpha, beta, alphaClient, betaClient, record }) {
  const path = '/api/a4/search-intents'
  const initial = await api(page,'GET',undefined,path)
  assert.equal(initial.status,200)
  assert.deepEqual(initial.body.intents,[])
  assert.ok(initial.cache.includes('private') && initial.cache.includes('no-store'))
  const objective = {
    name:'Objetivo sintético de aceptación',targetRoles:['Analista de datos'],
    functionalAreas:['Tecnología, Datos y Producto'],objectiveStage:'specific',breadth:'related',
    locations:['Metropolitana'],locationPreference:'selected',workModes:['hybrid'],
    industries:['Tecnología'],excludedIndustries:['Minería'],unknownIndustryPolicy:'exclude',
    seniorityMin:'junior',salaryMinClp:900000,employmentTypes:['Jornada completa'],languages:['Español'],
    isPrimary:true,expectedRevision:null,
  }
  const created = await api(page,'POST',objective,path)
  assert.equal(created.status,201,'Real objective writer must confirm creation')
  const original = created.body.intent
  assert.ok(original.id && original.updated_at)
  assert.deepEqual(original.target_roles,objective.targetRoles)
  assert.deepEqual(original.functional_areas,objective.functionalAreas)
  assert.deepEqual(original.industries,objective.industries)
  assert.deepEqual(original.excluded_industries,objective.excludedIndustries)
  assert.equal(original.location_preference,'selected')
  assert.equal(original.unknown_industry_policy,'exclude')

  await page.reload()
  const [firstRead,secondRead] = await Promise.all([
    api(page,'GET',undefined,path),api(secondPage,'GET',undefined,path),
  ])
  for (const result of [firstRead,secondRead]) {
    assert.equal(result.status,200)
    assert.equal(result.body.intents.length,1)
    assert.deepEqual(result.body.intents[0],original,'Both real sessions must recover the saved objective')
  }
  record('objective_actual_api_save_reload_read_across_two_auth_sessions')

  const own = await alphaClient.from('career_search_intents').select('id,user_id').eq('id',original.id)
  assert.equal(own.error,null); assert.equal(own.data.length,1)
  assert.equal(own.data[0].user_id,alpha.id)
  const other = await betaClient.from('career_search_intents').select('id,target_roles').eq('user_id',alpha.id)
  assert.equal(other.error,null); assert.deepEqual(other.data,[])
  const reassignment = await alphaClient.from('career_search_intents').update({user_id:beta.id}).eq('id',original.id)
  assert.equal(reassignment.error?.code,'42501','Owner WITH CHECK must reject reassignment')
  const foreignInsert = await betaClient.from('career_search_intents').insert({
    id:randomUUID(),user_id:alpha.id,target_roles:['Analista sintético'],locations:[],work_modes:[],
    location_preference:'unspecified',is_primary:false,
  })
  assert.equal(foreignInsert.error?.code,'42501','Authenticated user must not write another owner objective')
  record('objective_real_owner_rls_read_and_with_check_boundary')

  const revision = {id:original.id,updatedAt:original.updated_at}
  // Keep advanced preferences omitted to prove that a normal edit retains them.
  const {seniorityMin,salaryMinClp,employmentTypes,languages,...baseEdit} = objective
  const edits = [
    {...baseEdit,targetRoles:['Ingeniero de datos'],expectedRevision:revision},
    {...baseEdit,targetRoles:['Desarrollador de software'],expectedRevision:revision},
  ]
  const concurrent = await Promise.all([
    api(page,'POST',edits[0],path),api(secondPage,'POST',edits[1],path),
  ])
  assert.deepEqual(concurrent.map(result=>result.status).sort(),[200,409], 'One actual concurrent update wins; the stale revision must conflict')
  const winner = concurrent.find(result=>result.status===200).body.intent
  const conflict = concurrent.find(result=>result.status===409)
  assert.equal(conflict.body.code,'search_conflict')
  assert.equal(winner.id,original.id)
  assert.notEqual(winner.updated_at,original.updated_at)
  assert.equal(winner.seniority_min,seniorityMin)
  assert.equal(winner.salary_min_clp,salaryMinClp)
  assert.deepEqual(winner.employment_types,employmentTypes)
  assert.deepEqual(winner.languages,languages)
  const recovered = await api(secondPage,'GET',undefined,path)
  assert.equal(recovered.status,200)
  assert.deepEqual(recovered.body.intents,[winner])
  const stored = await db.query('select id,target_roles,updated_at,is_primary,is_active,user_id from public.career_search_intents where user_id=$1',[alpha.id])
  assert.equal(stored.rowCount,1)
  assert.equal(stored.rows[0].id,original.id)
  assert.deepEqual(stored.rows[0].target_roles,winner.target_roles)
  assert.equal(stored.rows[0].is_primary,true)
  assert.equal(stored.rows[0].is_active,true)
  assert.equal(stored.rows[0].user_id,alpha.id)
  record('objective_actual_concurrent_compare_and_swap_409_single_primary_advanced_fields_retained')
}

/** A pilot user can declare an objective without unlocking or consulting the Radar. */
export async function verifyEarlyObjective({ page, base, api, db, user, visual, record }) {
  const endpoint = '/api/career/objective'
  const profileBefore = await db.query(`select a2_intro_seen,a3_unlocked,a4_unlocked,camino_foco,
    camino_persona_active,camino_profesional_active from public.despega_user_profiles where user_id=$1`,[user.id])
  const stateBefore = await db.query(`select current_module,current_a2_day,highest_a2_day_unlocked,
    a3_unlocked_at,a4_unlocked_at,version from public.despega_journey_state where user_id=$1`,[user.id])
  assert.equal(profileBefore.rows[0].camino_foco,'persona')
  assert.equal(profileBefore.rows[0].a2_intro_seen,false)
  const a2Access = await api(page,'GET',undefined,'/api/journey/module-access?module=A2')
  assert.equal(a2Access.status,200); assert.equal(a2Access.body.canAccess,false)
  const completionBefore = await db.query('select count(*)::int as records from public.a2_user_task_completions where user_id=$1',[user.id])
  const deniedCompletion = await api(page,'POST',{dayNumber:1,submission:{
    summary:'Ejemplo sintético propio.',evidence:'Una observación concreta.',reflection:'Próximo intento.',
    metrics:'',artifactUrl:'',completedInstructions:[0,1,2],
  }},'/api/a2/complete-day')
  const deniedAdjustment = await api(page,'POST',{
    requestId:randomUUID(),dayNumber:1,outcome:'could_not',barrier:'time',
    retainedWork:'Conservo una observación.',nextAction:'Practicaré diez minutos.',reviewDate:'2026-11-03',
  },'/api/a2/practice-adjustments')
  for (const result of [deniedCompletion,deniedAdjustment]) {
    assert.equal(result.status,403,'An authenticated pilot without A2 entry cannot write practice evidence')
    assert.match(result.body.error,/^Completa tu punto de partida antes de guardar/,'The canonical A2 guard must be the rejection reason')
    assert.ok(result.cache?.includes('private') && result.cache?.includes('no-store'))
  }
  assert.deepEqual((await db.query('select count(*)::int as records from public.a2_user_task_completions where user_id=$1',[user.id])).rows,completionBefore.rows)
  record('actual_a2_complete_day_and_adjustment_reject_before_canonical_a2_access')
  const priorAccess = await api(page,'GET',undefined,'/api/journey/module-access?module=A4')
  assert.equal(priorAccess.status,200); assert.equal(priorAccess.body.canAccess,false)
  assert.equal((await api(page,'GET',undefined,'/api/a4/opportunities/catalog')).status,403)
  const requests = []
  let writes = 0
  const observe = request => {
    const url = new URL(request.url())
    if (url.pathname.startsWith('/api/a4/opportunities/')) requests.push(url.pathname)
    if (url.pathname === endpoint && request.method()==='POST') writes += 1
  }
  page.on('request',observe)
  try {
    const read = captureUiJsonResponse(page, request => new URL(request.url()).pathname===endpoint && request.method()==='GET', {afterNavigation:true})
    await page.goto(base+'/despega/objetivo-laboral')
    assert.equal((await read).status,200)
    await page.getByRole('heading',{name:'Tu próximo paso laboral',exact:true}).waitFor()
    await page.getByRole('button',{name:'Guardar mi objetivo',exact:true}).waitFor()
    assert.equal(await page.getByRole('button',{name:'Ver ofertas',exact:true}).count(),0)

    const specific = page.getByRole('radio',{name:'Sé qué trabajo busco',exact:true})
    await specific.focus(); await page.keyboard.press('Space')
    const role = page.getByLabel('¿Qué cargo te gustaría conseguir?',{exact:true})
    await role.fill('Analista de datos'); await role.press('Enter')
    await page.getByRole('button',{name:'Quitar Analista de datos',exact:true}).waitFor()
    const area = page.getByRole('button',{name:'Tecnología, Datos y Producto',exact:true})
    await area.focus(); await page.keyboard.press('Space')
    assert.equal(await area.getAttribute('aria-pressed'),'true')
    await page.getByLabel('Agregar rubro de interés',{exact:true}).selectOption('Tecnología')
    const regions = page.getByText('Elegir regiones',{exact:true})
    await regions.focus(); await page.keyboard.press('Enter')
    const metropolitan = page.getByRole('checkbox',{name:'Metropolitana',exact:true})
    await metropolitan.focus(); await page.keyboard.press('Space')
    const hybrid = page.getByRole('checkbox',{name:'Híbrido',exact:true})
    await hybrid.focus(); await page.keyboard.press('Space')
    await visual(page,'early-objective-form')

    const savedResponse = captureUiJsonResponse(page, request => new URL(request.url()).pathname===endpoint && request.method()==='POST')
    const save = page.getByRole('button',{name:'Guardar mi objetivo',exact:true})
    await save.focus(); await page.keyboard.press('Enter')
    const saved = await savedResponse
    assert.equal(saved.status,201)
    const intent = saved.body.intent
    assert.deepEqual(intent.target_roles,['Analista de datos'])
    assert.deepEqual(intent.functional_areas,['Tecnología, Datos y Producto'])
    assert.deepEqual(intent.industries,['Tecnología'])
    assert.deepEqual(intent.locations,['Metropolitana'])
    assert.deepEqual(intent.work_modes,['hybrid'])
    assert.equal(intent.objective_stage,'specific')
    const summary = page.getByRole('list',{name:'Resumen del objetivo guardado',exact:true})
    await summary.waitFor()
    assert.ok((await summary.innerText()).includes('Cargo: Analista de datos'))
    assert.equal(new URL(page.url()).pathname,'/despega/objetivo-laboral')

    const restored = captureUiJsonResponse(page, request => new URL(request.url()).pathname===endpoint && request.method()==='GET', {afterNavigation:true})
    await page.reload()
    const restoreResponse = await restored
    assert.equal(restoreResponse.status,200)
    const restoredBody = restoreResponse.body
    assert.equal(restoredBody.intents.length,1)
    assert.deepEqual(restoredBody.intents[0],intent)
    await summary.waitFor()
    for (const text of ['Cargo: Analista de datos','Área: Tecnología, Datos y Producto','Rubro: Tecnología','Metropolitana','Híbrido']) {
      assert.equal(await summary.getByText(text,{exact:true}).isVisible(),true)
    }
    await visual(page,'early-objective-restored')
    const continuation = page.getByRole('link',{name:'Continuar mi recorrido',exact:true})
    await continuation.focus(); await page.keyboard.press('Enter')
    await page.waitForURL(url=>url.pathname==='/despega/recorrido')
    await page.getByRole('heading',{name:'Tu siguiente paso tiene contexto',exact:true}).waitFor()
    assert.equal(writes,1,'Reload and continuation must not save another objective')
    assert.deepEqual(requests,[],'Early objective UI must not query the A4 catalog or matching endpoints')
  } finally { page.off('request',observe) }

  const currentAccess = await api(page,'GET',undefined,'/api/journey/module-access?module=A4')
  assert.equal(currentAccess.status,200); assert.equal(currentAccess.body.canAccess,false)
  assert.equal((await api(page,'GET',undefined,'/api/a4/opportunities/catalog')).status,403)
  const profileAfter = await db.query(`select a2_intro_seen,a3_unlocked,a4_unlocked,camino_foco,
    camino_persona_active,camino_profesional_active from public.despega_user_profiles where user_id=$1`,[user.id])
  const stateAfter = await db.query(`select current_module,current_a2_day,highest_a2_day_unlocked,
    a3_unlocked_at,a4_unlocked_at,version from public.despega_journey_state where user_id=$1`,[user.id])
  assert.deepEqual(profileAfter.rows,profileBefore.rows)
  assert.deepEqual(stateAfter.rows,stateBefore.rows)
  const persisted = await db.query('select count(*)::int as records from public.career_search_intents where user_id=$1',[user.id])
  assert.equal(persisted.rows[0].records,1)
  record('early_objective_keyboard_save_reload_summary_continue_without_catalog_or_journey_unlock')
}
