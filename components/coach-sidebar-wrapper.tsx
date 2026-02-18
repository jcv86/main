'use client'

import { CoachSidebar } from '@/components/coach-sidebar'
import { NewsTicker } from '@/components/news-ticker'

export function CoachSidebarWrapper() {
  return (
    <>
      <NewsTicker />
      <CoachSidebar />
    </>
  )
}
