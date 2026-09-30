import { createAdminClient } from '@/lib/supabase/server'

const EVENT_TYPES = new Set(['application','employer_response','screening','interview','process_advance','rejection','offer','withdrawal'])
const SOURCE_CHANNELS = new Set(['dtc_a4','linkedin','job_board','referral','direct','recruiter','other'])
const OUTCOME_TYPES = new Set(['job_started','role_change','promotion','return_to_work'])
const WORK_MODES = new Set(['onsite','hybrid','remote'])
const EMPLOYMENT_CATEGORIES = new Set(['private_employee','public_employee','employer','self_employed','other'])

const text = (value: unknown, max: number) => typeof value === 'string' && value.trim() ? value.trim().slice(0,max) : null
const dateOnly = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null
const timestamp = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null

export async function recordJobSearchEvent(userId: string, input: Record<string,unknown>) {
  if (!EVENT_TYPES.has(String(input.eventType))) throw new Error('INVALID_EVENT_TYPE')
  const occurredAt=timestamp(input.occurredAt); if(!occurredAt) throw new Error('INVALID_OCCURRED_AT')
  const source=input.sourceChannel==null?null:String(input.sourceChannel); if(source&&!SOURCE_CHANNELS.has(source)) throw new Error('INVALID_SOURCE_CHANNEL')
  const db=createAdminClient()
  const {data,error}=await db.from('dtc_job_search_events').insert({
    user_id:userId,event_type:input.eventType,occurred_at:occurredAt,source_channel:source,
    target_role:text(input.targetRole,160),occupation_code:text(input.occupationCode,40),region_code:text(input.regionCode,20),
    verification_status:'self_reported',evidence_refs:[],
  }).select('id,event_type,occurred_at,verification_status').single()
  if(error) throw error; return data
}

export async function recordEmploymentOutcome(userId: string, input: Record<string,unknown>) {
  if (!OUTCOME_TYPES.has(String(input.outcomeType))) throw new Error('INVALID_OUTCOME_TYPE')
  const effectiveDate=dateOnly(input.effectiveDate); if(!effectiveDate) throw new Error('INVALID_EFFECTIVE_DATE')
  const roleTitle=text(input.roleTitle,160); if(!roleTitle) throw new Error('ROLE_REQUIRED')
  const workMode=input.workMode==null?null:String(input.workMode); if(workMode&&!WORK_MODES.has(workMode)) throw new Error('INVALID_WORK_MODE')
  const category=input.employmentCategory==null?null:String(input.employmentCategory); if(category&&!EMPLOYMENT_CATEGORIES.has(category)) throw new Error('INVALID_EMPLOYMENT_CATEGORY')
  const source=input.sourceChannel==null?null:String(input.sourceChannel); if(source&&!SOURCE_CHANNELS.has(source)) throw new Error('INVALID_SOURCE_CHANNEL')
  const db=createAdminClient()
  const {data,error}=await db.from('dtc_employment_outcomes').insert({
    user_id:userId,outcome_type:input.outcomeType,effective_date:effectiveDate,role_title:roleTitle,
    occupation_code:text(input.occupationCode,40),region_code:text(input.regionCode,20),work_mode:workMode,
    employment_category:category,source_channel:source,verification_status:'self_reported',evidence_refs:[],
  }).select('id,outcome_type,effective_date,verification_status').single()
  if(error) throw error
  await db.from('dtc_outcome_followups').insert([30,90,180].map(day=>({user_id:userId,employment_outcome_id:data.id,followup_day:day,due_at:new Date(Date.parse(effectiveDate+'T00:00:00Z')+day*86400000).toISOString().slice(0,10),verification_status:'self_reported'})))
  return data
}

export async function recordSalaryOutcome(userId: string, input: Record<string,unknown>) {
  const role=String(input.measurementRole); if(!['baseline','new_role','follow_up'].includes(role)) throw new Error('INVALID_MEASUREMENT_ROLE')
  const amount=Number(input.monthlyNetClp); if(!Number.isInteger(amount)||amount<0||amount>100000000) throw new Error('INVALID_MONTHLY_NET_CLP')
  const measuredAt=dateOnly(input.measuredAt); if(!measuredAt) throw new Error('INVALID_MEASURED_AT')
  const db=createAdminClient()
  const {data,error}=await db.from('dtc_salary_outcomes').insert({
    user_id:userId,employment_outcome_id:input.employmentOutcomeId||null,measurement_role:role,
    monthly_net_clp:amount,measured_at:measuredAt,verification_status:'self_reported',evidence_refs:[],
  }).select('id,measurement_role,monthly_net_clp,measured_at,verification_status').single()
  if(error) throw error; return data
}
