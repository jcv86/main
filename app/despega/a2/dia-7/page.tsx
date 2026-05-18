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
      console.log('[v0] Day 7 submission saved:', submission)
      if (user?.id) {
        await markTaskComplete(30, 7, 'Día 7 - Checkpoint A3')
      }
      router.push('/despega/a2-routes#dia-8')
    } catch (err) {
      console.error('[v0] Error saving Day 7:', err)
      throw err
    }
  }

  return (
    <A2DayPageTemplate dayNumber={DIA_NUM} userId={user?.id}>
      <Day7Experience onComplete={handleDay7Complete} userId={user?.id} />
    </A2DayPageTemplate>
  )
}
