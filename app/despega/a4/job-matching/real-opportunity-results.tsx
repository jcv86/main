'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, MapPin, CalendarDays, SearchX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OpportunityProfileEvidence } from './opportunity-search-experience'
import { Button } from '@/components/ui/button'

interface Opportunity {sourceId:string;title:string;company:string;location:string|null;publishedAt:string|null;expiresAt:string|null;originalUrl:string;verificationStatus:'verified_active';description?:string|null;requirements?:string[];skills?:string[];source?:string}
interface Payload {needs_intent:boolean;mode?:'available_now';count?:number;source?:string;fetched_at?:string;query_plan?:string[];intent?:{target_roles:string[];breadth:string;locations:string[];work_modes:string[]};opportunities:Opportunity[]}

const normalize=(value:string)=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ')
function evidenceFor(job:Opportunity,profile?:OpportunityProfileEvidence|null){
 const published=[job.title,...(job.requirements||[]),...(job.skills||[])].map(normalize).join(' ')
 const strengths=(profile?.strengths||[]).filter(item=>{const terms=normalize(item).split(/\s+/).filter(x=>x.length>=4);return terms.some(term=>published.includes(term))}).slice(0,3)
 const roleAligned=profile?.targetRole?normalize(job.title).includes(normalize(profile.targetRole))||normalize(profile.targetRole).includes(normalize(job.title)):false
 const gaps=(profile?.missingProof||[]).filter(item=>{const terms=normalize(item).split(/\s+/).filter(x=>x.length>=4);return terms.some(term=>published.includes(term))}).slice(0,3)
 return {strengths,roleAligned,gaps}
}

export function RealOpportunityResults({refreshKey=0,profileEvidence}:{refreshKey?:number;profileEvidence?:OpportunityProfileEvidence|null}) {
 const [data,setData]=useState<Payload|null>(null)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState<string|null>(null)
 useEffect(()=>{let active=true;(async()=>{setLoading(true);try{const r=await fetch('/api/a4/opportunities/for-me',{cache:'no-store'});const body=await r.json();if(!r.ok)throw new Error(body.error||'No pudimos cargar las oportunidades.');if(active){setData(body);setError(null)}}catch(e){if(active)setError(e instanceof Error?e.message:'No pudimos cargar las oportunidades.')}finally{if(active)setLoading(false)}})();return()=>{active=false}},[refreshKey])
 if(loading)return <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"><div className="mx-auto mb-3 h-8 w-8 animate-pulse rounded-full bg-[hsl(var(--dtc-indigo-900))]"/><p className="text-sm font-medium text-foreground">Buscando oportunidades…</p></div>
 if(error)return <Card className="border-border bg-card shadow-sm"><CardContent className="pt-6"><p className="font-medium text-foreground">No pudimos cargar las oportunidades.</p><p className="mt-1 text-sm text-muted-foreground">Intenta nuevamente en unos minutos.</p></CardContent></Card>
 if(!data)return null
 return <section className="space-y-5" aria-labelledby="real-jobs-heading">
  <div><h2 id="real-jobs-heading" className="text-2xl font-semibold tracking-tight text-foreground">{data.needs_intent?'Oportunidades disponibles ahora':'Oportunidades para ti'}</h2>{data.opportunities.length>0&&<p className="mt-1 text-sm text-muted-foreground">{data.count||0} oportunidades encontradas</p>}</div>
  {data.opportunities.length===0?<Card className="border-dashed border-border bg-card shadow-none"><CardContent className="flex flex-col items-center px-6 py-10 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted"><SearchX className="h-5 w-5 text-muted-foreground"/></div><p className="font-semibold text-foreground">No encontramos coincidencias con estos filtros</p><p className="mt-2 max-w-lg text-sm text-muted-foreground">Prueba quitando un filtro o eligiendo otra área. Las sugerencias de arriba se construyen con oportunidades verificadas disponibles.</p></CardContent></Card>:<div className="grid gap-4">{data.opportunities.map(job=><Card key={job.originalUrl} className="group overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md"><CardHeader className="pb-3"><CardTitle className="text-xl tracking-tight text-foreground">{job.title}</CardTitle><p className="mt-1 text-sm font-medium text-muted-foreground">{job.company}</p></CardHeader><CardContent className="space-y-4">
   <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">{job.location&&<span className="flex items-center gap-1"><MapPin className="h-4 w-4"/>{job.location}</span>}{job.publishedAt&&<span className="flex items-center gap-1"><CalendarDays className="h-4 w-4"/>{job.publishedAt.split(' ')[0]}</span>}</div>
   {(job.description||job.requirements?.length||job.skills?.length)?<div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Evidencia publicada por la fuente</p>
    {job.description&&<p className="line-clamp-4 text-sm leading-relaxed text-foreground">{job.description}</p>}
    {job.requirements?.length?<div><p className="text-sm font-semibold text-foreground">Requisitos informados</p><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{job.requirements.slice(0,4).map(item=><li key={item}>• {item}</li>)}</ul></div>:null}
    {job.skills?.length?<div className="flex flex-wrap gap-2">{job.skills.slice(0,8).map(skill=><span key={skill} className="rounded-full bg-background px-2.5 py-1 text-xs text-foreground">{skill}</span>)}</div>:null}
   </div>:<p className="text-xs text-muted-foreground">Esta fuente no entregó requisitos estructurados. Revisa la publicación original antes de decidir.</p>}
   {(()=>{const evidence=evidenceFor(job,profileEvidence);return (evidence.roleAligned||evidence.strengths.length||evidence.gaps.length)?<div className="grid gap-3 sm:grid-cols-2">
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
     <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Lo que sí podemos conectar</p>
     <ul className="mt-2 space-y-1 text-sm text-foreground">{evidence.roleAligned?<li>• El cargo se alinea con tu objetivo registrado.</li>:null}{evidence.strengths.map(item=><li key={item}>• Evidencia de tu perfil relacionada: {item}</li>)}</ul>
    </div>
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
     <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">Antes de postular</p>
     {evidence.gaps.length?<ul className="mt-2 space-y-1 text-sm text-foreground">{evidence.gaps.map(item=><li key={item}>• Falta evidencia registrada sobre: {item}</li>)}</ul>:<p className="mt-2 text-sm text-foreground">{profileEvidence?.nextBestActions?.[0]||'Confirma en la publicación original los requisitos que no estén estructurados.'}</p>}
    </div>
   </div>:null})()}
   <Button asChild className="bg-[hsl(var(--dtc-indigo-900))] text-white hover:opacity-90"><a href={job.originalUrl} target="_blank" rel="noopener noreferrer">Ver oferta <ExternalLink className="ml-2 h-4 w-4"/></a></Button>
  </CardContent></Card>)}</div>}
 </section>
}
