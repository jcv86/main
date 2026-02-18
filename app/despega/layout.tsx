'use client'

import { CoachProvider } from '@/contexts/coach-context'
import { CoachSidebar } from '@/components/coach-sidebar'
import { NewsTicker } from '@/components/news-ticker'

export default function DespegaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProvider>
      <div className="min-h-screen">
        <NewsTicker />
        {children}
      </div>
      <CoachSidebar />
    </CoachProvider>
  )
}
