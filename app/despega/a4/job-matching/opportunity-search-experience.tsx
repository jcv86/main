'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { copyOpportunityFilters, type OpportunityFilters, type OpportunityView } from '@/lib/opportunities/search-query'
import { emptySearchFilters, primarySearchFromResponse, sameSearchFilters, type SavedPrimarySearch } from '@/lib/opportunities/saved-search'
import { objectiveSummary } from '@/lib/opportunities/labor-objective'
import { SearchIntentForm } from './search-intent-form'
import { RealOpportunityResults } from './real-opportunity-results'

export function OpportunitySearchExperience({ seedRole, mode = 'radar' }: { seedRole?: string | null; mode?: 'radar' | 'objective' }) {
  const objectiveOnly = mode === 'objective'
  const endpoint = objectiveOnly ? '/api/career/objective' : '/api/a4/search-intents'
  const [view, setView] = useState<OpportunityView>('explore')
  const [draft, setDraft] = useState(emptySearchFilters)
  const [pendingRole, setPendingRole] = useState('')
  const [applied, setApplied] = useState(emptySearchFilters)
  const [refreshKey, setRefreshKey] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedSearch, setSavedSearch] = useState<SavedPrimarySearch | null>(null)
  const [readStatus, setReadStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [readError, setReadError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)
  const draftVersion = useRef(0)
  const initialized = useRef(false)
  useEffect(() => {
    const controller = new AbortController()
    const startedWith = draftVersion.current
    setReadStatus('loading'); setReadError(null)
    fetch(endpoint, { cache: 'no-store', signal: controller.signal }).then(async response => {
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'No pudimos recuperar tu objetivo guardado.')
      return primarySearchFromResponse(body)
    }).then(search => {
      if (controller.signal.aborted) return
      setSavedSearch(search); setReadStatus('ready')
      // A delayed read never replaces a draft or a deliberate view change.
      if (!initialized.current && startedWith === 0 && draftVersion.current === 0 && search) {
        setDraft(copyOpportunityFilters(search.filters))
        if (!search.needsConfirmation) setApplied(copyOpportunityFilters(search.filters))
        setView(search.needsConfirmation ? 'explore' : 'saved')
      }
      initialized.current = true
    }).catch(error => {
      if (!controller.signal.aborted) { setReadStatus('error'); setReadError(error instanceof Error ? error.message : 'No pudimos recuperar tu objetivo guardado.') }
    })
    return () => controller.abort()
  }, [retry, endpoint])
  const edited = Boolean(pendingRole.trim()) || Boolean(savedSearch && !sameSearchFilters(draft, savedSearch.filters))
  function change(filters: OpportunityFilters) { draftVersion.current++; setDraft(copyOpportunityFilters(filters)); setNotice(null) }
  function chooseView(next: OpportunityView) { draftVersion.current++; setView(next); setNotice(null) }
  function apply(filters: OpportunityFilters) {
    setApplied(copyOpportunityFilters(filters)); setView('explore'); setNotice(null); setRefreshKey(value => value + 1)
  }
  function saved(search: SavedPrimarySearch) {
    setSavedSearch(search); setDraft(copyOpportunityFilters(search.filters)); setPendingRole(''); setReadStatus('ready')
    setView('saved'); setNotice(objectiveOnly ? 'Tu objetivo quedó guardado. Podrás recuperarlo al llegar al Radar y editarlo cuando quieras.' : 'Tu objetivo quedó guardado. Estos son sus resultados actuales.'); setRefreshKey(value => value + 1)
  }
  function restoreSaved() {
    if (!savedSearch) return
    change(savedSearch.filters); setPendingRole(''); setView('explore'); setNotice(objectiveOnly ? 'Recuperamos lo guardado. Puedes editarlo y guardar tus cambios.' : 'Recuperamos lo guardado. Ver ofertas aplica cualquier edición nueva.')
  }
  return <div className="min-w-0 space-y-6">
    <section aria-label="Tu objetivo guardado" className="min-w-0 space-y-3 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold">Tu objetivo laboral</h2>
      {readStatus === 'loading' && <p role="status" className="text-sm text-muted-foreground">Recuperando tu objetivo guardado… Puedes empezar a definir tu próximo paso.</p>}
      {readStatus === 'error' && <div role="alert" className="space-y-2"><p className="text-sm">{readError}</p><Button type="button" variant="outline" onClick={() => setRetry(value => value + 1)}>Volver a cargar lo guardado</Button></div>}
      {readStatus === 'ready' && !savedSearch && <p className="text-sm text-muted-foreground">Todavía no guardaste un objetivo. Puedes definirlo o explorar sin elegir un cargo.</p>}
      {savedSearch && <>
        <p className="text-sm text-muted-foreground">{savedSearch.needsConfirmation ? 'Recuperamos una búsqueda anterior. Revisa si sigue representando lo que buscas antes de confirmarla.' : 'Esta es tu búsqueda guardada. Puedes revisarla y editarla cuando cambie tu objetivo.'}</p>
        <ul className="flex flex-wrap gap-2" aria-label="Resumen del objetivo guardado">{objectiveSummary(savedSearch.filters).map(item => <li key={item} className="max-w-full break-words rounded-lg bg-muted px-3 py-2 text-sm">{item}</li>)}</ul>
        {(savedSearch.advanced.seniorityMin || savedSearch.advanced.salaryMinClp !== null || savedSearch.advanced.languages.length > 0 || savedSearch.advanced.employmentTypes.length > 0) && <details className="text-sm"><summary className="min-h-11 cursor-pointer py-3">Otras preferencias conservadas</summary><p className="break-words text-muted-foreground">{[savedSearch.advanced.seniorityMin, savedSearch.advanced.salaryMinClp !== null ? 'Renta mínima: $' + savedSearch.advanced.salaryMinClp.toLocaleString('es-CL') : null, ...savedSearch.advanced.languages, ...savedSearch.advanced.employmentTypes].filter(Boolean).join(' · ')}. Se conservan al editar; revisa estas condiciones en cada aviso.</p></details>}
        <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={saving} onClick={() => chooseView('explore')}>{edited ? 'Continuar mi borrador' : 'Editar mi objetivo'}</Button>{edited && <Button type="button" variant="ghost" disabled={saving} onClick={restoreSaved}>Reemplazar borrador por lo guardado</Button>}</div>
      </>}
    </section>
    {!objectiveOnly && <div className="flex flex-wrap gap-2" role="group" aria-label="Qué oportunidades quieres ver">
      <Button type="button" disabled={saving} variant={view === 'explore' ? 'default' : 'outline'} aria-pressed={view === 'explore'} className="min-h-11" onClick={() => chooseView('explore')}>Explorar ofertas</Button>
      <Button type="button" disabled={saving || readStatus !== 'ready'} variant={view === 'saved' ? 'default' : 'outline'} aria-pressed={view === 'saved'} className="min-h-11" onClick={() => chooseView('saved')}>Mi búsqueda guardada</Button>
    </div>}
    {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
    {view === 'explore' && <SearchIntentForm value={draft} applied={applied} role={pendingRole}
      onRoleChange={value => { draftVersion.current++; setPendingRole(value) }} seedRole={seedRole}
      onChange={change} onApply={apply} onSaved={saved} saving={saving} onSavingChange={setSaving}
      savedSearch={savedSearch} saveReady={readStatus === 'ready'}
      mode={mode} saveEndpoint={endpoint}
      onConflict={() => { setReadStatus('error'); setReadError('Tu objetivo cambió en otra sesión. Vuelve a cargarlo y compáralo con tu borrador antes de guardar.') }} />}
    {!objectiveOnly && <RealOpportunityResults view={view} filters={applied} refreshKey={refreshKey} onExplore={() => chooseView('explore')} />}
  </div>
}
