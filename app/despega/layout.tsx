import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { AppShell } from '@/components/layout/app-shell'

export default function DespegaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <AppShell>{children}</AppShell>
    </CoachProviderWrapper>
  )
}
