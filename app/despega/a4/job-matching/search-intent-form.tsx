'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { opportunityFilterParams, type OpportunityFilters } from '@/lib/opportunities/search-query'
import { completeOpportunityFilters, parseLaborObjective } from '@/lib/opportunities/labor-objective'
import { confirmedSavedSearch, emptySearchFilters, sameSearchFilters, type SavedPrimarySearch } from '@/lib/opportunities/saved-search'
import { INDUSTRY_OPTIONS } from '@/lib/opportunities/employer-industry'
import { OPPORTUNITY_CATEGORIES, resolveOpportunityCategory } from '@/lib/opportunities/taxonomy'

const REGIONS = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Metropolitana', 'O’Higgins', 'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes']
const MODES = [['onsite', 'Presencial'], ['hybrid', 'Híbrido'], ['remote', 'Remoto']] as const
interface Catalog {
  total: number
  inventory_status: 'ready' | 'empty'
  scope?: { limit: number; limitReached: boolean }
  areas: { label: string; count: number }[]
  roles: { label: string; count: number }[]
  industries?: { label: string; count: number }[]
  industry_coverage?: { known: number; unknown: number; total: number }
}
interface Props {
  value: OpportunityFilters
  applied: OpportunityFilters
  role: string
  onRoleChange: (value: string) => void
  seedRole?: string | null
  onChange: (value: OpportunityFilters) => void
  onApply: (value: OpportunityFilters) => void
  onSaved: (search: SavedPrimarySearch) => void
  savedSearch: SavedPrimarySearch | null
  saveReady: boolean
  onConflict: () => void
  saving: boolean
  onSavingChange: (value: boolean) => void
  mode?: 'radar' | 'objective'
  saveEndpoint?: '/api/a4/search-intents' | '/api/career/objective'
}

export function SearchIntentForm({ value: inputValue, applied, role, onRoleChange: setRole, seedRole, onChange, onApply, onSaved, saving, onSavingChange, savedSearch, saveReady, onConflict, mode = 'radar', saveEndpoint = '/api/a4/search-intents' }: Props) {
  const objectiveOnly = mode === 'objective'
  const value = completeOpportunityFilters(inputValue)
  const [message, setMessage] = useState<string | null>(null)
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [catalogError, setCatalogError] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [retry, setRetry] = useState(0)
  const query = opportunityFilterParams(value).toString()
  const dirty = !sameSearchFilters(value, objectiveOnly ? savedSearch?.filters ?? emptySearchFilters() : applied) || Boolean(role.trim())
  const availableAreas = [...new Set([...(objectiveOnly ? OPPORTUNITY_CATEGORIES.map(item => item.label) : catalog?.areas.map(item => item.label) ?? []), ...value.functionalAreas])]
  const anyMode = !value.workModes.length || MODES.every(([mode]) => value.workModes.includes(mode))

  useEffect(() => {
    if (objectiveOnly) { setCatalog(null); setCatalogLoading(false); return }
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
  }, [query, retry, objectiveOnly])

  function update(patch: Partial<OpportunityFilters>) {
    onChange({ ...value, ...patch }); setMessage(null)
  }
  function withRole(): OpportunityFilters | null {
    const text = role.trim()
    if (!text) { try { return parseLaborObjective(value as unknown as Record<string, unknown>) } catch (error) { setMessage((error as Error).message); return null } }
    if (text.length > 200) { setMessage('El cargo puede tener hasta 200 caracteres.'); return null }
    const roles = value.targetRoles.some(item => item.toLowerCase() === text.toLowerCase()) ? value.targetRoles : [...value.targetRoles, text]
    if (roles.length > 8) { setMessage('Puedes elegir hasta ocho cargos.'); return null }
    const area = resolveOpportunityCategory(text)
    try { return parseLaborObjective({ ...value, targetRoles: area ? value.targetRoles : roles,
      functionalAreas: area ? [...new Set([...value.functionalAreas, area.label])] : value.functionalAreas }) }
    catch (error) { setMessage((error as Error).message); return null }
  }
  function addRole(text = role) {
    const trimmed = text.trim()
    if (!trimmed) return
    if (value.targetRoles.some(item => item.toLowerCase() === trimmed.toLowerCase())) { setRole(''); return }
    if (trimmed.length > 200) { setMessage('El cargo puede tener hasta 200 caracteres.'); return }
    const area = resolveOpportunityCategory(trimmed)
    if (area) { if (!value.functionalAreas.includes(area.label)) toggleList('functionalAreas', area.label); setRole(''); return }
    if (value.targetRoles.length >= 8) { setMessage('Puedes elegir hasta ocho cargos.'); return }
    update({ targetRoles: [...value.targetRoles, trimmed] }); setRole('')
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
    if (!saveReady) { setMessage('Recupera primero tu objetivo guardado antes de reemplazarlo. Tu borrador se conserva.'); return }
    try { parseLaborObjective(next as unknown as Record<string, unknown>, true) } catch (error) { setMessage((error as Error).message); return }
    onSavingChange(true); setMessage(null)
    try {
      const response = await fetch(saveEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...next, isPrimary: true, expectedRevision: savedSearch?.revision ?? null }),
      })
      const body = await response.json()
      if (response.status === 409) onConflict()
      if (!response.ok) throw new Error(body.error || 'No pudimos guardar tu objetivo.')
      const confirmed = confirmedSavedSearch(body, next, savedSearch)
      setRole(''); onChange(confirmed.filters); onSaved(confirmed)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No pudimos guardar tu búsqueda.')
    } finally { onSavingChange(false) }
  }
  function toggleRegion(region: string) {
    if (!value.locations.includes(region) && value.locations.length >= 6) {
      setMessage('Puedes elegir hasta seis regiones o usar Todas las regiones.'); return
    }
    const locations = value.locations.includes(region) ? value.locations.filter(item => item !== region) : [...value.locations, region]
    update({ locations, locationPreference: locations.length ? 'selected' : 'unspecified' })
  }
  function toggleList(key: 'functionalAreas' | 'industries' | 'excludedIndustries', item: string) {
    const selected = value[key]
    if (!selected.includes(item) && selected.length >= 8) { setMessage('Puedes elegir hasta ocho opciones en esta lista.'); return }
    update({ [key]: selected.includes(item) ? selected.filter(value => value !== item) : [...selected, item] })
  }

  return <Card className="border-border/80 bg-card shadow-sm">
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl tracking-tight">Define o explora tu próximo paso</CardTitle>
      <p className="text-sm text-muted-foreground">{objectiveOnly ? 'Elige el trabajo que te interesa, su área y el rubro de la empresa. Puedes guardar una exploración aunque todavía no tengas un cargo claro.' : 'Elige el trabajo que te interesa, su área y el rubro de la empresa. Tú decides qué aplicar y qué guardar.'}</p>
    </CardHeader>
    <CardContent>
      <form onSubmit={objectiveOnly ? event => { event.preventDefault(); void save() } : apply} className="space-y-5">
        <fieldset disabled={saving} className="min-w-0 space-y-5 disabled:opacity-70">
          <fieldset className="space-y-2"><legend className="text-sm font-semibold">¿Tienes claro qué trabajo buscas?</legend><div className="flex flex-wrap gap-3">{[['specific', 'Sé qué trabajo busco'], ['exploring', 'Todavía estoy explorando']].map(([stage, label]) => <label key={stage} className="flex min-h-11 min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-xl border border-border px-3 text-sm"><input type="radio" name="objective-stage" checked={value.objectiveStage === stage} onChange={() => update({ objectiveStage: stage as 'specific' | 'exploring' })} className="h-4 w-4 min-h-0 min-w-0 shrink-0" /><span className="min-w-0 break-words">{label}</span></label>)}</div></fieldset>
          <div className="space-y-3">
            <label htmlFor="opportunity-role" className="text-sm font-semibold">¿Qué cargo te gustaría conseguir?</label>
            <div className="flex gap-2">
              <input id="opportunity-role" value={role} maxLength={200} onChange={event => setRole(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addRole() } }} placeholder="Todos los cargos, o escribe uno…" list="opportunity-role-options" className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <datalist id="opportunity-role-options">{catalog?.roles.map(item => <option key={item.label} value={item.label} />)}</datalist>
              <Button type="button" variant="outline" className="min-h-11" onClick={() => addRole()}>Agregar</Button>
            </div>
            {seedRole && !value.targetRoles.includes(seedRole) && <button type="button" onClick={() => addRole(seedRole)} className="min-h-11 max-w-full rounded-lg px-2 text-left text-sm text-muted-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Usar mi cargo objetivo: {seedRole}</button>}
            {!!value.targetRoles.length && <div className="flex flex-wrap gap-2" aria-label="Cargos elegidos">{value.targetRoles.map(item => <button type="button" key={item} onClick={() => update({ targetRoles: value.targetRoles.filter(role => role !== item) })} aria-label={'Quitar ' + item} className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="min-w-0 break-words">{item}</span><X className="h-4 w-4 shrink-0" /></button>)}</div>}
          </div>
          <fieldset className="space-y-2"><legend className="mb-2 text-sm font-semibold">¿En qué área quieres trabajar?</legend><p className="text-xs text-muted-foreground">Es la función que realizarías. Si eliges cargo y área, deben coincidir ambos.</p><div className="flex flex-wrap gap-2" aria-label="Áreas disponibles">{availableAreas.map(area => <button type="button" key={area} aria-pressed={value.functionalAreas.includes(area)} onClick={() => toggleList('functionalAreas', area)} className={'min-h-11 max-w-full rounded-xl border px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' + (value.functionalAreas.includes(area) ? 'border-primary bg-primary/10 font-semibold' : 'border-border bg-muted/40')}>{area}{objectiveOnly ? '' : catalog?.areas.find(item => item.label === area) ? ` (${catalog.areas.find(item => item.label === area)!.count})` : ' · guardada'}</button>)}</div>{!objectiveOnly && !catalogLoading && !catalog?.areas.length && !value.functionalAreas.length && <p className="text-xs text-muted-foreground">Las áreas aparecerán cuando haya ofertas disponibles.</p>}</fieldset>
          <fieldset className="space-y-2"><legend className="text-sm font-semibold">¿En qué rubros te interesa trabajar?</legend><p className="text-xs text-muted-foreground">Es la actividad de la empresa: por ejemplo, finanzas en una minera. Sin selección, no tienes un rubro preferido.</p><div className="flex flex-wrap gap-2">{[...new Set([...(catalog?.industries?.map(item => item.label) ?? []), ...value.industries])].map(industry => <button key={industry} type="button" aria-pressed={value.industries.includes(industry)} onClick={() => toggleList('industries', industry)} className="min-h-11 max-w-full break-words rounded-xl border border-border px-3 text-left text-sm">{value.industries.includes(industry) ? '✓ ' : ''}{industry}</button>)}</div><label htmlFor="objective-industry" className="sr-only">Agregar rubro de interés</label><select id="objective-industry" value="" onChange={event => { if (event.target.value && !value.industries.includes(event.target.value)) toggleList('industries', event.target.value) }} className="min-h-11 max-w-full rounded-xl border border-input bg-background px-3 text-sm"><option value="">Agregar otro rubro de interés…</option>{INDUSTRY_OPTIONS.map(industry => <option key={industry} value={industry}>{industry}{objectiveOnly || catalog?.industries?.some(item => item.label === industry) ? '' : ' · sin ofertas confirmadas en esta consulta'}</option>)}</select>{!objectiveOnly && catalog?.industry_coverage && <p className="text-xs text-muted-foreground">Rubro respaldado en {catalog.industry_coverage.known} de {catalog.industry_coverage.total} ofertas consultadas para estas regiones y modalidades. Las demás están por confirmar.</p>}</fieldset>
          <details className="rounded-xl border border-border p-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">Preferencias adicionales de rubro</summary><fieldset><legend className="text-sm">Rubros que prefieres evitar</legend><div className="grid gap-1 sm:grid-cols-2">{[...new Set([...INDUSTRY_OPTIONS, ...value.excludedIndustries])].map(industry => <label key={industry} className="flex min-h-11 min-w-0 cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={value.excludedIndustries.includes(industry)} onChange={() => toggleList('excludedIndustries', industry)} className="h-4 w-4 min-h-0 min-w-0 shrink-0" /><span className="min-w-0 break-words">{industry}</span></label>)}</div></fieldset></details>
          {(value.industries.length > 0 || value.excludedIndustries.length > 0) && <fieldset className="space-y-2 rounded-xl border border-border p-3"><legend className="px-1 text-sm font-semibold">Si una oferta no tiene rubro confirmado</legend>{[['exclude', 'Mostrar sólo rubros confirmados'], ['include', 'Incluir también ofertas con rubro por confirmar']].map(([policy, label]) => <label key={policy} className="flex min-h-11 min-w-0 cursor-pointer items-center gap-2 text-sm"><input type="radio" name="unknown-industry" checked={value.unknownIndustryPolicy === policy} onChange={() => update({ unknownIndustryPolicy: policy as 'include' | 'exclude' })} className="h-4 w-4 min-h-0 min-w-0 shrink-0" /><span className="min-w-0 break-words">{label}</span></label>)}<p className="text-xs text-muted-foreground">Si incluyes rubros por confirmar, no podremos asegurar que cumplan tus preferencias o exclusiones.</p></fieldset>}
          <div className="grid gap-5 md:grid-cols-2">
            <fieldset className="min-w-0 space-y-2"><legend className="mb-2 text-sm font-semibold">Regiones</legend>
              <p className="break-words text-sm text-muted-foreground">{value.locations.length ? value.locations.join(', ') : value.locationPreference === 'any' ? 'Todas las regiones' : 'Ubicación por definir'}</p>
              <details className="rounded-xl border border-border bg-background p-3"><summary className="min-h-11 cursor-pointer rounded-md py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Elegir regiones</summary>
                <button type="button" onClick={() => update({ locations: [], locationPreference: 'any' })} className="min-h-11 px-2 text-left text-sm underline">Todas las regiones</button>
                <div className="max-h-64 overflow-y-auto">{REGIONS.map(region => <label key={region} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted"><input type="checkbox" checked={value.locations.includes(region)} onChange={() => toggleRegion(region)} className="h-4 w-4 min-h-0 min-w-0 shrink-0 accent-[hsl(var(--dtc-indigo-900))]" />{region}</label>)}</div>
              </details>
            </fieldset>
            <fieldset className="min-w-0 space-y-1"><legend className="mb-2 text-sm font-semibold">Modalidad</legend>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted"><input type="checkbox" checked={anyMode} onChange={() => update({ workModes: [] })} className="h-4 w-4 min-h-0 min-w-0 shrink-0 accent-[hsl(var(--dtc-indigo-900))]" />Cualquier modalidad</label>
              {MODES.map(([mode, label]) => <label key={mode} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm hover:bg-muted"><input type="checkbox" checked={value.workModes.includes(mode)} onChange={() => update({ workModes: value.workModes.includes(mode) ? value.workModes.filter(item => item !== mode) : [...value.workModes, mode] })} className="h-4 w-4 min-h-0 min-w-0 shrink-0 accent-[hsl(var(--dtc-indigo-900))]" />{label}</label>)}
            </fieldset>
          </div>
          <div className="flex flex-wrap items-center gap-3"><label htmlFor="search-breadth" className="text-sm font-semibold">Afinidad del cargo</label><select id="search-breadth" value={value.breadth} onChange={event => update({ breadth: event.target.value as OpportunityFilters['breadth'] })} className="min-h-11 max-w-full rounded-lg border border-input bg-background px-3 text-sm"><option value="precise">Cargo exacto</option><option value="related">Cargos relacionados</option><option value="exploratory">También áreas cercanas</option></select><Button type="button" variant="ghost" className="min-h-11" onClick={() => { setRole(''); update(emptySearchFilters()) }}>Limpiar filtros</Button></div>
        </fieldset>
        <div className="space-y-2 border-t border-border pt-4" aria-live="polite">
          {dirty && <p className="text-sm font-medium">{objectiveOnly ? 'Tienes cambios sin guardar.' : 'Tienes cambios sin aplicar. Pulsa Ver ofertas para actualizar los resultados.'}</p>}
          {!objectiveOnly && (role.trim() ? <p className="text-sm text-muted-foreground">Agrega el cargo o pulsa Ver ofertas para comprobarlo.</p> : catalogLoading ? <p className="text-sm text-muted-foreground">Comprobando disponibilidad de estos filtros…</p> : catalogError ? <p className="text-sm text-muted-foreground">No pudimos comprobar la disponibilidad. <button type="button" onClick={() => setRetry(value => value + 1)} className="min-h-11 underline">Reintentar</button></p> : catalog && <p className="text-sm text-muted-foreground">{catalog.inventory_status === 'empty' ? 'El catálogo no tiene ofertas verificadas disponibles ahora.' : `${catalog.total} ofertas disponibles con los filtros del formulario${catalog.scope?.limitReached ? ' en el catálogo consultado' : ''}.`}</p>)}
          {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">{!objectiveOnly && <Button type="submit" disabled={saving} className="min-h-11 bg-[#3730a3] text-white hover:bg-[#312e81] hover:text-white"><Search className="mr-2 h-4 w-4" />Ver ofertas</Button>}<Button type="button" variant="outline" disabled={saving || !saveReady} className="min-h-11" onClick={save}>{saving ? 'Guardando…' : 'Guardar mi objetivo'}</Button></div>
        <p className="text-xs leading-relaxed text-muted-foreground">{objectiveOnly ? 'Guardar confirma tu objetivo. Se conservan las otras preferencias guardadas. Limpiar el formulario no cambia lo guardado hasta que lo confirmes.' : 'Guardar confirma tu objetivo. Las otras preferencias guardadas se conservan. Ver ofertas y limpiar filtros no la modifican.'}</p>
      </form>
    </CardContent>
  </Card>
}
