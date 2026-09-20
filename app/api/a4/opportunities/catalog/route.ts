import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { fetchChileTrabajosOpportunities } from '@/lib/opportunities/sources/chiletrabajos'
import { catalogFromJobs } from '@/lib/opportunities/taxonomy'
export const runtime='nodejs'; export const dynamic='force-dynamic'
const SEEDS=['Santiago','Valparaíso','Concepción','Antofagasta','Puerto Montt']
export async function GET(){const user=await resolveServerUser();if(!user)return NextResponse.json({error:'No autenticado'},{status:401});const supabase=createAdminClient();const access=await checkA4Access(user.id,supabase);if(!access.canAccess)return NextResponse.json({error:getA4AccessDenialMessage(),code:access.reason},{status:403});
 const batches=await Promise.allSettled(SEEDS.map(location=>fetchChileTrabajosOpportunities('',location,12)));const seen=new Set<string>();const jobs=[] as Awaited<ReturnType<typeof fetchChileTrabajosOpportunities>>;for(const batch of batches){if(batch.status!=='fulfilled')continue;for(const job of batch.value){if(!seen.has(job.originalUrl)){seen.add(job.originalUrl);jobs.push(job)}}}const catalog=catalogFromJobs(jobs)
 return NextResponse.json({source:'chiletrabajos',fetched_at:new Date().toISOString(),coverage:{locations:SEEDS,verified_jobs:jobs.length},total:jobs.length,areas:catalog.areas,roles:catalog.roles.slice(0,50)})}
