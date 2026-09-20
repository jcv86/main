import { Metadata } from 'next'
import { phaseMetadata } from '@/lib/phase-metadata'
import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { requireJourneyModule } from '@/lib/journey/service'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { checkA4Access } from '@/lib/a4/access-control'
import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')
  if (!journey.access.a4) {
    const access = await checkA4Access(journey.user.id, createAdminClient())
    if (!access.canAccess) await requireJourneyModule('A4')
  }

  return (
    <CoachProviderWrapper>
      <div className="min-h-screen">
        {children}
      </div>
    </CoachProviderWrapper>
  )
}
