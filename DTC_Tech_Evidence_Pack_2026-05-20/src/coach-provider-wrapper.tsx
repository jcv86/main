'use client'

import { CoachProvider } from '@/contexts/coach-context'

export function CoachProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <CoachProvider>{children}</CoachProvider>
}
