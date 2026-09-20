import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { fetchChileTrabajosOpportunities } from '@/lib/opportunities/sources/chiletrabajos'
import { catalogFromJobs } from '@/lib/opportunities/taxonomy'
export const runtime='nodejs'; export const dynamic='force-dynamic'
export async function GET(){const user=await resolveServerUser();if(!user)return NextResponse.json({error:'No autenticado'},{status:401});const supabase=createAdminClient();const access=await checkA4Access(user.id,supabase);if(!access.canAccess)return NextResponse.json({error:getA4AccessDenialMessage(),code:access.reason},{status:403});
 const jobs=await fetchChileTrabajosOpportunities('','Santiago',20);const roles=new Map<string,number>();const areas=new Map<string,number>();for(const job of jobs){const role=normalizeRoleTitle(job.title);roles.set(role,(roles.get(role)||0)+1);const area=categorizeOpportunity(job.title).label;areas.set(area,(areas.get(area)||0)+1)}
 return NextResponse.json({source:'chiletrabajos',fetched_at:new Date().toISOString(),total:jobs.length,areas:[...areas].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count),roles:[...roles].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count).slice(0,30)})}
