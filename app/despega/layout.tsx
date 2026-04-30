import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { DespegaNavbar } from '@/components/despega-navbar'
import { A2ProgressPanel } from '@/components/a2-progress-panel'
import { PremiumGamificationWidget } from '@/components/premium-gamification-widget'

export default function DespegaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <div className="min-h-screen flex flex-col">
        <DespegaNavbar />
        <div className="flex flex-1">
          {children}
          <A2ProgressPanel />
        </div>
        <PremiumGamificationWidget />
      </div>
    </CoachProviderWrapper>
  )
}
