'use client'

import { FormEvent, useState } from 'react'
import { Search, MapPin, BriefcaseBusiness } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SearchIntentForm({seedRole,onSaved}:{seedRole?:string|null;onSaved?:()=>void}) {
 const [role,setRole]=useState(seedRole?.trim()||'')
 const [location,setLocation]=useState('Santiago')
 const [mode,setMode]=useState('flexible')
 const [saving,setSaving]=useState(false)
 const [message,setMessage]=useState<string|null>(null)

 async function submit(event:FormEvent){event.preventDefault();setMessage(null);const target=role.trim();if(!target){setMessage('Escribe el cargo o área que buscas.');return}setSaving(true)
  try{const response=await fetch('/api/a4/search-intents',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({targetRoles:[target],breadth:'related',locations:location.trim()?[location.trim()]:[],workModes:mode==='flexible'?['onsite','hybrid','remote']:[mode],isPrimary:true})});const data=await response.json();if(!response.ok)throw new Error(data.error||'No pudimos realizar la búsqueda.');onSaved?.()}
  catch(error){setMessage(error instanceof Error?error.message:'No pudimos realizar la búsqueda.')}finally{setSaving(false)}
 }
 return <Card className="overflow-hidden border-border/80 bg-card shadow-sm">
  <CardHeader className="pb-5">
   <div className="flex items-start gap-3">
    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--dtc-indigo-900))] text-white sm:flex"><Search className="h-5 w-5"/></div>
    <div><CardTitle className="text-2xl tracking-tight">¿Qué trabajo estás buscando?</CardTitle><p className="mt-1 text-sm text-muted-foreground">Busca por cargo o área y ajusta tus preferencias.</p></div>
   </div>
  </CardHeader>
  <CardContent><form onSubmit={submit} className="space-y-5">
   <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,.8fr)_minmax(220px,.8fr)_auto] lg:items-end">
    <div><label className="text-sm font-medium text-foreground">Cargo o área</label><div className="relative mt-2"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><input value={role} onChange={e=>setRole(e.target.value)} placeholder="Ej.: Analista de Riesgo, Finanzas…" className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"/></div></div>
    <div><label className="text-sm font-medium text-foreground">Ubicación</label><div className="relative mt-2"><MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Ciudad o región" className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"/></div></div>
    <div><label className="text-sm font-medium text-foreground">Modalidad</label><div className="relative mt-2"><BriefcaseBusiness className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><select value={mode} onChange={e=>setMode(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"><option value="flexible">Cualquier modalidad</option><option value="onsite">Presencial</option><option value="hybrid">Híbrido</option><option value="remote">Remoto</option></select></div></div>
    <Button disabled={saving} className="h-11 rounded-xl bg-[hsl(var(--dtc-indigo-900))] px-6 text-white hover:opacity-90"><Search className="mr-2 h-4 w-4"/>{saving?'Buscando…':'Buscar oportunidades'}</Button>
   </div>
   {message&&<p role="status" className="text-sm text-destructive">{message}</p>}
  </form></CardContent>
 </Card>
}
