import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-foundation'
import { JourneyFlowPanel } from '@/components/journey/journey-flow-panel'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadJourneyFlow } from '@/lib/journey/flow-service'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Mi recorrido A1–A4 | DespegaTuCarrera', robots: { index: false, follow: false } }

export default async function RecorridoPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin?next=/despega/recorrido')
  return <PageContainer><JourneyFlowPanel flow={await loadJourneyFlow(journey)} /></PageContainer>
}
