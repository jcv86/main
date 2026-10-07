'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { copyOpportunityFilters, type OpportunityFilters, type OpportunityView } from '@/lib/opportunities/search-query'
import { SearchIntentForm } from './search-intent-form'
import { RealOpportunityResults } from './real-opportunity-results'

export interface OpportunityProfileEvidence {
  targetRole?: string
  strengths: string[]
  missingProof: string[]
  nextBestActions: string[]
}
const INITIAL_FILTERS: OpportunityFilters = { targetRoles: [], breadth: 'related', locations: ['Metropolitana'], workModes: [] }

export function OpportunitySearchExperience({ seedRole, profileEvidence }: { seedRole?: string | null; profileEvidence?: OpportunityProfileEvidence | null }) {
  const [view, setView] = useState<OpportunityView>('explore')
  const [draft, setDraft] = useState(() => copyOpportunityFilters(INITIAL_FILTERS))
  const [pendingRole, setPendingRole] = useState('')
  const [applied, setApplied] = useState(() => copyOpportunityFilters(INITIAL_FILTERS))
  const [refreshKey, setRefreshKey] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  function apply(filters: OpportunityFilters) {
    setApplied(copyOpportunityFilters(filters)); setView('explore'); setNotice(null); setRefreshKey(value => value + 1)
  }
  function saved() {
    setView('saved'); setNotice('Tu búsqueda principal quedó guardada. Estos son sus resultados actuales.'); setRefreshKey(value => value + 1)
  }
  return <div className="min-w-0 space-y-6">
    <div className="flex flex-wrap gap-2" role="group" aria-label="Qué oportunidades quieres ver">
      <Button type="button" disabled={saving} variant={view === 'explore' ? 'default' : 'outline'} aria-pressed={view === 'explore'} className={view === 'explore' ? 'min-h-11 bg-[#3730a3] text-white hover:bg-[#312e81] hover:text-white' : 'min-h-11 border-[#64748b] bg-[#111827] text-white hover:bg-[#1f2937] hover:text-white'} onClick={() => { setView('explore'); setNotice(null) }}>Explorar ofertas</Button>
      <Button type="button" disabled={saving} variant={view === 'saved' ? 'default' : 'outline'} aria-pressed={view === 'saved'} className={view === 'saved' ? 'min-h-11 bg-[#3730a3] text-white hover:bg-[#312e81] hover:text-white' : 'min-h-11 border-[#64748b] bg-[#111827] text-white hover:bg-[#1f2937] hover:text-white'} onClick={() => { setView('saved'); setNotice(null) }}>Mi búsqueda guardada</Button>
    </div>
    {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
    {view === 'explore' && <SearchIntentForm value={draft} applied={applied} role={pendingRole} onRoleChange={setPendingRole} seedRole={seedRole} onChange={setDraft} onApply={apply} onSaved={saved} saving={saving} onSavingChange={setSaving} />}
    <RealOpportunityResults view={view} filters={applied} refreshKey={refreshKey} profileEvidence={profileEvidence} onExplore={() => setView('explore')} />
  </div>
}
