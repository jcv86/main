import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

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
