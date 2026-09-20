'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, MapPin, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Opportunity {sourceId:string;title:string;company:string;location:string|null;publishedAt:string|null;expiresAt:string|null;originalUrl:string;verificationStatus:'verified_active'}
interface Payload {needs_intent:boolean;count?:number;source?:string;fetched_at?:string;query_plan?:string[];intent?:{target_roles:string[];breadth:string;locations:string[];work_modes:string[]};opportunities:Opportunity[]}

export function RealOpportunityResults({refreshKey=0}:{refreshKey?:number}) {
 const [data,setData]=useState<Payload|null>(null)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState<string|null>(null)
 useEffect(()=>{let active=true;(async()=>{setLoading(true);try{const r=await fetch('/api/a4/opportunities/for-me',{cache:'no-store'});const body=await r.json();if(!r.ok)throw new Error(body.error||'No pudimos cargar oportunidades.');if(active){setData(body);setError(null)}}catch(e){if(active)setError(e instanceof Error?e.message:'No pudimos cargar oportunidades.')}finally{if(active)setLoading(false)}})();return()=>{active=false}},[refreshKey])
 if(loading)return <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">Buscando publicaciones vigentes en fuentes verificables…</div>
 if(error)return <Card className="border-amber-200 bg-amber-50"><CardContent className="pt-6 text-sm text-amber-900">{error}</CardContent></Card>
 if(!data||data.needs_intent)return <Card><CardContent className="pt-6 text-sm text-slate-600">Confirma primero qué tipo de oportunidad quieres encontrar. No buscamos ni recomendamos cargos sin esa dirección.</CardContent></Card>
 return <section className="space-y-5" aria-labelledby="real-jobs-heading">
  <div><h2 id="real-jobs-heading" className="text-2xl font-semibold text-slate-900">Oportunidades encontradas para tu búsqueda</h2><p className="mt-1 text-sm text-slate-600">{data.count||0} publicaciones activas verificadas ahora. Fuente actual: Chiletrabajos. DTC no garantiza encaje ni resultado de una postulación.</p></div>
  {data.opportunities.length===0?<Card><CardContent className="pt-6 text-sm text-slate-600">No encontramos publicaciones verificables para esta búsqueda en este momento. Puedes ampliar la dirección o volver a intentar más tarde.</CardContent></Card>:<div className="grid gap-4">{data.opportunities.map(job=><Card key={job.originalUrl} className="border-slate-200"><CardHeader className="pb-3"><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-xl">{job.title}</CardTitle><p className="mt-1 font-medium text-slate-700">{job.company}</p></div><Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800"><ShieldCheck className="mr-1 h-3.5 w-3.5"/>Publicación activa</Badge></div></CardHeader><CardContent className="space-y-4">
   <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">{job.location&&<span className="flex items-center gap-1"><MapPin className="h-4 w-4"/>{job.location}</span>}{job.publishedAt&&<span>Publicada: {job.publishedAt.split(' ')[0]}</span>}{job.expiresAt&&<span>Expira: {job.expiresAt.split(' ')[0]}</span>}</div>
   <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><p className="font-semibold text-slate-900">Por qué apareció</p><p className="mt-1">Coincide con una consulta derivada de los cargos que tú confirmaste. Todavía no afirmamos compatibilidad de habilidades porque esta fuente no entrega suficiente evidencia estructurada para hacerlo con rigor.</p></div>
   <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800"><a href={job.originalUrl} target="_blank" rel="noopener noreferrer">Ver publicación original <ExternalLink className="ml-2 h-4 w-4"/></a></Button>
  </CardContent></Card>)}</div>}
 </section>
}
