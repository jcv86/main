import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { AppShell } from '@/components/layout/app-shell'
import { ShellBreadcrumbs } from '@/components/layout/shell-breadcrumbs'
import { redirect } from 'next/navigation'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadJourneyFlow } from '@/lib/journey/flow-service'

export default async function DespegaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')
  const flow = await loadJourneyFlow(journey)

  return (
    <CoachProviderWrapper>
      <AppShell flow={flow}>
        <ShellBreadcrumbs />
        {children}
      </AppShell>
    </CoachProviderWrapper>
  )
}
