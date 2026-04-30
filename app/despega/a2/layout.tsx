import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { A2ProgressSidebar } from '@/components/a2-progress-sidebar'

export default function A2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar Progress Timeline */}
        <A2ProgressSidebar />
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </CoachProviderWrapper>
  )
}
