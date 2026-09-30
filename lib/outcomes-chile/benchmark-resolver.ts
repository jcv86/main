import { createAdminClient } from '@/lib/supabase/server'

export type BenchmarkSpecificity = 'region_occupation_education'|'region_occupation'|'occupation'|'region'|'national'

export interface ChileBenchmarkRequest {
  metricKey: 'monthly_labor_income_mean'|'monthly_labor_income_median'|'employment_rate'|'unemployment_rate'|'vacancy_demand'|'skill_demand'
  regionCode?: string | null
  occupationCode?: string | null
  educationLevel?: string | null
}

function specificity(row: any, request: ChileBenchmarkRequest): {score:number;level:BenchmarkSpecificity}|null {
  if(row.reliability_status==='suppressed_low_sample') return null
  const region=Boolean(request.regionCode&&row.region_code===request.regionCode)
  const occupation=Boolean(request.occupationCode&&row.occupation_code===request.occupationCode)
  const education=Boolean(request.educationLevel&&row.education_level===request.educationLevel)
  if(region&&occupation&&education) return {score:50,level:'region_occupation_education'}
  if(region&&occupation&&!row.education_level) return {score:40,level:'region_occupation'}
  if(occupation&&!row.region_code&&!row.education_level) return {score:30,level:'occupation'}
  if(region&&!row.occupation_code&&!row.education_level) return {score:20,level:'region'}
  if(!row.region_code&&!row.occupation_code&&!row.education_level) return {score:10,level:'national'}
  return null
}

export async function resolveChileBenchmark(request: ChileBenchmarkRequest) {
  const db=createAdminClient()
  const {data,error}=await db.from('dtc_chile_benchmarks')
    .select('id,source_key,source_period,metric_key,region_code,occupation_code,education_level,employment_category,value_numeric,unit,sample_size,reliability_status,source_ref,published_at')
    .eq('metric_key',request.metricKey)
    .neq('reliability_status','suppressed_low_sample')
  if(error) throw error
  const ranked=(data||[]).map(row=>({row,match:specificity(row,request)})).filter((item):item is {row:any;match:{score:number;level:BenchmarkSpecificity}}=>Boolean(item.match))
    .sort((a,b)=>b.match.score-a.match.score||String(b.row.source_period).localeCompare(String(a.row.source_period))||String(b.row.published_at||'').localeCompare(String(a.row.published_at||'')))
  const best=ranked[0]
  if(!best) return null
  return {
    benchmarkId:best.row.id,
    specificity:best.match.level,
    metricKey:best.row.metric_key,
    value:Number(best.row.value_numeric),
    unit:best.row.unit,
    sourceKey:best.row.source_key,
    sourcePeriod:best.row.source_period,
    sourceRef:best.row.source_ref,
    reliabilityStatus:best.row.reliability_status,
    sampleSize:best.row.sample_size,
    dimensions:{regionCode:best.row.region_code,occupationCode:best.row.occupation_code,educationLevel:best.row.education_level},
  }
}
