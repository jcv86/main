'use client'

import { useRouter } from 'next/navigation'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day7Experience } from '@/components/a2-day7-experience'
import { markTaskComplete } from '@/lib/supabase/task-completions'

const DIA_NUM = 7

export default function Dia7Page() {
  const router = useRouter()
  const { user } = useAuthRedirect()

  const handleDay7Complete = async (submission: any) => {
    try {
      console.log('[v0] Day 7 submission received:', submission)

      // Mark this task as complete in Supabase
      if (user?.id) {
        const result = await markTaskComplete(30, 7, 'Día 7 - Checkpoint A3')
        console.log('[v0] Task marked complete result:', result)
        
        if (!result) {
          console.warn('[v0] Failed to mark task complete, but continuing with navigation')
        }
      }

      // Wait a moment for Supabase to sync, then navigate
      await new Promise(resolve => setTimeout(resolve, 500))

      // Navigate to A2 progress dashboard with anchor to día-8
      console.log('[v0] Navigating to /despega/a2-routes#dia-8')
      router.push('/despega/a2-routes#dia-8')
    } catch (err) {
      console.error('[v0] Error in handleDay7Complete:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day7Experience onComplete={handleDay7Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
