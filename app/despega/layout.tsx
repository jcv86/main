import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { DespegaNavbar } from '@/components/despega-navbar'
import { PremiumGamificationWidget } from '@/components/premium-gamification-widget'

export default function DespegaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DespegaNavbar />
      <main className="flex-1 pt-4">
        {children}
      </main>
      {/* <PremiumGamificationWidget /> */}
    </div>
  )
}
