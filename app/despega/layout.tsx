import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { DespeganNavbar } from '@/components/despega-navbar'
import { PremiumGamificationWidget } from '@/components/premium-gamification-widget'

export default function DespegaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <div className="min-h-screen flex flex-col">
        <DespeganNavbar />
        <main className="flex-1">
          {children}
        </main>
        <PremiumGamificationWidget />
      </div>
    </CoachProviderWrapper>
  )
}
