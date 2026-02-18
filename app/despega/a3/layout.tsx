import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'
import { CoachSidebarWrapper } from '@/components/coach-sidebar-wrapper'

export default function A3Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <div className="min-h-screen">
        {children}
      </div>
      <CoachSidebarWrapper />
    </CoachProviderWrapper>
  )
}
