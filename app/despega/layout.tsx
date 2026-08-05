import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { AppShell } from '@/components/layout/app-shell'
import { ShellBreadcrumbs } from '@/components/layout/shell-breadcrumbs'

export default function DespegaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <AppShell>
        <ShellBreadcrumbs />
        {children}
      </AppShell>
    </CoachProviderWrapper>
  )
}
