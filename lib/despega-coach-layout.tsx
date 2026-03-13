'use client'

import { ReactNode } from 'react'
import { CoachChat } from '@/components/coach-chat'

interface DespegaLayoutProps {
  children: ReactNode
  stage?: 'a1' | 'a2' | 'a3' | 'a4'
}

export function DespegaWithCoachLayout({ children, stage = 'a1' }: DespegaLayoutProps) {
  return (
    <>
      {children}
      <CoachChat currentStage={stage} />
    </>
  )
}
