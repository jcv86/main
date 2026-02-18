'use client'

import { CoachProvider } from '@/contexts/coach-context'
import { CoachSidebar } from '@/components/coach-sidebar'

export default function A4Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProvider>
      <div className="min-h-screen">
        {children}
      </div>
      <CoachSidebar />
    </CoachProvider>
  )
}
