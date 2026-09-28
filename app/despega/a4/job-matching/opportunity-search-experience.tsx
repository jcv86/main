'use client'
import { useState } from 'react'
import { SearchIntentForm } from './search-intent-form'
import { RealOpportunityResults } from './real-opportunity-results'

export interface OpportunityProfileEvidence {
 targetRole?: string
 strengths: string[]
 missingProof: string[]
 nextBestActions: string[]
}

export function OpportunitySearchExperience({seedRole,profileEvidence}:{seedRole?:string|null;profileEvidence?:OpportunityProfileEvidence|null}){
 const [refreshKey,setRefreshKey]=useState(0)
 return <div className="space-y-8">
  <SearchIntentForm seedRole={seedRole} onSaved={()=>setRefreshKey(v=>v+1)}/>
  <RealOpportunityResults refreshKey={refreshKey} profileEvidence={profileEvidence}/>
 </div>
}
