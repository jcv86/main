import Link from 'next/link'
import type { Metadata } from 'next'
import { A2ChatCoach } from '@/components/a2-chat-coach'
import { PageContainer, PageHeader, PageStack } from '@/components/layout/page-foundation'
import { Button } from '@/components/ui/button'
import { requireJourneyModule } from '@/lib/journey/service'
import { loadJourneyFlow } from '@/lib/journey/flow-service'
import { loadGuidedNextAction } from '@/lib/journey/next-action-service'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Asistente de Tu Ruta | DespegaTuCarrera', robots: { index: false, follow: false } }

export default async function A2ChatCoachPage() {
  const journey = await requireJourneyModule('A2')
  const flow = await loadJourneyFlow(journey)
  const guidance = await loadGuidedNextAction(journey, flow)
  return (
    <PageContainer>
      <PageStack>
        <PageHeader eyebrow="Tu Ruta" title="Aclara tu siguiente paso"
          description="Conecta lo que quieres lograr con una acción que puedas realizar. El asistente usa tu recorrido guardado y distingue lo que aún falta verificar."
          actions={<Button asChild variant="outline"><Link href="/despega/a2">Volver a Tu Ruta</Link></Button>} />
        <A2ChatCoach key={journey.user.id} actorId={journey.user.id} initialGuidance={guidance} />
      </PageStack>
    </PageContainer>
  )
}
