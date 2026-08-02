import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { A2ProgressSidebar } from '@/components/a2-progress-sidebar'
import { A2ActivityContinuityPanel } from '@/components/a2-activity-continuity-panel'

export default function A2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <div className="flex min-h-screen bg-background">
        <A2ProgressSidebar />

        <main className="flex-1">
          <A2ActivityContinuityPanel />
          {children}
        </main>
      </div>
    </CoachProviderWrapper>
  )
}
