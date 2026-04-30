import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { DespegaNavbar } from '@/components/despega-navbar'
import { A2ProgressBar } from '@/components/a2-progress-bar'
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
        <A2ProgressBar />
        <main className="flex-1">
          {children}
        </main>
        <PremiumGamificationWidget />
      </div>
    </CoachProviderWrapper>
  )
}
