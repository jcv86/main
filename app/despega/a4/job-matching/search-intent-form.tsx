'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { opportunityFilterParams, type OpportunityFilters } from '@/lib/opportunities/search-query'

const REGIONS = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Metropolitana', 'O’Higgins', 'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes']
const MODES = [['onsite', 'Presencial'], ['hybrid', 'Híbrido'], ['remote', 'Remoto']] as const
interface Catalog {
  total: number
  inventory_status: 'ready' | 'empty'
  scope?: { limit: number; limitReached: boolean }
  areas: { label: string; count: number }[]
  roles: { label: string; count: number }[]
}
interface Props {
  value: OpportunityFilters
  applied: OpportunityFilters
  role: string
  onRoleChange: (value: string) => void
  seedRole?: string | null
  onChange: (value: OpportunityFilters) => void
  onApply: (value: OpportunityFilters) => void
  onSaved: () => void
  saving: boolean
  onSavingChange: (value: boolean) => void
}

export function SearchIntentForm({ value, applied, role, onRoleChange: setRole, seedRole, onChange, onApply, onSaved, saving, onSavingChange }: Props) {
  const [message, setMessage] = useState<string | null>(null)
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [catalogError, setCatalogError] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  const query = opportunityFilterParams(value).toString()
  const dirty = JSON.stringify(value) !== JSON.stringify(applied) || Boolean(role.trim())
  const anyMode = !value.workModes.length || MODES.every(([mode]) => value.workModes.includes(mode))

  useEffect(() => {
    const controller = new AbortController()
    setCatalog(null); setCatalogError(false); setCatalogLoading(true)
    fetch('/api/a4/opportunities/catalog?' + query, { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Catalog unavailable')
        return response.json()
      }).then(body => { if (!controller.signal.aborted) setCatalog(body) })
      .catch(() => { if (!controller.signal.aborted) setCatalogError(true) })
      .finally(() => { if (!controller.signal.aborted) setCatalogLoading(false) })
    return () => controller.abort()
  }, [query, retry])

  function update(patch: Partial<OpportunityFilters>) {
    onChange({ ...value, ...patch }); setMessage(null)
  }
  function withRole(): OpportunityFilters | null {
    const text = role.trim()
    if (!text) return value
    if (text.length > 200) { setMessage('El cargo puede tener hasta 200 caracteres.'); return null }
    const roles = value.targetRoles.some(item => item.toLowerCase() === text.toLowerCase()) ? value.targetRoles : [...value.targetRoles, text]
    if (roles.length > 8) { setMessage('Puedes elegir hasta ocho cargos o áreas.'); return null }
    return { ...value, targetRoles: roles }
  }
  function addRole(text = role) {
    const trimmed = text.trim()
    if (!trimmed) return
    if (value.targetRoles.some(item => item.toLowerCase() === trimmed.toLowerCase())) { setRole(''); return }
    if (value.targetRoles.length >= 8) { setMessage('Puedes elegir hasta ocho cargos o áreas.'); return }
    update({ targetRoles: [...value.targetRoles, trimmed.slice(0, 200)] }); setRole('')
  }
  function apply(event: FormEvent) {
    event.preventDefault()
    const next = withRole()
    if (!next) return
    setRole(''); setMessage(null); onChange(next); onApply(next)
  }
  async function save() {
    const next = withRole()
    if (!next) return
    if (!next.targetRoles.length) { setMessage('Para guardar, agrega al menos un cargo o área. Puedes explorar sin elegir uno.'); return }
    onSavingChange(true); setMessage(null)
    try {
      const response = await fetch('/api/a4/search-intents', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...next, isPrimary: true }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'No pudimos guardar tu búsqueda.')
      setRole(''); onChange(next); onSaved()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No pudimos guardar tu búsqueda.')
    } finally { onSavingChange(false) }
  }
  function toggleRegion(region: string) {
    if (!value.locations.includes(region) && value.locations.length >= 6) {
      setMessage('Puedes elegir hasta seis regiones o usar Todas las regiones.'); return
    }
    update({ locations: value.locations.includes(region) ? value.locations.filter(item => item !== region) : [...value.locations, region] })
  }

  return <Card className="border-border/80 bg-card shadow-sm">
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl tracking-tight">Explorar ofertas</CardTitle>
      <p className="text-sm text-muted-foreground">Prueba cargos, regiones y modalidades. Explorar no cambia tu búsqueda guardada.</p>
    </CardHeader>
    <CardContent>
      <form onSubmit={apply} className="space-y-5">
        <fieldset disabled={saving} className="min-w-0 space-y-5 disabled:opacity-70">
          <div className="space-y-3">
            <label htmlFor="opportunity-role" className="text-sm font-semibold">Cargos o áreas</label>
            <div className="flex gap-2">
              <input id="opportunity-role" value={role} maxLength={200} onChange={event => setRole(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addRole() } }} placeholder="Todos los cargos, o escribe uno…" list="opportunity-role-options" className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <datalist id="opportunity-role-options">{catalog?.roles.map(item => <option key={item.label} value={item.label} />)}</datalist>
              <Button type="button" variant="outline" className="min-h-11" onClick={() => addRole()}>Agregar</Button>
            </div>
            {seedRole && !value.targetRoles.includes(seedRole) && <button type="button" onClick={() => addRole(seedRole)} className="min-h-11 max-w-full rounded-lg px-2 text-left text-sm text-muted-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Usar mi cargo objetivo: {seedRole}</button>}
            {!!catalog?.areas.length && <div className="flex flex-wrap gap-2" aria-label="Áreas disponibles">{catalog.areas.map(item => <button type="button" key={item.label} onClick={() => addRole(item.label)} className="min-h-11 rounded-full border border-border bg-muted/40 px-3 py-2 text-left text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.label} ({item.count})</button>)}</div>}
            {!!value.targetRoles.length && <div className="flex flex-wrap gap-2" aria-label="Cargos elegidos">{value.targetRoles.map(item => <button type="button" key={item} onClick={() => update({ targetRoles: value.targetRoles.filter(role => role !== item) })} aria-label={'Quitar ' + item} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="min-w-0 break-words">{item}</span><X className="h-4 w-4 shrink-0" /></button>)}</div>}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <fieldset className="min-w-0 space-y-2"><legend className="mb-2 text-sm font-semibold">Regiones</legend>
              <p className="break-words text-sm text-muted-foreground">{value.locations.length ? value.locations.join(', ') : 'Todas las regiones'}</p>
              <details className="rounded-xl border border-border bg-background p-3"><summary className="min-h-11 cursor-pointer rounded-md py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Elegir regiones</summary>
                <button type="button" onClick={() => update({ locations: [] })} className="min-h-11 px-2 text-left text-sm underline">Todas las regiones</button>
                <div className="max-h-64 overflow-y-auto">{REGIONS.map(region => <label key={region} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted"><input type="checkbox" checked={value.locations.includes(region)} onChange={() => toggleRegion(region)} className="h-4 w-4 min-h-0 min-w-0 shrink-0 accent-[hsl(var(--dtc-indigo-900))]" />{region}</label>)}</div>
              </details>
            </fieldset>
            <fieldset className="min-w-0 space-y-1"><legend className="mb-2 text-sm font-semibold">Modalidad</legend>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted"><input type="checkbox" checked={anyMode} onChange={() => update({ workModes: [] })} className="h-4 w-4 min-h-0 min-w-0 shrink-0 accent-[hsl(var(--dtc-indigo-900))]" />Cualquier modalidad</label>
              {MODES.map(([mode, label]) => <label key={mode} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted"><input type="checkbox" checked={value.workModes.includes(mode)} onChange={() => update({ workModes: value.workModes.includes(mode) ? value.workModes.filter(item => item !== mode) : [...value.workModes, mode] })} className="h-4 w-4 min-h-0 min-w-0 shrink-0 accent-[hsl(var(--dtc-indigo-900))]" />{label}</label>)}
            </fieldset>
          </div>
          <div className="flex flex-wrap items-center gap-3"><label htmlFor="search-breadth" className="text-sm font-semibold">Afinidad del cargo</label><select id="search-breadth" value={value.breadth} onChange={event => update({ breadth: event.target.value as OpportunityFilters['breadth'] })} className="min-h-11 max-w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="precise">Cargo exacto</option><option value="related">Cargos relacionados</option><option value="exploratory">También áreas cercanas</option></select><Button type="button" variant="ghost" className="min-h-11" onClick={() => { setRole(''); update({ targetRoles: [], locations: [], workModes: [], breadth: 'related' }) }}>Limpiar filtros</Button></div>
        </fieldset>
        <div className="space-y-2 border-t border-border pt-4" aria-live="polite">
          {dirty && <p className="text-sm font-medium">Tienes cambios sin aplicar. Pulsa Ver ofertas para actualizar los resultados.</p>}
          {role.trim() ? <p className="text-sm text-muted-foreground">Agrega el cargo o pulsa Ver ofertas para comprobarlo.</p> : catalogLoading ? <p className="text-sm text-muted-foreground">Comprobando disponibilidad de estos filtros…</p> : catalogError ? <p className="text-sm text-muted-foreground">No pudimos comprobar la disponibilidad. <button type="button" onClick={() => setRetry(value => value + 1)} className="min-h-11 underline">Reintentar</button></p> : catalog && <p className="text-sm text-muted-foreground">{catalog.inventory_status === 'empty' ? 'El catálogo no tiene ofertas verificadas disponibles ahora.' : `${catalog.total} ofertas disponibles con los filtros del formulario${catalog.scope?.limitReached ? ' en el catálogo consultado' : ''}.`}</p>}
          {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row"><Button type="submit" disabled={saving} className="min-h-11 bg-[#3730a3] text-white hover:bg-[#312e81] hover:text-white"><Search className="mr-2 h-4 w-4" />Ver ofertas</Button><Button type="button" variant="outline" disabled={saving} className="min-h-11" onClick={save}>{saving ? 'Guardando…' : 'Guardar como mi búsqueda'}</Button></div>
        <p className="text-xs leading-relaxed text-muted-foreground">Guardar actualiza tu búsqueda principal. Ver ofertas y limpiar filtros no la modifican.</p>
      </form>
    </CardContent>
  </Card>
}
