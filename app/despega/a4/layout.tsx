import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'
import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { requireJourneyModule } from '@/lib/journey/service'

export const metadata: Metadata = {
  title: phaseMetadata.a4Dashboard.title,
  description: phaseMetadata.a4Dashboard.description,
  openGraph: {
    title: phaseMetadata.a4Dashboard.title,
    description: phaseMetadata.a4Dashboard.description,
  },
}

export default async function A4Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireJourneyModule('A4')

  return (
    <CoachProviderWrapper>
      <div className="min-h-screen">
        {children}
      </div>
    </CoachProviderWrapper>
  )
}
