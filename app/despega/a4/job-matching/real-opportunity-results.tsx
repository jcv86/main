'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, MapPin, CalendarDays, SearchX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Opportunity {sourceId:string;title:string;company:string;location:string|null;publishedAt:string|null;expiresAt:string|null;originalUrl:string;verificationStatus:'verified_active'}
interface Payload {needs_intent:boolean;mode?:'available_now';count?:number;source?:string;fetched_at?:string;query_plan?:string[];intent?:{target_roles:string[];breadth:string;locations:string[];work_modes:string[]};opportunities:Opportunity[]}

export function RealOpportunityResults({refreshKey=0}:{refreshKey?:number}) {
 const [data,setData]=useState<Payload|null>(null)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState<string|null>(null)
 useEffect(()=>{let active=true;(async()=>{setLoading(true);try{const r=await fetch('/api/a4/opportunities/for-me',{cache:'no-store'});const body=await r.json();if(!r.ok)throw new Error(body.error||'No pudimos cargar las oportunidades.');if(active){setData(body);setError(null)}}catch(e){if(active)setError(e instanceof Error?e.message:'No pudimos cargar las oportunidades.')}finally{if(active)setLoading(false)}})();return()=>{active=false}},[refreshKey])
 if(loading)return <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"><div className="mx-auto mb-3 h-8 w-8 animate-pulse rounded-full bg-[hsl(var(--dtc-indigo-900))]"/><p className="text-sm font-medium text-foreground">Buscando oportunidades…</p></div>
 if(error)return <Card className="border-border bg-card shadow-sm"><CardContent className="pt-6"><p className="font-medium text-foreground">No pudimos cargar las oportunidades.</p><p className="mt-1 text-sm text-muted-foreground">Intenta nuevamente en unos minutos.</p></CardContent></Card>
 if(!data)return null
 return <section className="space-y-5" aria-labelledby="real-jobs-heading">
  <div><h2 id="real-jobs-heading" className="text-2xl font-semibold tracking-tight text-foreground">{data.needs_intent?'Oportunidades disponibles ahora':'Oportunidades para ti'}</h2>{data.opportunities.length>0&&<p className="mt-1 text-sm text-muted-foreground">{data.count||0} oportunidades encontradas</p>}</div>
  {data.opportunities.length===0?<Card className="border-dashed border-border bg-card shadow-none"><CardContent className="flex flex-col items-center px-6 py-10 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted"><SearchX className="h-5 w-5 text-muted-foreground"/></div><p className="font-semibold text-foreground">No encontramos oportunidades disponibles en este momento</p><p className="mt-2 max-w-lg text-sm text-muted-foreground">Vuelve a intentarlo más tarde o configura una búsqueda para explorar otras opciones.</p></CardContent></Card>:<div className="grid gap-4">{data.opportunities.map(job=><Card key={job.originalUrl} className="group overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md"><CardHeader className="pb-3"><CardTitle className="text-xl tracking-tight text-foreground">{job.title}</CardTitle><p className="mt-1 text-sm font-medium text-muted-foreground">{job.company}</p></CardHeader><CardContent className="space-y-4">
   <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">{job.location&&<span className="flex items-center gap-1"><MapPin className="h-4 w-4"/>{job.location}</span>}{job.publishedAt&&<span className="flex items-center gap-1"><CalendarDays className="h-4 w-4"/>{job.publishedAt.split(' ')[0]}</span>}</div>
   <Button asChild className="bg-[hsl(var(--dtc-indigo-900))] text-white hover:opacity-90"><a href={job.originalUrl} target="_blank" rel="noopener noreferrer">Ver oferta <ExternalLink className="ml-2 h-4 w-4"/></a></Button>
  </CardContent></Card>)}</div>}
 </section>
}
