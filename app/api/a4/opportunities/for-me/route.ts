import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { fetchChileTrabajosOpportunities } from '@/lib/opportunities/sources/chiletrabajos'
import { planOpportunityQueries } from '@/lib/opportunities/search-intent'

export const runtime='nodejs'
export const dynamic='force-dynamic'

export async function GET() {
 const user=await resolveServerUser()
 if(!user) return NextResponse.json({error:'No autenticado'},{status:401})
 const supabase=createAdminClient()
 const access=await checkA4Access(user.id,supabase)
 if(!access.canAccess) return NextResponse.json({error:getA4AccessDenialMessage(),code:access.reason},{status:403})
 const {data:intent,error}=await supabase.from('career_search_intents').select('*').eq('user_id',user.id).eq('is_active',true).eq('is_primary',true).maybeSingle()
 if(error) return NextResponse.json({error:'No fue posible cargar tu búsqueda.'},{status:500})
 if(!intent){
  const opportunities=await fetchChileTrabajosOpportunities('','Santiago',12)
  return NextResponse.json({needs_intent:true,mode:'available_now',source:'chiletrabajos',fetched_at:new Date().toISOString(),count:opportunities.length,opportunities})
 }
 const queries=planOpportunityQueries({targetRoles:Array.isArray(intent.target_roles)?intent.target_roles:[],breadth:intent.breadth,locations:Array.isArray(intent.locations)?intent.locations:[],workModes:Array.isArray(intent.work_modes)?intent.work_modes:[]})
 const location=Array.isArray(intent.locations)&&typeof intent.locations[0]==='string'?intent.locations[0]:'Santiago'
 const collected=[] as Awaited<ReturnType<typeof fetchChileTrabajosOpportunities>>
 const seen=new Set<string>()
 for(const query of queries.slice(0,3)){
   const jobs=await fetchChileTrabajosOpportunities(query,location,5)
   for(const job of jobs){if(!seen.has(job.originalUrl)){seen.add(job.originalUrl);collected.push(job)}}
   if(collected.length>=12) break
 }
 return NextResponse.json({
  needs_intent:false,
  intent:{name:intent.name,target_roles:intent.target_roles,breadth:intent.breadth,locations:intent.locations,work_modes:intent.work_modes},
  query_plan:queries,
  source:'chiletrabajos',
  fetched_at:new Date().toISOString(),
  count:collected.slice(0,12).length,
  opportunities:collected.slice(0,12),
 })
}
